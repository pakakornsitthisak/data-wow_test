export enum ReservationStatus {
  RESERVE = 'reserve',
  CANCEL = 'cancel',
}

export class Reservation {
  id: number;
  userId: string;
  concertId: number;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(userId: string, concertId: number) {
    this.id = Date.now();
    this.userId = userId;
    this.concertId = concertId;
    this.status = ReservationStatus.RESERVE;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

