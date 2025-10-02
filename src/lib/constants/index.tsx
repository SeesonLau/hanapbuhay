// lib/constants/index.tsx
export const passwordRequirements = [
  { re: /.{8,}/, label: 'At least 8 characters' },
  { re: /[A-Z]/, label: 'At least one uppercase letter' },
  { re: /[a-z]/, label: 'At least one lowercase letter' },
  { re: /[0-9]/, label: 'At least one number' },
  { re: /[^A-Za-z0-9]/, label: 'At least one special character' }
];

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CHAT: '/chat',
  PROFILE: '/profile',
  MANAGEJOBPOSTS: '/manageJobPosts',
  APPLIEDJOBS: '/appliedJobs',
  FINDJOBS: '/findJobs',
  MOCK: '/mock'
};
