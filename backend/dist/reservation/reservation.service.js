"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const common_1 = require("@nestjs/common");
const reservation_entity_1 = require("./reservation.entity");
const concert_service_1 = require("../concert/concert.service");
let ReservationService = class ReservationService {
    concertService;
    reservations = [];
    nextId = 1;
    constructor(concertService) {
        this.concertService = concertService;
    }
    create(createReservationDto) {
        const concert = this.concertService.findOne(createReservationDto.concertId);
        const existingReservation = this.reservations.find((r) => r.userId === createReservationDto.userId &&
            r.concertId === createReservationDto.concertId &&
            r.status === reservation_entity_1.ReservationStatus.RESERVE);
        if (existingReservation) {
            throw new common_1.ConflictException('User already has a reservation for this concert');
        }
        const reservationCount = this.reservations.filter((r) => r.concertId === createReservationDto.concertId && r.status === reservation_entity_1.ReservationStatus.RESERVE).length;
        if (reservationCount >= concert.seat) {
            throw new common_1.BadRequestException('No seats available for this concert');
        }
        const reservation = new reservation_entity_1.Reservation(createReservationDto.userId, createReservationDto.concertId);
        reservation.id = this.nextId++;
        this.reservations.push(reservation);
        return reservation;
    }
    findAll() {
        return this.reservations;
    }
    findByUserId(userId) {
        return this.reservations.filter((r) => r.userId === userId);
    }
    findOne(id) {
        const reservation = this.reservations.find((r) => r.id === id);
        if (!reservation) {
            throw new common_1.NotFoundException(`Reservation with ID ${id} not found`);
        }
        return reservation;
    }
    cancel(userId, reservationId) {
        const reservation = this.findOne(reservationId);
        if (reservation.userId !== userId) {
            throw new common_1.BadRequestException('You can only cancel your own reservations');
        }
        if (reservation.status === reservation_entity_1.ReservationStatus.CANCEL) {
            throw new common_1.BadRequestException('Reservation is already cancelled');
        }
        const index = this.reservations.findIndex((r) => r.id === reservationId);
        this.reservations[index].status = reservation_entity_1.ReservationStatus.CANCEL;
        this.reservations[index].updatedAt = new Date();
    }
    getAllReservations() {
        return this.reservations;
    }
    getReservationCountByConcertId(concertId) {
        return this.reservations.filter((r) => r.concertId === concertId && r.status === reservation_entity_1.ReservationStatus.RESERVE).length;
    }
    getReservationIdsByUserAndConcert(userId, concertId) {
        return this.reservations
            .filter((r) => r.userId === userId &&
            r.concertId === concertId &&
            r.status === reservation_entity_1.ReservationStatus.RESERVE)
            .map((r) => r.id);
    }
    getReservationsByConcertId(concertId) {
        return this.reservations.filter((r) => r.concertId === concertId);
    }
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [concert_service_1.ConcertService])
], ReservationService);
//# sourceMappingURL=reservation.service.js.map