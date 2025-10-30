// src/components/chat/SearchUsers.tsx

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/chat/input';
import { UserContact } from '@/lib/models/chat';
import { ChatService } from '@/lib/services/chat/chat-services';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { toast } from 'react-hot-toast';

interface SearchUsersProps {
    currentUserId: string;
    onUserSelect: (user: UserContact) => void;
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const SearchUsers: React.FC<SearchUsersProps> = ({ currentUserId, onUserSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<UserContact[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce for 300ms

    useEffect(() => {
        if (debouncedSearchTerm.length > 1) {
            setIsSearching(true);
            ChatService.searchUsers(debouncedSearchTerm, currentUserId)
                .then(results => {
                    setSearchResults(results);
                })
                .catch(err => {
                    console.error('User search failed:', err);
                    toast.error('Failed to search users.');
                    setSearchResults([]);
                })
                .finally(() => {
                    setIsSearching(false);
                });
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [debouncedSearchTerm, currentUserId]);

    const handleSelect = (user: UserContact) => {
        onUserSelect(user); // Triggers DM creation in ChatPage
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <div className="mt-3 relative">
            <Input
                type="text"
                placeholder="Search users to start a DM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {(isSearching || searchResults.length > 0) && searchTerm.length > 1 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto">
                    {isSearching && (
                        <div className="p-3 text-center text-sm text-gray-500">Searching...</div>
                    )}
                    
                    {!isSearching && searchResults.length === 0 && (
                        <div className="p-3 text-center text-sm text-gray-500">No users found matching "{searchTerm}".</div>
                    )}

                    {!isSearching && searchResults.map(user => (
                        <div
                            key={user.userId}
                            className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSelect(user)}
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profilePicUrl || undefined} alt={user.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-800">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="ml-3 font-medium text-gray-800">{user.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
