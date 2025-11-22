import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ConcertModule } from '../concert/concert.module';

@Module({
  imports: [ConcertModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}

