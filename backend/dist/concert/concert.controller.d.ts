import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';
export declare class ConcertController {
    private readonly concertService;
    constructor(concertService: ConcertService);
    create(createConcertDto: CreateConcertDto): import("./concert.entity").Concert;
    findAll(): import("./concert.entity").Concert[];
    findOne(id: number): import("./concert.entity").Concert;
    remove(id: number): {
        message: string;
    };
}
