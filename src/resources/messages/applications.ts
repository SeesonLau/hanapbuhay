// Success Messages
export const ApplicationMessages = {
  // Success Messages
  CREATE_APPLICATION_SUCCESS: 'Application submitted successfully!',
  UPDATE_APPLICATION_SUCCESS: 'Application status updated successfully!',
  DELETE_APPLICATION_SUCCESS: 'Application withdrawn successfully!',

  // Error Messages
  CREATE_APPLICATION_ERROR: 'Failed to submit application. Please try again.',
  UPDATE_APPLICATION_ERROR: 'Failed to update application status. Please try again.',
  DELETE_APPLICATION_ERROR: 'Failed to withdraw application. Please try again.',
  FETCH_APPLICATIONS_ERROR: 'Failed to fetch applications. Please try again.',
  DUPLICATE_APPLICATION_ERROR: 'You have already applied to this job.',

  // Loading Messages
  LOADING_APPLICATIONS: 'Loading applications...',
  SUBMITTING_APPLICATION: 'Submitting your application...',
  UPDATING_APPLICATION: 'Updating application status...',

  // Empty States
  NO_APPLICATIONS_FOUND: 'No applications found.',
  NO_APPLICATIONS_BY_USER: 'You haven\'t applied to any jobs yet.',
  NO_APPLICATIONS_FOR_POST: 'No applications received for this job post yet.'
} as const;