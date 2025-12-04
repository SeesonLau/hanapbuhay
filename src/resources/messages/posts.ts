export const PostMessages = {
  LOCK_SUCCESS: (isLocked: boolean) => `Post successfully ${isLocked ? 'locked' : 'unlocked'}.`,
  LOCK_FAILURE: (isLocked: boolean) => `Failed to ${isLocked ? 'lock' : 'unlock'} post.`,
};
