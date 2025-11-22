export class Concert {
  id: number;
  name: string;
  description: string;
  seat: number; // total seats
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, description: string, seat: number) {
    this.id = Date.now(); // Simple ID generation
    this.name = name;
    this.description = description;
    this.seat = seat;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

