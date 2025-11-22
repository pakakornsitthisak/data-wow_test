import { Concert } from './concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
export declare class ConcertService {
    private concerts;
    private nextId;
    create(createConcertDto: CreateConcertDto): Concert;
    findAll(): Concert[];
    findOne(id: number): Concert;
    remove(id: number): void;
}
