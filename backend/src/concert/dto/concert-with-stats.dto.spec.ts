import { ConcertWithStatsDto } from './concert-with-stats.dto';
import { Concert } from '../concert.entity';

describe('ConcertWithStatsDto', () => {
  it('should extend Concert class', () => {
    const dto = new ConcertWithStatsDto('Test Concert', 'Test Description', 100);
    
    expect(dto).toBeInstanceOf(Concert);
  });

  it('should have reservedCount property', () => {
    const dto = new ConcertWithStatsDto('Test Concert', 'Test Description', 100);
    dto.reservedCount = 50;

    expect(dto.reservedCount).toBe(50);
  });

  it('should have availableSeats property', () => {
    const dto = new ConcertWithStatsDto('Test Concert', 'Test Description', 100);
    dto.availableSeats = 50;

    expect(dto.availableSeats).toBe(50);
  });

  it('should inherit properties from Concert', () => {
    const dto = new ConcertWithStatsDto('Test Concert', 'Test Description', 100);
    dto.id = 1;
    dto.reservedCount = 50;
    dto.availableSeats = 50;

    expect(dto.id).toBe(1);
    expect(dto.name).toBe('Test Concert');
    expect(dto.description).toBe('Test Description');
    expect(dto.seat).toBe(100);
    expect(dto.reservedCount).toBe(50);
    expect(dto.availableSeats).toBe(50);
  });
});

