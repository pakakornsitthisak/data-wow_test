"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Concert = void 0;
class Concert {
    id;
    name;
    description;
    seat;
    createdAt;
    updatedAt;
    constructor(name, description, seat) {
        this.id = Date.now();
        this.name = name;
        this.description = description;
        this.seat = seat;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
exports.Concert = Concert;
//# sourceMappingURL=concert.entity.js.map