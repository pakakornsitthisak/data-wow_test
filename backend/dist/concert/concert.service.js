"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcertService = void 0;
const common_1 = require("@nestjs/common");
const concert_entity_1 = require("./concert.entity");
let ConcertService = class ConcertService {
    concerts = [];
    nextId = 1;
    create(createConcertDto) {
        const concert = new concert_entity_1.Concert(createConcertDto.name, createConcertDto.description, createConcertDto.seat);
        concert.id = this.nextId++;
        this.concerts.push(concert);
        return concert;
    }
    findAll() {
        return this.concerts;
    }
    findOne(id) {
        const concert = this.concerts.find((c) => c.id === id);
        if (!concert) {
            throw new common_1.NotFoundException(`Concert with ID ${id} not found`);
        }
        return concert;
    }
    remove(id) {
        const index = this.concerts.findIndex((c) => c.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Concert with ID ${id} not found`);
        }
        this.concerts.splice(index, 1);
    }
};
exports.ConcertService = ConcertService;
exports.ConcertService = ConcertService = __decorate([
    (0, common_1.Injectable)()
], ConcertService);
//# sourceMappingURL=concert.service.js.map