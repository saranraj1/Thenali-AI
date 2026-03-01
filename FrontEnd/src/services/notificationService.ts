import apiClient from "./apiClient";

export const notificationService = {
    getAll: async () => {
        const { data } = await apiClient.get('/notifications');
        return data;
    },
    markRead: async (notificationId: string) => {
        await apiClient.post(`/notifications/${notificationId}/read`);
    },
    markAllRead: async () => {
        await apiClient.post('/notifications/read-all');
    }
};
