import { Injectable, NotFoundException } from '@nestjs/common';
import { Concert } from './concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertService {
  private concerts: Concert[] = [];
  private nextId = 1;

  create(createConcertDto: CreateConcertDto): Concert {
    const concert = new Concert(
      createConcertDto.name,
      createConcertDto.description,
      createConcertDto.seat,
    );
    concert.id = this.nextId++;
    this.concerts.push(concert);
    return concert;
  }

  findAll(): Concert[] {
    return this.concerts;
  }

  findOne(id: number): Concert {
    const concert = this.concerts.find((c) => c.id === id);
    if (!concert) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }
    return concert;
  }

  remove(id: number): void {
    const index = this.concerts.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }
    this.concerts.splice(index, 1);
  }
}

