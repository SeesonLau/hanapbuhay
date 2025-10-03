'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { supabase } from '@/lib/services/supabase/client';

// Applications components
import { ApplyComponent } from '@/components/mock/applications/ApplyComponent';
import { ApplicationsComponent } from '@/components/mock/applications/ApplicationsComponent';

// Posts components
import { Post } from '@/lib/models/posts';
import { PostForm as PostFormComponent } from '@/components/mock/posts/PostForm';
import { PostList as PostListComponent } from '@/components/mock/posts/PostList';

// Reviews components
import { ReviewComponent } from '@/components/mock/reviews/ReviewComponent';
import { ReviewsComponent } from '@/components/mock/reviews/ReviewsComponent';

// UI components
import HeaderDashboard from '@/components/ui/HeaderDashboard';
import DeleteModal from '@/components/ui/DeleteModal';
import { MODAL_CONTENT, ModalType } from '@/resources/messages/deletemodal';

// Services
import { PostService } from '@/lib/services/posts-services';
import { ApplicationService } from '@/lib/services/applications-services';
import { ReviewService } from '@/lib/services/reviews-services';

export default function MockPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
      } else {
        setUserId(session.user.id);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // --- Delete Modal State ---
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);

  // Posts handlers
  const handleCreatePost = () => {
    setSelectedPost(null);
    setShowPostForm(true);
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setShowPostForm(true);
  };

  const handlePostSaved = () => {
    setShowPostForm(false);
    setSelectedPost(null);
  };

  const handleFormCancel = () => {
    setShowPostForm(false);
    setSelectedPost(null);
  };

  // --- Delete Handlers ---
  const openDeleteModal = (id: string | number, type: ModalType) => {
    setSelectedItemId(id);
    setModalType(type);
  };

  const closeDeleteModal = () => {
    setSelectedItemId(null);
    setModalType(null);
  };

  const handleConfirmDelete = async () => {
    if (!modalType || !selectedItemId || !userId) return;

    setIsProcessingDelete(true);
    try {
      switch (modalType) {
        case 'deleteJobPost':
          await PostService.deletePost(String(selectedItemId), userId);
          break;
        case 'withdrawApplication':
          await ApplicationService.deleteApplication(String(selectedItemId), userId);
          break;
        case 'deleteWorkerReview':
          await ReviewService.deleteReview(String(selectedItemId), userId);
          break;
        default:
          // Optional: handle other cases or throw an error
          break;
      }
      // You might want to add a success toast and refresh the list here
    } catch (error) {
      // You might want to add an error toast here
    } finally {
      setIsProcessingDelete(false);
      closeDeleteModal();
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (showPostForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Toaster />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {selectedPost ? 'Edit Post' : 'Create New Post'}
          </h1>
          <button
            onClick={handleFormCancel}
            className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md"
          >
            Cancel
          </button>
        </div>
        <PostFormComponent
          post={selectedPost}
          onSubmit={handlePostSaved}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141515' }}>
      <Toaster />
      {modalType && (
        <DeleteModal
          isOpen={!!modalType}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          isProcessing={isProcessingDelete}
          title={MODAL_CONTENT[modalType].title}
          description={MODAL_CONTENT[modalType].description}
          confirmText={MODAL_CONTENT[modalType].confirmText}
          variant={MODAL_CONTENT[modalType].variant}
        />
      )}
      <header className="w-full flex justify-center pt-8 px-4">
        <HeaderDashboard />
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-16">
          {/* Applications Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-yellow-300">Applications</h2>
            <div className="space-y-12">
              <ApplicationsComponent onDelete={(id) => openDeleteModal(id, 'withdrawApplication')} />
              <div className="border-t pt-8">
                <ApplyComponent />
              </div>
            </div>
          </section>

          {/* Posts Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-300">Posts</h2>
              <button
                onClick={handleCreatePost}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Post
              </button>
            </div>
            <div className="space-y-8">
              <PostListComponent
                onPostClick={handleEditPost}
                onDelete={(id) => openDeleteModal(id, 'deleteJobPost')}
                userId={userId ?? undefined}
                showFilters={true}
              />
            </div>
          </section>

          {/* Reviews Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-yellow-300">Reviews</h2>
            <div className="space-y-12">
              <ReviewsComponent onDelete={(id) => openDeleteModal(id, 'deleteWorkerReview')} />
              <div className="border-t pt-8">
                <h3 className="text-2xl font-semibold mb-4">Write a Review</h3>
                <ReviewComponent />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}