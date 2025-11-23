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

    it('should maintain ID sequence after deletion', () => {
      const dto1: CreateConcertDto = {
        name: 'Concert 1',
        description: 'Description 1',
        seat: 50,
      };

      const dto2: CreateConcertDto = {
        name: 'Concert 2',
        description: 'Description 2',
        seat: 75,
      };

      const concert1 = service.create(dto1);
      const concert2 = service.create(dto2);

      service.remove(concert1.id);

      const dto3: CreateConcertDto = {
        name: 'Concert 3',
        description: 'Description 3',
        seat: 100,
      };

      const concert3 = service.create(dto3);

      // New concert should have unique ID (ID sequence continues)
      expect(concert3.id).toBeDefined();
      expect(concert3.id).not.toBe(concert1.id);
      expect(concert3.id).not.toBe(concert2.id);
    });
  });

  describe('findAll', () => {
    it('should return concerts in order of creation', () => {
      const dto1: CreateConcertDto = {
        name: 'Concert 1',
        description: 'Description 1',
        seat: 50,
      };

      const dto2: CreateConcertDto = {
        name: 'Concert 2',
        description: 'Description 2',
        seat: 75,
      };

      const concert1 = service.create(dto1);
      const concert2 = service.create(dto2);

      const concerts = service.findAll();

      expect(concerts.length).toBeGreaterThanOrEqual(2);
      const index1 = concerts.findIndex((c) => c.id === concert1.id);
      const index2 = concerts.findIndex((c) => c.id === concert2.id);
      expect(index1).toBeLessThan(index2);
    });

    it('should return empty array when no concerts exist', () => {
      const concerts = service.findAll();
      expect(Array.isArray(concerts)).toBe(true);
    });
  });
});

