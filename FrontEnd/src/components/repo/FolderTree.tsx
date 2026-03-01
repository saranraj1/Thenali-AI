"use client";

import Card from "@/components/ui/Card";
import { Folder, FileCode } from "lucide-react";

const files = [
    { name: "src/", type: "folder" },
    { name: "src/components/", type: "folder" },
    { name: "src/hooks/", type: "folder" },
    { name: "package.json", type: "file" },
    { name: "README.md", type: "file" },
];

export default function FolderTree() {
    return (
        <Card title="Structural Hierarchy">
            <ul className="space-y-3">
                {files.map((file, index) => (
                    <li key={index} className="flex items-center gap-3 p-3 bg-[#0d0f11] border border-[#1e2227] rounded-xl hover:border-[#ff7a30]/30 transition-all cursor-pointer group">
                        {file.type === 'folder' ? (
                            <Folder size={16} className="text-[#ff7a30]" />
                        ) : (
                            <FileCode size={16} className="text-blue-400" />
                        )}
                        <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest">{file.name}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}