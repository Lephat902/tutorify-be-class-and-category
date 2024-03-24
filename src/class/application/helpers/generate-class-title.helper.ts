import { ClassCategory } from "src/category/entities";

// Function to generate class title based on the first class category
export function generateClassTitle(classCategories: ClassCategory[]): string {
  const firstClassCategory = classCategories[0];
  const subjectName = firstClassCategory.subject.name;
  const levelName = firstClassCategory.level.name;

  return `${subjectName} ${levelName}`;
}