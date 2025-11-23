"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = exports.ReservationStatus = void 0;
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["RESERVE"] = "reserve";
    ReservationStatus["CANCEL"] = "cancel";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
class Reservation {
    id;
    userId;
    concertId;
    status;
    createdAt;
    updatedAt;
    constructor(userId, concertId) {
        this.id = Date.now();
        this.userId = userId;
        this.concertId = concertId;
        this.status = ReservationStatus.RESERVE;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
exports.Reservation = Reservation;
//# sourceMappingURL=reservation.entity.js.map