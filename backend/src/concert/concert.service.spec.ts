import { Test, TestingModule } from '@nestjs/testing';
import { ConcertService } from './concert.service';
import { NotFoundException } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';

describe('ConcertService', () => {
  let service: ConcertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcertService],
    }).compile();

    service = module.get<ConcertService>(ConcertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a concert', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      };

      const concert = service.create(createConcertDto);

      expect(concert).toBeDefined();
      expect(concert.name).toBe(createConcertDto.name);
      expect(concert.description).toBe(createConcertDto.description);
      expect(concert.seat).toBe(createConcertDto.seat);
      expect(concert.id).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of concerts', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      };

      service.create(createConcertDto);
      const concerts = service.findAll();

      expect(Array.isArray(concerts)).toBe(true);
      expect(concerts.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a concert by id', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      };

      const createdConcert = service.create(createConcertDto);
      const concert = service.findOne(createdConcert.id);

      expect(concert).toBeDefined();
      expect(concert.id).toBe(createdConcert.id);
    });

    it('should throw NotFoundException when concert not found', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a concert', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      };

      const createdConcert = service.create(createConcertDto);
      const initialCount = service.findAll().length;

      service.remove(createdConcert.id);
      const finalCount = service.findAll().length;

      expect(finalCount).toBe(initialCount - 1);
    });

    it('should throw NotFoundException when concert not found', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });
});

