export declare enum ReservationStatus {
    RESERVE = "reserve",
    CANCEL = "cancel"
}
export declare class Reservation {
    id: number;
    userId: string;
    concertId: number;
    status: ReservationStatus;
    createdAt: Date;
    updatedAt: Date;
    constructor(userId: string, concertId: number);
}
