export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  ANY = 'Any'
}

export const getGenderOptions = () =>
  Object.values(Gender).map(value => ({ value, label: value }));