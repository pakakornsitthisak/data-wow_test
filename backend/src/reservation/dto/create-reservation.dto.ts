import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  concertId: number;
}

