import React, { useState, useEffect } from 'react';
import { Input } from '@/components/chat/input';
import { UserContact } from '@/lib/models/chat';
import { ChatService } from '@/lib/services/chat/chat-services';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';

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
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<UserContact[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if (debouncedSearchTerm.trim().length >= 1) {
            setIsSearching(true);
            ChatService.searchUsers(debouncedSearchTerm, currentUserId)
                .then(results => {
                    console.log('Search results for', debouncedSearchTerm, ':', results);
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
        onUserSelect(user);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <div className="relative">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 text-sm mobile-L:text-base"
                />
                {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div 
                            className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: theme.colors.primary }}
                        ></div>
                    </div>
                )}
            </div>
            
            {(isSearching || searchResults.length > 0) && searchTerm.length >= 1 && (
                <div 
                    className="absolute z-20 w-full rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto"
                    style={{
                        backgroundColor: theme.colors.surface,
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    {isSearching && (
                        <div 
                            className="p-3 text-center text-xs mobile-L:text-sm flex items-center justify-center gap-2"
                            style={{ color: theme.colors.textMuted }}
                        >
                            <div 
                                className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                                style={{ borderColor: theme.colors.textMuted }}
                            ></div>
                            Searching...
                        </div>
                    )}
                    
                    {!isSearching && searchResults.length === 0 && (
                        <div 
                            className="p-3 text-center text-xs mobile-L:text-sm"
                            style={{ color: theme.colors.textMuted }}
                        >
                            No users found matching "{searchTerm}"
                        </div>
                    )}

                    {!isSearching && searchResults.map(user => (
                        <div
                            key={user.userId}
                            className="flex items-center p-2 mobile-L:p-3 cursor-pointer transition-colors last:border-b-0"
                            style={{
                                borderBottom: `1px solid ${theme.colors.borderLight}`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            onClick={() => handleSelect(user)}
                        >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={user.profilePicUrl || undefined} alt={user.name} />
                                <AvatarFallback 
                                    className="text-xs"
                                    style={{
                                        backgroundColor: theme.colors.primaryLight,
                                        color: theme.colors.primaryDark,
                                    }}
                                >
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span 
                                className="ml-2 mobile-L:ml-3 font-medium truncate text-sm mobile-L:text-base"
                                style={{ color: theme.colors.text }}
                            >
                                {user.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};