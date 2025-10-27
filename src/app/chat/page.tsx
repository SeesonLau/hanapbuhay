// src/app/chat/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { RealtimeChat } from '@/components/chat/realtime-chat'; 
import Banner from '@/components/ui/Banner'; 
import { Spinner } from '@/components/chat/Spinner'; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import your services
import { AuthService } from "@/lib/services/auth-services";
import { ProfileService } from "@/lib/services/profile-services";

// --- Custom Hook to Fetch Profile Data ---
interface UserProfile {
    id: string;
    name: string;
    profilePicUrl: string | null;
}

const useCurrentProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const currentUser = await AuthService.getCurrentUser();
                
                if (currentUser) {
                    const profileData = await ProfileService.getNameProfilePic(currentUser.id);
                    
                    setProfile({
                        id: currentUser.id,
                        name: profileData?.name || 'User',
                        profilePicUrl: profileData?.profilePicUrl || null,
                    });
                } else {
                    // Handle unauthenticated state
                    setProfile(null);
                }
            } catch (error) {
                console.error('Error fetching user profile for chat:', error);
                setProfile({
                    id: 'unknown-id',
                    name: 'Guest User',
                    profilePicUrl: null,
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return { profile, isLoading };
};
// ------------------------------------------


export default function ChatPage() {
    const { profile, isLoading } = useCurrentProfile();
    
    // Fallback values if profile is still loading or unavailable
    const currentUsername = profile?.name || 'Loading User...';
    const currentProfilePicUrl = profile?.profilePicUrl;

    // Hardcoded room details for the simplified RealtimeChat component
    const roomIdentifier = 'global-realtime-room-1'; 
    const activeChatRoomName = 'Global Realtime Chat'; 

    // Render loading state if data is being fetched
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Spinner size="lg" />
                <p className="ml-2 text-lg text-gray-600">Loading user data...</p>
            </div>
        );
    }
    
    // Render an error/unauthenticated state if no profile is found after loading
    if (!profile) {
        return (
            <div className="min-h-screen p-10 bg-gray-50 text-center">
                <h1 className="text-2xl font-bold text-red-600">Authentication Required</h1>
                <p className="mt-2 text-gray-600">Please log in to access the chat feature.</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <Banner variant="chat" showSearchBar={false} />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-[240px]">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex h-[600px]"> 
                        
                        {/* 1. Simplified Chat List Sidebar (Static Placeholder) */}
                        <div className="w-1/3 border-r border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-4 bg-blue-50">
                                    <h3 className="font-semibold text-blue-800">Active Room:</h3>
                                    <p className="text-sm text-blue-600">{activeChatRoomName}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Logged in as: 
                                        <span className="font-medium text-gray-800"> {currentUsername}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Chat Messages Area */}
                        <div className="flex-1 flex flex-col">
                            {/* Header using the logged-in user's data for the Avatar/Initial */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    {/* Use Avatar component to display profile picture or initial */}
                                    <Avatar className="h-10 w-10">
                                        {currentProfilePicUrl ? (
                                            <AvatarImage src={currentProfilePicUrl} alt={currentUsername} />
                                        ) : (
                                            <AvatarFallback className="bg-gray-300 text-gray-700">
                                                {currentUsername.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <h3 className="text-lg font-semibold text-gray-800">{activeChatRoomName}</h3>
                                </div>
                            </div>
                            
                            {/* RealtimeChat Component */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <RealtimeChat 
                                    roomName={roomIdentifier}
                                    username={currentUsername}
                                    // NOTE: The RealtimeChat component will use this username when displaying messages.
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}