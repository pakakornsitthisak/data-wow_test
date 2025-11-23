import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { Reservation, ReservationStatus } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ConcertService } from '../concert/concert.service';

@Injectable()
export class ReservationService {
  private reservations: Reservation[] = [];
  private nextId = 1;

  constructor(private readonly concertService: ConcertService) {}

  create(createReservationDto: CreateReservationDto): Reservation {
    // Check if concert exists
    const concert = this.concertService.findOne(createReservationDto.concertId);

    // Check if user already has an active reservation for this concert
    const existingReservation = this.reservations.find(
      (r) =>
        r.userId === createReservationDto.userId &&
        r.concertId === createReservationDto.concertId &&
        r.status === ReservationStatus.RESERVE,
    );

    if (existingReservation) {
      throw new ConflictException('User already has a reservation for this concert');
    }

    // Count existing active reservations for this concert
    const reservationCount = this.reservations.filter(
      (r) => r.concertId === createReservationDto.concertId && r.status === ReservationStatus.RESERVE,
    ).length;

    // Check if seats are available
    if (reservationCount >= concert.seat) {
      throw new BadRequestException('No seats available for this concert');
    }

    const reservation = new Reservation(
      createReservationDto.userId,
      createReservationDto.concertId,
    );
    reservation.id = this.nextId++;
    this.reservations.push(reservation);
    return reservation;
  }

  findAll(): Reservation[] {
    return this.reservations;
  }

  findByUserId(userId: string): Reservation[] {
    return this.reservations.filter((r) => r.userId === userId);
  }

  findOne(id: number): Reservation {
    const reservation = this.reservations.find((r) => r.id === id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  cancel(userId: string, reservationId: number): void {
    const reservation = this.findOne(reservationId);

    if (reservation.userId !== userId) {
      throw new BadRequestException('You can only cancel your own reservations');
    }

    if (reservation.status === ReservationStatus.CANCEL) {
      throw new BadRequestException('Reservation is already cancelled');
    }

    const index = this.reservations.findIndex((r) => r.id === reservationId);
    if (index !== -1) {
      this.reservations[index].status = ReservationStatus.CANCEL;
      this.reservations[index].updatedAt = new Date();
    }
  }

  getAllReservations(): Reservation[] {
    return this.reservations;
  }

  getReservationCountByConcertId(concertId: number): number {
    return this.reservations.filter(
      (r) => r.concertId === concertId && r.status === ReservationStatus.RESERVE,
    ).length;
  }

  getReservationIdsByUserAndConcert(userId: string, concertId: number): number[] {
    return this.reservations
      .filter(
        (r) =>
          r.userId === userId &&
          r.concertId === concertId &&
          r.status === ReservationStatus.RESERVE,
      )
      .map((r) => r.id);
  }

  getReservationsByConcertId(concertId: number): Reservation[] {
    return this.reservations.filter((r) => r.concertId === concertId);
  }
}

