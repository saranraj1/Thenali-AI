import apiClient from "./apiClient";

export const voiceService = {
    transcribe: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await apiClient.post("/voice/transcribe", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return data;
    },
    speak: async (text: string) => {
        const response = await apiClient.post("/voice/speak", { text }, {
            responseType: "blob"
        });
        return URL.createObjectURL(response.data);
    }
};
