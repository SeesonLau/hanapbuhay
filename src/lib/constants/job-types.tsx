export enum JobType {
  AGRICULTURE = 'Agriculture',
  DIGITAL = 'Digital',
  IT = 'IT',
  CREATIVE = 'Creative',
  CONSTRUCTION = 'Construction',
  SERVICE = 'Service',
  SKILLED = 'Skilled',
  OTHER = 'Other'
}

export const SubTypes: Record<JobType, string[]> = {
  [JobType.AGRICULTURE]: [
    'Farmhand',
    'Fisherfolk',
    'Fruit Picker',
    'Rice Harvester/Thresher',
    'Coconut Climber',
    'Livestock Tender',
    'Market Porter (Kargador)',
    'Other'
  ],
  [JobType.DIGITAL]: [
    'Graphic Designer',
    'Online Seller',
    'Social Media Manager',
    'Online Tutor',
    'Content Creator',
    'Other'
  ],
  [JobType.IT]: [
    'Programmer',
    'Website Builder',
    'Mobile App Builder',
    'UI/UX Designer',
    'Technician',
    'Other'
  ],
  [JobType.CREATIVE]: [
    'Street Performer',
    'Tattoo Artist',
    'Handicraft Seller',
    'Portrait Artist',
    'Face Painter',
    'Videographer',
    'Photographer',
    'Artist',
    'Other'
  ],
  [JobType.CONSTRUCTION]: [
    'Mason',
    'Construction Helper',
    'Painter',
    'Tile Setter',
    'Roof Installer',
    'Demolition Worker',
    'Scaffolder',
    'Other'
  ],
  [JobType.SERVICE]: [
    'Waiter',
    'Barista',
    'Driver',
    'House Helper',
    'Laundry Worker',
    'Barber',
    'Massage Therapist',
    'Street Food Seller',
    'Parking Attendant',
    'Baby Sitter',
    'Other'
  ],
  [JobType.SKILLED]: [
    'Carpenter',
    'Electrician',
    'Tailor/Seamstress',
    'Mechanic',
    'Plumber',
    'Welder',
    'Shoemaker/Cobbler',
    'Other'
  ],
  [JobType.OTHER]: []
};

export const getSubTypesByJobType = (jobType: JobType): string[] => {
  return SubTypes[jobType] || [];
};

// Helper to validate if a subtype belongs to a job type
export const isValidSubType = (jobType: JobType, subType: string): boolean => {
  return SubTypes[jobType]?.includes(subType) || false;
};

// Get all job types as options for dropdowns
export const getJobTypeOptions = () => {
  return Object.values(JobType)
    .filter(type => type !== JobType.OTHER)
    .map(type => ({
      value: type,
      label: type
    }));
};

// Get subtypes as options for dropdowns
export const getSubTypeOptions = (jobType: JobType) => {
  return (SubTypes[jobType] || []).map(subType => ({
    value: subType,
    label: subType
  }));
};