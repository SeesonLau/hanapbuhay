export interface AuditFields {
  createdBy: string | null;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  deletedBy: string | null;
  deletedAt: string | null;
}

export interface User extends AuditFields {
  userId: string;
  email: string;
  role: string;
}

export interface Profile extends AuditFields {
  userId: string;
  profilePictureUrl: string | null;
  name: string | null;
  address: string | null;
  phoneNumber: string | null;
  birthdate: string | null;
  sex: string | null;
  age: number | null;
}

export interface UserWithProfile extends User {
  profile: Profile | null;
}

export interface AuditLog {
  id: string;
  tableName: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  oldData: any;
  newData: any;
  changedBy: string | null;
  changedAt: string;
}

export interface SearchFilters {
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  role?: string;
  sex?: string;
}
