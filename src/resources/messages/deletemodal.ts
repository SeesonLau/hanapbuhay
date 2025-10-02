/**
 * Defines the unique identifier for each type of modal.
 * This ensures type safety and enables autocompletion.
 */
export type ModalType =
  | 'deleteJobPost'
  | 'deleteAccount'
  | 'withdrawApplication'
  | 'deleteWorkExperience'
  | 'deleteWorkerReview';

/**
 * Defines the structure for the content of each modal variant.
 */
interface ModalContent {
  variant: 'trash' | 'briefcase' | 'review'; // Determines which icon to use
  title: string;
  description: string;
  confirmText: string;
}

/**
 * A centralized constant object that holds all the text and configuration
 * for the different modal variants shown in the design.
 *
 * Using a Record<ModalType, ModalContent> ensures that every ModalType
 * has a corresponding content object defined, preventing runtime errors.
 */
export const MODAL_CONTENT: Record<ModalType, ModalContent> = {
  deleteJobPost: {
    variant: 'trash',
    title: 'Deleting Job Post',
    description: 'Are you sure you want to delete this Job Post?',
    confirmText: 'Delete',
  },
  deleteAccount: {
    variant: 'trash',
    title: 'Deleting Account',
    description: 'Are you sure you want to delete your account?',
    confirmText: 'Delete',
  },
  withdrawApplication: {
    variant: 'briefcase',
    title: 'Job Application Withdrawal',
    description: 'Are you sure you want to withdraw from this job?',
    confirmText: 'Withdraw',
  },
  deleteWorkExperience: {
    variant: 'briefcase',
    title: 'Deleting Work Experience',
    description: 'Are you sure you want to delete this work experience?',
    confirmText: 'Delete',
  },
  deleteWorkerReview: {
    variant: 'review',
    title: 'Deleting Worker Review',
    description: 'Are you sure you want to delete this worker review?',
    confirmText: 'Delete',
  },
};