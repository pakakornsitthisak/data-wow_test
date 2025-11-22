import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { ConcertService } from '../concert/concert.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';

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

      const initialCount = service.findByUserId('user1').length;
      service.cancel('user1', reservation.id);
      const finalCount = service.findByUserId('user1').length;

      expect(finalCount).toBe(initialCount - 1);
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
  });
});

