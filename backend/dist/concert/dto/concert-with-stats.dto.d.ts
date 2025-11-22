import { Concert } from '../concert.entity';
export declare class ConcertWithStatsDto extends Concert {
    reservedCount: number;
    availableSeats: number;
}
