export enum ExperienceLevel {
  ENTRY = 'Entry level',
  INTERMEDIATE = 'Intermediate',
  EXPERT = 'Expert'
}

export const getExperienceOptions = () =>
  Object.values(ExperienceLevel).map(value => ({ value, label: value }));