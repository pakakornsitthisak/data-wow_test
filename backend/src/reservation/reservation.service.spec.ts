import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { ConcertService } from '../concert/concert.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from './reservation.entity';

describe('ReservationService', () => {
  let service: ReservationService;
  let concertService: ConcertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationService, ConcertService],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    concertService = module.get<ConcertService>(ConcertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const createReservationDto: CreateReservationDto = {
        userId: 'user1',
        concertId: concert.id,
      };

      const reservation = service.create(createReservationDto);

      expect(reservation).toBeDefined();
      expect(reservation.userId).toBe(createReservationDto.userId);
      expect(reservation.concertId).toBe(createReservationDto.concertId);
      expect(reservation.status).toBe(ReservationStatus.RESERVE);
      expect(reservation.id).toBeDefined();
    });

    it('should throw NotFoundException when concert does not exist', () => {
      const createReservationDto: CreateReservationDto = {
        userId: 'user1',
        concertId: 999,
      };

      expect(() => service.create(createReservationDto)).toThrow(NotFoundException);
    });

    it('should throw ConflictException when user already has reservation', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const createReservationDto: CreateReservationDto = {
        userId: 'user1',
        concertId: concert.id,
      };

      service.create(createReservationDto);
      expect(() => service.create(createReservationDto)).toThrow(ConflictException);
    });

    it('should throw BadRequestException when no seats available', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 1, // Only 1 seat
      });

      service.create({ userId: 'user1', concertId: concert.id });

      expect(() =>
        service.create({ userId: 'user2', concertId: concert.id }),
      ).toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all reservations', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      service.create({ userId: 'user1', concertId: concert.id });
      service.create({ userId: 'user2', concertId: concert.id });

      const allReservations = service.findAll();

      expect(Array.isArray(allReservations)).toBe(true);
      expect(allReservations.length).toBeGreaterThanOrEqual(2);
    });

    it('should return empty array when no reservations exist', () => {
      const allReservations = service.findAll();

      expect(Array.isArray(allReservations)).toBe(true);
      expect(allReservations.length).toBe(0);
    });
  });

  describe('findByUserId', () => {
    it('should return reservations for a specific user', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      service.create({ userId: 'user1', concertId: concert.id });
      service.create({ userId: 'user2', concertId: concert.id });

      const userReservations = service.findByUserId('user1');

      expect(userReservations.length).toBe(1);
      expect(userReservations[0].userId).toBe('user1');
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = service.create({
        userId: 'user1',
        concertId: concert.id,
      });

      expect(reservation.status).toBe(ReservationStatus.RESERVE);
      service.cancel('user1', reservation.id);
      
      const cancelledReservation = service.findOne(reservation.id);
      expect(cancelledReservation.status).toBe(ReservationStatus.CANCEL);
    });

    it('should throw NotFoundException when reservation not found', () => {
      expect(() => service.cancel('user1', 999)).toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user tries to cancel someone else reservation', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = service.create({
        userId: 'user1',
        concertId: concert.id,
      });

      expect(() => service.cancel('user2', reservation.id)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException when reservation is already cancelled', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = service.create({
        userId: 'user1',
        concertId: concert.id,
      });

      service.cancel('user1', reservation.id);
      expect(() => service.cancel('user1', reservation.id)).toThrow(BadRequestException);
    });

    it('should update updatedAt timestamp when cancelling', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = service.create({
        userId: 'user1',
        concertId: concert.id,
      });

      const originalUpdatedAt = new Date(reservation.updatedAt);
      
      // Wait a bit to ensure timestamp changes
      const waitTime = 100;
      return new Promise((resolve) => {
        setTimeout(() => {
          service.cancel('user1', reservation.id);
          const cancelledReservation = service.findOne(reservation.id);
          expect(new Date(cancelledReservation.updatedAt).getTime()).toBeGreaterThanOrEqual(
            originalUpdatedAt.getTime(),
          );
          resolve(undefined);
        }, waitTime);
      });
    });
  });

  describe('getAllReservations', () => {
    it('should return all reservations', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      service.create({ userId: 'user1', concertId: concert.id });
      service.create({ userId: 'user2', concertId: concert.id });

      const allReservations = service.getAllReservations();

      expect(Array.isArray(allReservations)).toBe(true);
      expect(allReservations.length).toBeGreaterThanOrEqual(2);
    });

    it('should return all reservations including cancelled ones', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = service.create({ userId: 'user1', concertId: concert.id });
      service.cancel('user1', reservation.id);

      const allReservations = service.getAllReservations();

      expect(allReservations.length).toBeGreaterThan(0);
      const cancelledReservation = allReservations.find((r) => r.id === reservation.id);
      expect(cancelledReservation).toBeDefined();
      expect(cancelledReservation?.status).toBe(ReservationStatus.CANCEL);
    });
  });

  describe('getReservationCountByConcertId', () => {
    it('should return count of active reservations for a concert', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      service.create({ userId: 'user1', concertId: concert.id });
      service.create({ userId: 'user2', concertId: concert.id });
      
      const reservation3 = service.create({ userId: 'user3', concertId: concert.id });
      service.cancel('user3', reservation3.id); // Cancel one

      const count = service.getReservationCountByConcertId(concert.id);

      expect(count).toBe(2); // Only active reservations (status RESERVE)
    });

    it('should return 0 when no active reservations for concert', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const count = service.getReservationCountByConcertId(concert.id);

      expect(count).toBe(0);
    });

    it('should not count cancelled reservations', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = service.create({ userId: 'user1', concertId: concert.id });
      service.cancel('user1', reservation.id);

      const count = service.getReservationCountByConcertId(concert.id);

      expect(count).toBe(0);
    });
  });

  describe('getReservationIdsByUserAndConcert', () => {
    it('should return reservation IDs for user and concert', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = service.create({ userId: 'user1', concertId: concert.id });

      const ids = service.getReservationIdsByUserAndConcert('user1', concert.id);

      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBe(1);
      expect(ids[0]).toBe(reservation.id);
    });

    it('should return empty array when user has no active reservation for concert', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const ids = service.getReservationIdsByUserAndConcert('user1', concert.id);

      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBe(0);
    });

    it('should not return cancelled reservations', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = service.create({ userId: 'user1', concertId: concert.id });
      service.cancel('user1', reservation.id);

      const ids = service.getReservationIdsByUserAndConcert('user1', concert.id);

      expect(ids.length).toBe(0);
    });
  });

  describe('getReservationsByConcertId', () => {
    it('should return all reservations for a concert', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      service.create({ userId: 'user1', concertId: concert.id });
      service.create({ userId: 'user2', concertId: concert.id });

      const reservations = service.getReservationsByConcertId(concert.id);

      expect(Array.isArray(reservations)).toBe(true);
      expect(reservations.length).toBe(2);
      expect(reservations.every((r) => r.concertId === concert.id)).toBe(true);
    });

    it('should return reservations including cancelled ones', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = service.create({ userId: 'user1', concertId: concert.id });
      service.cancel('user1', reservation.id);

      const reservations = service.getReservationsByConcertId(concert.id);

      expect(reservations.length).toBe(1);
      expect(reservations[0].status).toBe(ReservationStatus.CANCEL);
    });

    it('should return empty array when no reservations for concert', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservations = service.getReservationsByConcertId(concert.id);

      expect(Array.isArray(reservations)).toBe(true);
      expect(reservations.length).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = service.create({
        userId: 'user1',
        concertId: concert.id,
      });

      const foundReservation = service.findOne(reservation.id);

      expect(foundReservation).toBeDefined();
      expect(foundReservation.id).toBe(reservation.id);
      expect(foundReservation.userId).toBe('user1');
    });

    it('should throw NotFoundException when reservation not found', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });
});

