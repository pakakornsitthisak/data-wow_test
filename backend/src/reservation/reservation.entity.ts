export class Reservation {
  id: number;
  userId: string;
  concertId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(userId: string, concertId: number) {
    this.id = Date.now();
    this.userId = userId;
    this.concertId = concertId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

