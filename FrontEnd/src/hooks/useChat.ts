"use client";

import { useState } from "react";
import apiClient from "@/services/apiClient";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function useChat(repoId?: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (text: string) => {
        if (!repoId) {
            // No repo connected — inform the user instead of simulating a fake response
            setMessages((prev) => [
                ...prev,
                { role: "user", content: text },
                {
                    role: "assistant",
                    content: "Please scan a repository first to start chatting. Use the Overview tab to submit a GitHub repository URL.",
                },
            ]);
            return;
        }

        setLoading(true);
        const userMessage: Message = { role: "user", content: text };
        setMessages((prev) => [...prev, userMessage]);

        try {
            // Real RAG + Bedrock call: POST /api/repos/chat
            const { data } = await apiClient.post("/repos/chat", {
                repo_id: repoId,
                message: text,
            });

            const aiMessage: Message = {
                role: "assistant",
                content: data.response || "No intelligence generated. Connection closed.",
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || error.message || "Engine failure connecting to AI Brain.";
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: `Neural Error: ${errorMsg}` },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return {
        messages,
        loading,
        sendMessage,
    };
}