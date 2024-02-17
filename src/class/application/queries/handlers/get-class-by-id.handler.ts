import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClassByIdQuery } from '../impl';
import { Class } from 'src/class/infrastructure/entities';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetClassByIdQuery)
export class GetClassByIdHandler implements IQueryHandler<GetClassByIdQuery> {
    constructor(private readonly classRepository: ClassRepository) { }

    async execute(query: GetClassByIdQuery): Promise<Class> {
        const { id } = query;
        const cl = await this.classRepository.findOneBy({ id });
        if (!cl) {
            throw new NotFoundException();
        }
        return cl;
    }
}