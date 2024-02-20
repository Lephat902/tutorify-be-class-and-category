import { BadRequestException } from "@nestjs/common";
import { ClassCategoryRepository } from "src/category/repositories";

export async function validateAndFetchCategories(
    classCategoryRepository: ClassCategoryRepository,
    classCategoryIds: string[]
) {
    const classCategories = await Promise.all(
        classCategoryIds.map(id => classCategoryRepository.findOneBy({ id }))
    );

    if (classCategories.some(category => !category)) {
        throw new BadRequestException('One or more provided classCategoryIds are invalid.');
    }

    return classCategories;
}
