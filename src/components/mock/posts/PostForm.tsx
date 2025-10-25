'use client';

import React, { useReducer, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PostService } from '@/lib/services/posts-services';
import { supabase } from '@/lib/services/supabase/client';
import { JobType, getJobTypeOptions, getSubTypeOptions } from '@/lib/constants/job-types';
import { PostMessages } from '@/resources/messages/posts';
import { Post } from '@/lib/models/posts';

interface PostFormProps {
  post?: Post | null;
  onSubmit?: (post: Post) => void;
  onCancel?: () => void;
}

type FormState = Omit<Post, 'postId' | 'createdAt' | 'updatedAt' | 'userId' | 'createdBy' | 'updatedBy'> & { otherType?: string; otherSubType?: string };

type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState; value: any }
  | { type: 'SET_JOB_TYPE'; value: string }
  | { type: 'TOGGLE_SUB_TYPE'; value: string }
  | { type: 'TOGGLE_OTHER_SUB_TYPE'; value: string }
  | { type: 'RESET'; initialState: FormState };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      const newState = { ...state, [action.field]: action.value };
      if (action.field === 'type' && action.value !== JobType.OTHER) {
        newState.otherType = '';
      }
      return newState;
    case 'SET_JOB_TYPE':
      return { ...state, type: action.value, subType: [] }; // Reset subType when type changes
    case 'TOGGLE_SUB_TYPE':
      const subTypes = state.subType.includes(action.value)
        ? state.subType.filter(st => st !== action.value)
        : [...state.subType, action.value];
      return { ...state, subType: subTypes };
    case 'TOGGLE_OTHER_SUB_TYPE':
      const updatedSubTypes = state.subType.includes('Other') ? state.subType.filter(st => st !== 'Other') : [...state.subType, 'Other'];
      return { ...state, subType: updatedSubTypes, otherSubType: updatedSubTypes.includes('Other') ? state.otherSubType : '' };
    case 'RESET':
      return action.initialState;
    default:
      return state;
  }
};

export const PostForm: React.FC<PostFormProps> = ({
  post,
  onSubmit,
  onCancel
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true); // Assume authorized until checked

  useEffect(() => {
    const checkAuthorization = async () => {
      // Only check authorization for existing posts
      if (post?.postId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id !== post.userId) {
          setIsAuthorized(false);
        }
      }
    };

    checkAuthorization();
  }, [post]);


  // This function initializes the form state, handling cases where
  // the post's type or subtypes are custom values not in the enums.
  const initializeState = (post: Post | null | undefined): FormState => {
    const jobTypes = Object.values(JobType);
    const isCustomType = post?.type && !jobTypes.includes(post.type as JobType);

    const predefSubTypes = post?.type && !isCustomType ? getSubTypeOptions(post.type as JobType).map(o => o.value) : [];
    const customSubTypes = post?.subType ? post.subType.filter(st => !predefSubTypes.includes(st)) : [];

    return {
      title: post?.title || '',
      description: post?.description || '',
      price: post?.price || 0,
      type: isCustomType ? JobType.OTHER : (post?.type as JobType) || '',
      subType: post?.subType.filter(st => predefSubTypes.includes(st)) || [],
      location: post?.location || '',
      imageUrl: post?.imageUrl || '',
      otherType: isCustomType ? post?.type : '',
      otherSubType: customSubTypes.join(', ')
    };
  };

  const initialState: FormState = {
    ...initializeState(post),
    // If there are custom subtypes, ensure the "Other" checkbox is checked.
    subType: (initializeState(post).otherSubType ? [...initializeState(post).subType, 'Other'] : initializeState(post).subType)
  };

  const [formData, dispatch] = useReducer(formReducer, initialState);

  const jobTypeOptions = getJobTypeOptions();
  const subTypeOptions = formData.type ? getSubTypeOptions(formData.type as JobType) : [];

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'type') {
      dispatch({ type: 'SET_JOB_TYPE', value });
    } else {
      dispatch({ type: 'SET_FIELD', field: name as keyof FormState, value: name === 'price' ? Number(value) : value });
    }
  };

  // Handle subtype checkbox change
  const handleSubTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === 'Other') {
      dispatch({ type: 'TOGGLE_OTHER_SUB_TYPE', value: 'Other' });
    } else {
      dispatch({ type: 'TOGGLE_SUB_TYPE', value });
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file
      if (!PostService.validateImageFile(file)) {
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (imageFile) {
        const uploadedUrl = await PostService.uploadImage(imageFile);
        if (!uploadedUrl) {
          throw new Error('Failed to upload image');
          // The service already shows a toast and logs the specific error.
          // We just need to stop the submission process.
          setLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      // Split "other" subtypes by comma, trim whitespace, and filter out empty strings
      const otherSubTypes = formData.otherSubType?.split(',').map(s => s.trim()).filter(Boolean) || [];

      const finalSubTypes = [
        ...formData.subType.filter(st => st !== 'Other'),
        ...otherSubTypes
      ];

      const postData = {
        ...formData,
        imageUrl,
        price: Number(formData.price),
        type: formData.type === JobType.OTHER ? formData.otherType || 'Other' : formData.type,
        subType: finalSubTypes,
      };
      delete postData.otherType;
      delete postData.otherSubType;

      let savedPost: Post;
      if (post?.postId) {
        // Update existing post
        savedPost = await PostService.updatePost(post.postId, postData);
      } else {
        // Create new post - remove fields that should be auto-generated
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          toast.error('You must be logged in to create a post.');
          setLoading(false);
          return;
        }

        const { ...createData } = postData;
        const userId = user.id;
        savedPost = await PostService.createPost({
          ...createData,
          userId,
          createdBy: userId,
          updatedBy: userId
        });
      }

      if (savedPost && onSubmit) {
        onSubmit(savedPost);
      } else {
        // Redirect if no onSubmit callback
        router.push('/posts');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      // Error toast is already shown in the service
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!isAuthorized && (
        <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
          This is a read-only view. You are not the author of this post.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={!isAuthorized}
            className="mt-1 block w-full rounded-md border-gray-300 border p-3 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            disabled={!isAuthorized}
            className="mt-1 block w-full rounded-md border-gray-300 border p-3 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Describe your service or job"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (₱) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            disabled={!isAuthorized}
            className="mt-1 block w-full rounded-md border-gray-300 border p-3 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Job Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            disabled={!isAuthorized}
            className="mt-1 block w-full rounded-md border-gray-300 border p-3 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select job type</option>
            {jobTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {formData.type === JobType.OTHER && (
          <div>
            <label htmlFor="otherType" className="block text-sm font-medium text-gray-700">
              Please specify job type *
            </label>
            <input
              type="text"
              id="otherType"
              name="otherType"
              value={formData.otherType}
              onChange={handleChange}
              required
              disabled={!isAuthorized}
              className="mt-1 block w-full rounded-md border-gray-300 border p-3 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        )}

        {formData.type && (
          <div>
            <label htmlFor="subType" className="block text-sm font-medium text-gray-700">
              Sub Types *
            </label>
            <div className="mt-2 space-y-2 border border-gray-300 rounded-md p-4 max-h-48 overflow-y-auto">
              {subTypeOptions.length > 0 ? (
                subTypeOptions.map(option => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`subtype-${option.value}`}
                      name="subType"
                      type="checkbox"
                      value={option.value}
                      checked={formData.subType.includes(option.value)}
                      onChange={handleSubTypeChange}
                      disabled={!isAuthorized}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <label htmlFor={`subtype-${option.value}`} className="ml-3 text-sm text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Please select a job type to see sub types.</p>
              )}
              {/* Static "Other" option for subtypes */}
              <div className="flex items-center">
                <input
                  id="subtype-other"
                  name="subType"
                  type="checkbox"
                  value="Other"
                  checked={formData.subType.includes('Other')}
                  onChange={handleSubTypeChange}
                  disabled={!isAuthorized}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                />
                <label htmlFor="subtype-other" className="ml-3 text-sm text-gray-700">
                  Other
                </label>
              </div>
              {formData.subType.includes('Other') && (
                <div className="mt-2 pl-7">
                  <input
                    type="text"
                    id="otherSubType"
                    name="otherSubType"
                    value={formData.otherSubType}
                    onChange={handleChange}
                    required={formData.subType.includes('Other')}
                    placeholder="Please specify"
                    disabled={!isAuthorized}
                    className="block w-full rounded-md border-gray-300 border p-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            disabled={!isAuthorized}
            className="mt-1 block w-full rounded-md border-gray-300 border p-3 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Enter your location"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
            disabled={!isAuthorized}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {(imagePreview || formData.imageUrl) && (
            <div className="mt-2">
              <Image
                src={imagePreview || formData.imageUrl!}
                alt="Preview"
                width={200}
                height={200}
                className="rounded-md object-cover border"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          {isAuthorized && (
            <button
              type="submit"
              disabled={loading || !isAuthorized}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Saving...' : post?.postId ? 'Update Post' : 'Create Post'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};