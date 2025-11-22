import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertModule } from './concert/concert.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [ConcertModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
