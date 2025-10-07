export enum ExperienceLevel {
  ENTRY = 'Entry level',
  EXPERIENCED = 'Experienced',
  EXPERT = 'Expert'
}

export const getExperienceOptions = () =>
  Object.values(ExperienceLevel).map(value => ({ value, label: value }));