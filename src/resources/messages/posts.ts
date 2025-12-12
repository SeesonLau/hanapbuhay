
export const PostMessages = {
  // Success messages
  CREATE_POST_SUCCESS: 'Post created successfully!',
  UPDATE_POST_SUCCESS: 'Post updated successfully!',
  DELETE_POST_SUCCESS: 'Post deleted successfully!',
  UPLOAD_IMAGE_SUCCESS: 'Image uploaded successfully!',

  // Error messages
  CREATE_POST_ERROR: 'Failed to create post. Please try again.',
  UPDATE_POST_ERROR: 'Failed to update post. Please try again.',
  DELETE_POST_ERROR: 'Failed to delete post. Please try again.',
  FETCH_POSTS_ERROR: 'Failed to fetch posts. Please try again.',
  FETCH_POST_ERROR: 'Failed to fetch post details. Please try again.',
  UPLOAD_IMAGE_ERROR: 'Failed to upload image. Please try again.',
  FETCH_IMAGE_ERROR: 'Failed to fetch image. Please try again.',

  // Validation messages
  TITLE_REQUIRED: 'Title is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  PRICE_REQUIRED: 'Price is required',
  PRICE_INVALID: 'Please enter a valid price',
  TYPE_REQUIRED: 'Job type is required',
  SUBTYPE_REQUIRED: 'At least one sub-type is required',
  LOCATION_REQUIRED: 'Location is required',
  IMAGE_REQUIRED: 'Image is required',
  IMAGE_SIZE_ERROR: 'Image size should be less than 5MB',
  IMAGE_TYPE_ERROR: 'Only JPG, PNG, and GIF images are allowed',

  // Loading messages
  CREATING_POST: 'Creating your post...',
  UPDATING_POST: 'Updating your post...',
  DELETING_POST: 'Deleting post...',
  UPLOADING_IMAGE: 'Uploading image...',
  LOADING_POSTS: 'Loading posts...',
  LOADING_MORE_POSTS: 'Loading more posts...',

  // Empty states
  NO_POSTS_FOUND: 'No posts found',
  NO_USER_POSTS: 'You haven\'t created any posts yet',
  NO_SEARCH_RESULTS: 'No posts match your search criteria',

  // Confirmation messages
  DELETE_CONFIRMATION: 'Are you sure you want to delete this post?',
  UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',

  LOCK_SUCCESS: (isLocked: boolean) => `Post successfully ${isLocked ? 'locked' : 'unlocked'}.`,
  LOCK_FAILURE: (isLocked: boolean) => `Failed to ${isLocked ? 'lock' : 'unlock'} post.`,
} as const;