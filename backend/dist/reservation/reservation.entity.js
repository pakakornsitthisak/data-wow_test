"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
class Reservation {
    id;
    userId;
    concertId;
    createdAt;
    updatedAt;
    constructor(userId, concertId) {
        this.id = Date.now();
        this.userId = userId;
        this.concertId = concertId;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
exports.Reservation = Reservation;
//# sourceMappingURL=reservation.entity.js.map