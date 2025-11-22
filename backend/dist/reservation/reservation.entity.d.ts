export declare class Reservation {
    id: number;
    userId: string;
    concertId: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(userId: string, concertId: number);
}
