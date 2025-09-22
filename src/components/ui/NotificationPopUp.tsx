import React, { useState } from "react";
import { HiOutlineUser } from "react-icons/hi"; 

const NotificationPopUp = () => {
  const [showAll, setShowAll] = useState(false);

  const notifications = [
    { notificationId: 1, name: "John Doe", type: "message", message: "sent you a message", time: "2m ago", isRead: false },
    { notificationId: 2, name: "Jane Smith", type: "like", message: "liked your post", time: "10m ago", isRead: true },
    { notificationId: 3, name: "Alex Johnson", type: "comment", message: "commented on your photo", time: "30m ago", isRead: false },
    { notificationId: 4, name: "Chris Brown", type: "friend request", message: "sent you a friend request", time: "1h ago", isRead: true },
    { notificationId: 5, name: "Emily Davis", type: "message", message: "sent you a message", time: "2h ago", isRead: false },
    { notificationId: 6, name: "Michael Wilson", type: "tag", message: "tagged you in a post", time: "5h ago", isRead: true },
    { notificationId: 7, name: "Sarah Lee", type: "like", message: "liked your photo", time: "1d ago", isRead: false },
  ];

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 6);

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-2xl border border-gray-200 z-50">
      <div className="p-3 border-b border-gray-200 font-semibold text-gray-700">
        Notifications
      </div>
      <div className="max-h-[36rem]"> 
        {displayedNotifications.map((notif) => (
          <div
            key={notif.notificationId}
            className={`m-2 cursor-pointer rounded-xl border flex items-center p-3 ${
              notif.isRead ? "bg-gray-50" : "bg-blue-50"
            }`}
          >
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-200">
              <HiOutlineUser className="w-6 h-6 text-gray-500" />
            </div>

            <div className="flex-1 ml-3">
              <p className="text-sm">
                <span className="font-semibold">{notif.name}</span> {notif.message}
              </p>
            </div>

            <div className="flex-shrink-0 text-xs text-gray-500 ml-2">
              {notif.time}
            </div>
          </div>
        ))}
      </div>

      {notifications.length > 6 && !showAll && (
        <button
          className="w-full text-center text-blue-600 font-medium py-2 hover:bg-gray-100 rounded-b-2xl"
          onClick={() => setShowAll(true)}
        >
          See more
        </button>
      )}
    </div>
  );
};

export default NotificationPopUp;
