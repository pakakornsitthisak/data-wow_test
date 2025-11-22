import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.reservationService.findByUserId(userId);
    }
    return this.reservationService.getAllReservations();
  }

  @Delete('cancel')
  @UsePipes(new ValidationPipe())
  cancel(@Body() cancelReservationDto: CancelReservationDto) {
    this.reservationService.cancel(
      cancelReservationDto.userId,
      cancelReservationDto.reservationId,
    );
    return { message: 'Reservation cancelled successfully' };
  }
}

