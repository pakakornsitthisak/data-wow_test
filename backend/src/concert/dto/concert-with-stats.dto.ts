import { Concert } from '../concert.entity';

export class ConcertWithStatsDto extends Concert {
  reservedCount: number;
  availableSeats: number;
}

