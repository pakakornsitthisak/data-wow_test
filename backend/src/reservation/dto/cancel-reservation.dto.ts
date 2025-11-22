import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CancelReservationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  reservationId: number;
}

