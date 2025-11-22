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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcertController = void 0;
const common_1 = require("@nestjs/common");
const concert_service_1 = require("./concert.service");
const create_concert_dto_1 = require("./dto/create-concert.dto");
let ConcertController = class ConcertController {
    concertService;
    constructor(concertService) {
        this.concertService = concertService;
    }
    create(createConcertDto) {
        return this.concertService.create(createConcertDto);
    }
    findAll() {
        return this.concertService.findAll();
    }
    findOne(id) {
        return this.concertService.findOne(id);
    }
    remove(id) {
        this.concertService.remove(id);
        return { message: 'Concert deleted successfully' };
    }
};
exports.ConcertController = ConcertController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_concert_dto_1.CreateConcertDto]),
    __metadata("design:returntype", void 0)
], ConcertController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConcertController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ConcertController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ConcertController.prototype, "remove", null);
exports.ConcertController = ConcertController = __decorate([
    (0, common_1.Controller)('concerts'),
    __metadata("design:paramtypes", [concert_service_1.ConcertService])
], ConcertController);
//# sourceMappingURL=concert.controller.js.map