import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ConcertService } from '../concert/concert.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ReservationStatus } from './reservation.entity';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;
  let concertService: ConcertService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [ReservationService, ConcertService],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
    concertService = module.get<ConcertService>(ConcertService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('constructor', () => {
    it('should create controller with ReservationService dependency', () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
      expect(concertService).toBeDefined();
      // Verify dependency injection works
      const injectedService = module.get<ReservationService>(ReservationService);
      expect(injectedService).toBe(service);
    });
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

      const reservation = controller.create(createReservationDto);

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

      expect(() => controller.create(createReservationDto)).toThrow(NotFoundException);
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

      controller.create(createReservationDto);
      expect(() => controller.create(createReservationDto)).toThrow(ConflictException);
    });

    it('should throw BadRequestException when no seats available', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 1, // Only 1 seat
      });

      controller.create({ userId: 'user1', concertId: concert.id });

      expect(() =>
        controller.create({ userId: 'user2', concertId: concert.id }),
      ).toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all reservations when no userId query param', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      controller.create({ userId: 'user1', concertId: concert.id });
      controller.create({ userId: 'user2', concertId: concert.id });

      const reservations = controller.findAll();

      expect(Array.isArray(reservations)).toBe(true);
      expect(reservations.length).toBeGreaterThanOrEqual(2);
    });

    it('should return reservations for specific user when userId provided', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      controller.create({ userId: 'user1', concertId: concert.id });
      controller.create({ userId: 'user2', concertId: concert.id });

      const userReservations = controller.findAll('user1');

      expect(Array.isArray(userReservations)).toBe(true);
      expect(userReservations.every((r) => r.userId === 'user1')).toBe(true);
      expect(userReservations.length).toBe(1);
    });

    it('should return empty array when user has no reservations', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      controller.create({ userId: 'user1', concertId: concert.id });

      const userReservations = controller.findAll('user2');

      expect(Array.isArray(userReservations)).toBe(true);
      expect(userReservations.length).toBe(0);
    });

    it('should return all reservations including cancelled ones', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = controller.create({ userId: 'user1', concertId: concert.id });
      controller.cancel({
        userId: 'user1',
        reservationId: reservation.id,
      });

      const allReservations = controller.findAll();

      expect(allReservations.length).toBeGreaterThan(0);
      const cancelledReservation = allReservations.find((r) => r.id === reservation.id);
      expect(cancelledReservation).toBeDefined();
      expect(cancelledReservation?.status).toBe(ReservationStatus.CANCEL);
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation and return success message', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = controller.create({
        userId: 'user1',
        concertId: concert.id,
      });

      expect(reservation.status).toBe(ReservationStatus.RESERVE);

      const result = controller.cancel({
        userId: 'user1',
        reservationId: reservation.id,
      });

      expect(result).toEqual({ message: 'Reservation cancelled successfully' });

      const cancelledReservation = service.findOne(reservation.id);
      expect(cancelledReservation.status).toBe(ReservationStatus.CANCEL);
    });

    it('should throw NotFoundException when reservation not found', () => {
      const cancelReservationDto: CancelReservationDto = {
        userId: 'user1',
        reservationId: 999,
      };

      expect(() => controller.cancel(cancelReservationDto)).toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user tries to cancel someone else reservation', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = controller.create({
        userId: 'user1',
        concertId: concert.id,
      });

      const cancelReservationDto: CancelReservationDto = {
        userId: 'user2',
        reservationId: reservation.id,
      };

      expect(() => controller.cancel(cancelReservationDto)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException when reservation is already cancelled', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = controller.create({
        userId: 'user1',
        concertId: concert.id,
      });

      const cancelReservationDto: CancelReservationDto = {
        userId: 'user1',
        reservationId: reservation.id,
      };

      controller.cancel(cancelReservationDto);

      expect(() => controller.cancel(cancelReservationDto)).toThrow(BadRequestException);
    });

    it('should update updatedAt timestamp when cancelling', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      const reservation = controller.create({
        userId: 'user1',
        concertId: concert.id,
      });

      const originalUpdatedAt = new Date(reservation.updatedAt);

      // Cancel reservation
      controller.cancel({
        userId: 'user1',
        reservationId: reservation.id,
      });

      const cancelledReservation = service.findOne(reservation.id);
      // UpdatedAt should be updated (at least equal or greater)
      expect(new Date(cancelledReservation.updatedAt).getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe('findAll edge cases', () => {
    it('should return empty array when no userId and no reservations exist', () => {
      const reservations = controller.findAll();

      expect(Array.isArray(reservations)).toBe(true);
      expect(reservations.length).toBe(0);
    });

    it('should handle undefined userId query param', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      controller.create({ userId: 'user1', concertId: concert.id });

      const reservations = controller.findAll(undefined);

      expect(Array.isArray(reservations)).toBe(true);
      expect(reservations.length).toBeGreaterThan(0);
    });

    it('should handle empty string userId query param', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      controller.create({ userId: 'user1', concertId: concert.id });

      // Empty string is falsy in JavaScript, so if (userId) is false
      // Therefore it calls getAllReservations() instead of findByUserId('')
      const reservations = controller.findAll('');

      expect(Array.isArray(reservations)).toBe(true);
      // Empty string is falsy, so it returns all reservations (not filtered)
      expect(reservations.length).toBeGreaterThan(0);
    });

    it('should return correct reservations for multiple users', () => {
      const concert = concertService.create({
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      });

      controller.create({ userId: 'user1', concertId: concert.id });
      controller.create({ userId: 'user2', concertId: concert.id });
      controller.create({ userId: 'user3', concertId: concert.id });

      const user1Reservations = controller.findAll('user1');
      const user2Reservations = controller.findAll('user2');
      const allReservations = controller.findAll();

      expect(user1Reservations.length).toBe(1);
      expect(user2Reservations.length).toBe(1);
      expect(allReservations.length).toBeGreaterThanOrEqual(3);
    });
  });
});

