import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Level } from '../entities';

@Injectable()
export class LevelRepository extends Repository<Level> {
  constructor(private dataSource: DataSource) {
    super(Level, dataSource.createEntityManager());
  }
}
