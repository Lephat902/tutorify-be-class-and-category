import { IQuery } from '@nestjs/cqrs';

export class GetClassByIdQuery implements IQuery {
    constructor(
        public readonly id: string,
    ) { }
}