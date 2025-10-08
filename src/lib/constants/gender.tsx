export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHERS = 'Others',
  ANY = 'Any'
}

export const getGenderOptions = () =>
  Object.values(Gender).map(value => ({ value, label: value }));