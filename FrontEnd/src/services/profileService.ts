import apiClient from "./apiClient";

export const profileService = {
    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await apiClient.post("/profile/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return data;
    }
};
