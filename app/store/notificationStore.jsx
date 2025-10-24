"use client";

import { create } from 'zustand';
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  auth: { token: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null}` }
});

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  initialize: async (userRole, token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        const filtered = data.notifications.filter(
          n => n.recipient_role === userRole || n.recipient_role === 'all'
        );
        set({
          notifications: filtered,
          unreadCount: filtered.filter(n => !n.read).length,
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }

    socket.on(`notification:${userRole}`, (notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
    });
  },
  markAsRead: async (notificationId, token) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => {
        const updatedNotifications = state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        return {
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.read).length,
        };
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },
  clearNotifications: async (token) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  },
}));