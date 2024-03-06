const defaultClassImages: string[] = [
  'https://img.freepik.com/free-photo/portrait-young-school-student_23-2151110122.jpg',
  'https://img.freepik.com/free-vector/geometric-science-education-background-vector-gradient-blue-digital-remix_53876-125993.jpg',
  'https://img.freepik.com/premium-photo/learning-environment-school-pupils-actively-raising-their-hands-seek-teacher-attention_210545-2574.jpg',
  'https://img.freepik.com/free-photo/person-with-books-digital-art-style-education-day_23-2151164354.jpg',
  'https://img.freepik.com/free-vector/education-horizontal-typography-banner-set-with-learning-knowledge-symbols-flat-illustration_1284-29493.jpg',
  'https://img.freepik.com/free-vector/abstract-low-polygonal-graduation-cap-planet-earth-globe-model-map-e-learning-concept_127544-1106.jpg',
  'https://img.freepik.com/free-photo/red-stationery-near-clock-apple-blackboard_23-2148199918.jpg',
  'https://img.freepik.com/premium-photo/group-diverse-graduating-students_53876-141438.jpg',
  'https://img.freepik.com/free-photo/black-female-it-specialist-sitting-beside-modern-computer-with-black-screen-talking-with-friends-indoor-portrait-busy-young-people-working-international-company_197531-25391.jpg',
  'https://img.freepik.com/free-vector/hand-drawn-international-day-education-background_52683-149036.jpg',
  'https://img.freepik.com/free-photo/young-asia-businesswoman-using-laptop-talk-colleague-about-plan-video-call-meeting-while-work-from-home-living-room_7861-3149.jpg',
  'https://img.freepik.com/free-photo/confident-teacher-explaining-lesson-pupils_74855-9751.jpg',
  'https://img.freepik.com/free-photo/young-asia-financial-student-ladies-watching-lesson-online-studying-with-laptop-tablet-living-room-from-home-night_7861-3429.jpg',
  'https://img.freepik.com/free-vector/students-watching-webinar-computer-studying-online_74855-15522.jpg',
  'https://img.freepik.com/free-photo/books-with-graduation-cap-digital-art-style-education-day_23-2151164326.jpg',
  'https://img.freepik.com/free-vector/happy-women-learning-language-online-isolated-flat-vector-illustration-cartoon-female-characters-taking-individual-lessons-through-messenger-education-digital-technology-concept_74855-10088.jpg',
  'https://img.freepik.com/free-photo/3d-student-graduation-cap-books-stack_107791-15667.jpg',
  'https://img.freepik.com/premium-photo/asian-students-taking-exam_33745-1142.jpg',
  'https://img.freepik.com/free-vector/illustration-university-graduates_53876-28466.jpg',
  'https://img.freepik.com/premium-photo/kindergarten-children-classroom-school-thailand-student-raising-his-hand-answer-teacher-s-question-children-enjoy-are-happy-study_140555-1277.jpg',
  'https://img.freepik.com/free-photo/city-committed-education-collage-concept_23-2150062204.jpg',
  'https://img.freepik.com/free-photo/international-day-education-cartoon-style_23-2151007486.jpg',
  'https://img.freepik.com/premium-photo/two-girls-black-gowns-standing-look-up-sky-with-happy-graduates_28658-104.jpg',
  'https://img.freepik.com/free-photo/education-concept-student-studying-brainstorming-campus-concept-close-up-students-discussing-their-subject-books-textbooks-selective-focus_1418-627.jpg',
  'https://img.freepik.com/free-photo/book-with-green-board-background_1150-3837.jpg',
  'https://img.freepik.com/premium-photo/school-classroom-with-chairsdesks-without-student_258219-265.jpg',
  'https://img.freepik.com/premium-photo/rear-view-audience-listening-asian-speaker-stage-meeting-room_41418-4150.jpg',
  'https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-open-book-education-day_23-2149241017.jpg',
  'https://img.freepik.com/free-photo/front-view-stacked-books-earth-globe-open-book-pencils-education-day_23-2149241018.jpg',
];

export function getRandomClassImageURL() {
  const randomIndex = Math.floor(Math.random() * defaultClassImages.length);
  return defaultClassImages[randomIndex];
}
