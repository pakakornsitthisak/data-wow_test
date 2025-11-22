import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ConcertService } from '../concert/concert.service';
export declare class ReservationService {
    private readonly concertService;
    private reservations;
    private nextId;
    constructor(concertService: ConcertService);
    create(createReservationDto: CreateReservationDto): Reservation;
    findAll(): Reservation[];
    findByUserId(userId: string): Reservation[];
    findOne(id: number): Reservation;
    cancel(userId: string, reservationId: number): void;
    getAllReservations(): Reservation[];
    getReservationCountByConcertId(concertId: number): number;
    getReservationIdsByUserAndConcert(userId: string, concertId: number): number[];
    getReservationsByConcertId(concertId: number): Reservation[];
}
