import { Repository, SelectQueryBuilder } from "typeorm";

export function addGroupByColumns<T, U>(
    query: SelectQueryBuilder<T>,
    alias: string,
    repository: Repository<U>,
) {
    repository.metadata.columns.forEach(column => {
        query.addGroupBy(`${alias}.${column.propertyName}`);
    });
}