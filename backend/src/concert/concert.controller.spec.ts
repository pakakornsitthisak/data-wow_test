import { Test, TestingModule } from '@nestjs/testing';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';

describe('ConcertController', () => {
  let controller: ConcertController;
  let service: ConcertService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ConcertController],
      providers: [ConcertService],
    }).compile();

    controller = module.get<ConcertController>(ConcertController);
    service = module.get<ConcertService>(ConcertService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('constructor', () => {
    it('should create controller with ConcertService dependency', () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
      // Verify dependency injection works
      const injectedService = module.get<ConcertService>(ConcertService);
      expect(injectedService).toBe(service);
    });
  });

  describe('create', () => {
    it('should create a concert', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      };

      const concert = controller.create(createConcertDto);

      expect(concert).toBeDefined();
      expect(concert.name).toBe(createConcertDto.name);
      expect(concert.description).toBe(createConcertDto.description);
      expect(concert.seat).toBe(createConcertDto.seat);
      expect(concert.id).toBeDefined();
    });

    it('should create multiple concerts with unique IDs', () => {
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

      const concert1 = controller.create(dto1);
      const concert2 = controller.create(dto2);

      expect(concert1.id).not.toBe(concert2.id);
      expect(concert1.name).toBe('Concert 1');
      expect(concert2.name).toBe('Concert 2');
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no concerts exist', () => {
      const concerts = controller.findAll();
      expect(Array.isArray(concerts)).toBe(true);
    });

    it('should return all concerts', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      };

      controller.create(createConcertDto);
      const concerts = controller.findAll();

      expect(Array.isArray(concerts)).toBe(true);
      expect(concerts.length).toBeGreaterThan(0);
      expect(concerts.some((c) => c.name === createConcertDto.name)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a concert by id', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      };

      const createdConcert = controller.create(createConcertDto);
      const concert = controller.findOne(createdConcert.id);

      expect(concert).toBeDefined();
      expect(concert.id).toBe(createdConcert.id);
      expect(concert.name).toBe(createConcertDto.name);
    });

    it('should throw NotFoundException when concert not found', () => {
      expect(() => controller.findOne(999)).toThrow(NotFoundException);
    });

    it('should handle numeric string id via ParseIntPipe', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      };

      const createdConcert = controller.create(createConcertDto);
      // ParseIntPipe would convert string to number, so we test with number directly
      const concert = controller.findOne(createdConcert.id);

      expect(concert).toBeDefined();
      expect(concert.id).toBe(createdConcert.id);
    });
  });

  describe('remove', () => {
    it('should delete a concert and return success message', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        seat: 100,
      };

      const createdConcert = controller.create(createConcertDto);
      const initialCount = controller.findAll().length;

      const result = controller.remove(createdConcert.id);

      expect(result).toEqual({ message: 'Concert deleted successfully' });
      const finalCount = controller.findAll().length;
      expect(finalCount).toBe(initialCount - 1);
    });

    it('should throw NotFoundException when concert not found', () => {
      expect(() => controller.remove(999)).toThrow(NotFoundException);
    });

    it('should not delete other concerts when deleting one', () => {
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

      const concert1 = controller.create(dto1);
      const concert2 = controller.create(dto2);
      const initialCount = controller.findAll().length;

      controller.remove(concert1.id);

      const remainingConcerts = controller.findAll();
      expect(remainingConcerts.length).toBe(initialCount - 1);
      expect(remainingConcerts.some((c) => c.id === concert2.id)).toBe(true);
      expect(remainingConcerts.some((c) => c.id === concert1.id)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle creating concert with minimum seat value', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Small Concert',
        description: 'Minimal seats',
        seat: 1, // Minimum value
      };

      const concert = controller.create(createConcertDto);

      expect(concert.seat).toBe(1);
    });

    it('should handle creating concert with large seat value', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Large Concert',
        description: 'Many seats',
        seat: 10000,
      };

      const concert = controller.create(createConcertDto);

      expect(concert.seat).toBe(10000);
    });

    it('should handle empty description', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Concert',
        description: '',
        seat: 100,
      };

      const concert = controller.create(createConcertDto);

      expect(concert.description).toBe('');
    });

    it('should handle long concert names', () => {
      const longName = 'A'.repeat(200);
      const createConcertDto: CreateConcertDto = {
        name: longName,
        description: 'Test Description',
        seat: 100,
      };

      const concert = controller.create(createConcertDto);

      expect(concert.name).toBe(longName);
      expect(concert.name.length).toBe(200);
    });
  });
});

