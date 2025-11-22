import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
export declare class ReservationController {
    private readonly reservationService;
    constructor(reservationService: ReservationService);
    create(createReservationDto: CreateReservationDto): import("./reservation.entity").Reservation;
    findAll(userId?: string): import("./reservation.entity").Reservation[];
    cancel(cancelReservationDto: CancelReservationDto): {
        message: string;
    };
}
