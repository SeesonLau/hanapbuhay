'use client';

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import NotificationCard from "./NotificationCard";
import { Notification } from "@/lib/models/notification";
import { useNotifications } from "@/hooks/useNotification";
import { AuthService } from "@/lib/services/auth-services";
import { getNotificationRoute } from "@/lib/utils/notification-router";
import { HiBell } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";

interface NotificationPopUpProps {
  isScrolled?: boolean;
  onClose?: () => void;
}

const NotificationPopUp: React.FC<NotificationPopUpProps> = ({ isScrolled = false, onClose }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [displayCount, setDisplayCount] = useState(5);
  const [maxHeight, setMaxHeight] = useState(380);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [enableScrollLoad, setEnableScrollLoad] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [hoveredNotifId, setHoveredNotifId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUserId(currentUser.id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(userId, {
    skip: userLoading || !userId, 
    autoRefresh: true, 
    pageSize: 50,
  });

  const handleNotificationClick = async (notif: Notification & { actorName?: string; actorAvatar?: string }) => {
    try {
      if (!userId) return;

      console.log('Notification clicked:', notif);
      console.log('Related ID:', notif.relatedId);

      // Mark as read first
      if (!notif.isRead) {
        await markAsRead(notif.notificationId);
      }

      // Get the route
      const route = getNotificationRoute(notif);
      console.log('Navigating to route:', route);

      // Close the popup if onClose is provided
      if (onClose) {
        onClose();
      }

      // Always use window.location.href for full navigation with reload
      // This ensures query params trigger page effects and modals
      window.location.href = route;
      
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const loadOneNotification = async () => {
    if (isLoadingRef.current || displayCount >= notifications.length) return;
    
    isLoadingRef.current = true;
    setIsLoadingMore(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setDisplayCount(prev => prev + 1);
    setIsLoadingMore(false);
    isLoadingRef.current = false;
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !enableScrollLoad) return;

    const handleScroll = () => {
      if (isLoadingRef.current) return;

      const scrollTop = scrollElement.scrollTop;
      const scrollHeight = scrollElement.scrollHeight;
      const clientHeight = scrollElement.clientHeight;

      const bottomReached = scrollTop + clientHeight >= scrollHeight - 40;

      if (bottomReached && displayCount < notifications.length) {
        loadOneNotification();
      }
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [enableScrollLoad, displayCount, notifications.length]);

  const handleSeePrevious = () => {
    setMaxHeight(456);
    setEnableScrollLoad(true);
    setDisplayCount(prev => Math.min(6, notifications.length));
  };

  const displayedNotifications = notifications.slice(0, displayCount);
  const hasMore = displayCount < notifications.length;
  const remainingCount = notifications.length - displayCount;
  const showSeePreviousButton = !enableScrollLoad && notifications.length > 5;

  if (!mounted) return null;

  const notificationContent = (
    <div 
      className={`fixed right-4 w-[500px] max-w-[calc(100vw-2rem)] shadow-lg rounded-2xl border z-[60] overflow-hidden transition-all duration-300 ${
        isScrolled ? 'top-14' : 'top-16'
      }`}
      style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: theme.modal.background,
        borderColor: theme.modal.headerBorder,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
      }}
    >
      {/* Header */}
      <div 
        className="relative p-3 border-b flex items-center sm:justify-center"
        style={{ borderBottomColor: theme.modal.headerBorder }}
      >
        <div className="flex items-center gap-2">
          <HiBell 
            className="w-4 h-4 sm:w-5 sm:h-5" 
            style={{ color: theme.colors.textSecondary }}
          />
          <span 
            className="font-bold text-base sm:text-lead"
            style={{ color: theme.colors.textSecondary }}
          >
            Notifications
            {unreadCount > 0 && (
              <span 
                className="ml-2 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-white rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
              >
                {unreadCount}
              </span>
            )}
          </span>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="absolute right-3 text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors"
            style={{ color: theme.colors.primary }}
            onMouseOver={(e) => e.currentTarget.style.color = theme.colors.primaryHover}
            onMouseOut={(e) => e.currentTarget.style.color = theme.colors.primary}
          >
            Mark all read
          </button>
        )}
      </div>
      
      {/* Notifications List */}
      <div
        ref={scrollRef}
        className={`
          overflow-x-hidden 
          snap-y snap-mandatory scroll-smooth
          ${enableScrollLoad ? "overflow-y-scroll" : "overflow-y-hidden"}
        `}
        style={{
          maxHeight: `${maxHeight}px`,
          transition: "max-height 0.3s ease-in-out",
        }}
      >
        {(userLoading || loading) && notifications.length === 0 ? (
          <div 
            className="p-8 text-center"
            style={{ color: theme.colors.textMuted }}
          >
            <div 
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
              style={{ borderColor: theme.colors.primary }}
            />
            <p className="mt-2 text-sm">Loading notifications...</p>
          </div>
        ) : !userId ? (
          <div 
            className="p-8 text-center"
            style={{ color: theme.colors.textMuted }}
          >
            <p className="text-sm">Please log in to view notifications</p>
          </div>
        ) : notifications.length === 0 ? (
          <div 
            className="p-8 text-center"
            style={{ color: theme.colors.textMuted }}
          >
            <HiBell className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <>
            {displayedNotifications.map((notif, index) => (
              <div 
                key={notif.notificationId} 
                className="snap-start relative group"
                style={{
                  animation: index >= displayCount - 1 && enableScrollLoad ? 'fadeIn 0.3s ease-in-out both' : 'none'
                }}
                onMouseEnter={() => setHoveredNotifId(notif.notificationId)}
                onMouseLeave={() => setHoveredNotifId(null)}
              >
                <NotificationCard 
                  notif={notif}
                  actorName={notif.actorName}
                  actorAvatar={notif.actorAvatar}
                  onClick={() => handleNotificationClick(notif)}
                />
                
                {/* Delete button - shows on hover */}
                <button
                  onClick={(e) => handleDeleteClick(e, notif.notificationId)}
                  className={`
                    absolute top-2 right-2 
                    p-1.5 rounded-full 
                    shadow-md
                    transition-all duration-200
                    ${hoveredNotifId === notif.notificationId ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
                  `}
                  style={{ 
                    backgroundColor: theme.colors.surface,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.pastelBg;
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.surface;
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                  aria-label="Delete notification"
                >
                  <IoClose 
                    className="w-4 h-4 transition-colors" 
                    style={{ color: theme.colors.textMuted }}
                    onMouseOver={(e) => e.currentTarget.style.color = theme.colors.error}
                    onMouseOut={(e) => e.currentTarget.style.color = theme.colors.textMuted}
                  />
                </button>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoadingMore && enableScrollLoad && (
              <div 
                className="mx-2 my-2 flex items-center justify-center min-h-[60px] gap-4 px-4 py-3 rounded-lg border animate-pulse snap-start"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.borderLight
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full"
                  style={{ backgroundColor: theme.colors.borderLight }}
                />
                <div className="flex-1 space-y-2">
                  <div 
                    className="h-4 rounded w-3/4"
                    style={{ backgroundColor: theme.colors.borderLight }}
                  />
                  <div 
                    className="h-3 rounded w-1/2"
                    style={{ backgroundColor: theme.colors.borderLight }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* See Previous Notifications Button */}
      {showSeePreviousButton && (
        <div 
          className="p-3 border-t"
          style={{ borderTopColor: theme.modal.headerBorder }}
        >
          <Button
            variant="neutral300"
            size="tiny"
            onClick={handleSeePrevious}
            className="w-full"
          >
            See previous notifications ({remainingCount} more)
          </Button>
        </div>
      )}
    </div>
  );

  return createPortal(notificationContent, document.body);
};

export default NotificationPopUp;