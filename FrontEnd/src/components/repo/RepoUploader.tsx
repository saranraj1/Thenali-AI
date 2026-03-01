"use client";

import { useState, useRef, useCallback } from "react";
import Card from "@/components/ui/Card";
import { UploadCloud, CheckCircle2, AlertTriangle, Loader2, X } from "lucide-react";
import apiClient from "@/services/apiClient";

type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

interface UploadResult {
    repo_id: string;
    repo_name: string;
    status: string;
}

interface Props {
    /** Called after a successful upload with the returned repo info */
    onUploadSuccess?: (result: UploadResult) => void;
}

export default function RepoUploader({ onUploadSuccess }: Props) {
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");
    const [error, setError] = useState("");
    const [result, setResult] = useState<UploadResult | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const isUploading = uploadState === "uploading";

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const uploadZipFile = useCallback(async (file: File) => {
        setFileName(file.name);
        setFileSize(formatSize(file.size));
        setError("");
        setProgress(0);
        setUploadState("uploading");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("repo_name", file.name.replace(/\.zip$/i, ""));

        try {
            const { data } = await apiClient.post<UploadResult>(
                "/repos/upload-zip",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (e) => {
                        if (e.total) {
                            setProgress(Math.round((e.loaded * 100) / e.total));
                        }
                    },
                }
            );

            setResult(data);
            setUploadState("success");
            onUploadSuccess?.(data);
        } catch (err: any) {
            const msg = err.response?.data?.detail
                || err.message
                || "Upload failed. Please try again.";
            setError(msg);
            setUploadState("error");
        }
    }, [onUploadSuccess]);

    const validateAndUpload = useCallback((file: File | undefined | null) => {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith(".zip")) {
            setError("Only ZIP files are supported. Please upload a .zip archive.");
            setUploadState("error");
            return;
        }
        const MAX_SIZE_MB = 100;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File too large. Maximum size is ${MAX_SIZE_MB} MB.`);
            setUploadState("error");
            return;
        }
        uploadZipFile(file);
    }, [uploadZipFile]);

    // Drag events
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isUploading) setUploadState("dragging");
    };
    const handleDragLeave = () => {
        if (!isUploading) setUploadState("idle");
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (isUploading) return;
        validateAndUpload(e.dataTransfer.files[0]);
    };

    const reset = () => {
        setUploadState("idle");
        setProgress(0);
        setFileName("");
        setFileSize("");
        setError("");
        setResult(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    // ── Visual states ──────────────────────────────────────────────────
    const isDragging = uploadState === "dragging";
    const isSuccess = uploadState === "success";
    const isError = uploadState === "error";

    const borderColor = isDragging
        ? "border-saffron/60 bg-saffron/5"
        : isSuccess
            ? "border-green-bharat/50 bg-green-bharat/5"
            : isError
                ? "border-red-500/50 bg-red-500/5"
                : isUploading
                    ? "border-saffron/30 bg-saffron/5"
                    : "border-white/10 hover:border-saffron/30";

    return (
        <Card title="Direct Node Upload">
            <div
                className={`relative border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[200px] ${borderColor}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && inputRef.current?.click()}
            >
                {/* Hidden file input */}
                <input
                    ref={inputRef}
                    type="file"
                    accept=".zip"
                    className="hidden"
                    onChange={(e) => validateAndUpload(e.target.files?.[0])}
                />

                {/* IDLE / DRAGGING state */}
                {(uploadState === "idle" || uploadState === "dragging") && (
                    <>
                        <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-6 transition-all ${isDragging ? "bg-saffron text-white border-saffron scale-110 shadow-xl shadow-saffron/30" : "bg-saffron/10 border-saffron/20 text-saffron"}`}>
                            <UploadCloud size={32} />
                        </div>
                        <p className="text-xs font-black text-white uppercase tracking-[0.2em] mb-2 text-center">
                            {isDragging ? "Drop to Upload" : "Drag & Drop Intel"}
                        </p>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">
                            OR CLICK TO UPLOAD ZIP
                        </p>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2 text-center">
                            MAX 100 MB · .zip only
                        </p>
                    </>
                )}

                {/* UPLOADING state */}
                {uploadState === "uploading" && (
                    <div className="w-full flex flex-col items-center gap-5">
                        <Loader2 size={36} className="text-saffron animate-spin" />
                        <div className="text-center">
                            <p className="text-xs font-black text-white uppercase tracking-widest mb-1">
                                Uploading to AI...
                            </p>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                {fileName} · {fileSize}
                            </p>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full max-w-sm h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-saffron rounded-full transition-all duration-200"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-black text-saffron uppercase tracking-widest">
                            {progress}%
                        </p>
                    </div>
                )}

                {/* SUCCESS state */}
                {isSuccess && result && (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <CheckCircle2 size={40} className="text-green-bharat" />
                        <div>
                            <p className="text-sm font-black text-white uppercase tracking-widest mb-1">
                                File Uploaded! Analyzing...
                            </p>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                {result.repo_name}
                            </p>
                            <p className="text-[9px] text-white/20 font-mono mt-1">
                                ID: {result.repo_id}
                            </p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); reset(); }}
                            className="mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            <X size={12} /> Upload Another
                        </button>
                    </div>
                )}

                {/* ERROR state */}
                {isError && (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <AlertTriangle size={36} className="text-red-400" />
                        <div>
                            <p className="text-sm font-black text-red-400 uppercase tracking-widest mb-2">
                                Upload Failed
                            </p>
                            <p className="text-[11px] text-red-300/70 max-w-xs leading-relaxed">
                                {error}
                            </p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); reset(); }}
                            className="mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-[9px] font-black text-red-400 uppercase tracking-widest hover:bg-red-500/20 transition-colors"
                        >
                            <X size={12} /> Try Again
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
}