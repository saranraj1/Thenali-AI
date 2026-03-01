"use client";

import { useState } from "react";

type Props = {
    audioUrl?: string;
}

export default function AudioLessonPlayer({
    audioUrl = "lesson_audio_mock.mp3"
}: Props) {
    const [playing, setPlaying] = useState(false);

    return (
        <div className="bg-white border rounded-lg p-6 shadow-sm border-l-4 border-l-orange-500 bg-orange-50/10">
            <h3 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
                <span className="text-orange-500">🔊</span> Audio Explanation
            </h3>
            <p className="text-xs text-info-600 mb-4 font-bold text-gray-500 translate-x-7">AI Mentor explanation of this concept</p>

            <div className="flex items-center gap-4 bg-white p-3 rounded-full border shadow-sm">
                <button
                    onClick={() => setPlaying(!playing)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md group ${playing ? "bg-red-500 hover:bg-red-600 scale-105 shadow-red-200" : "bg-orange-600 hover:bg-orange-700 hover:scale-105 shadow-orange-200"
                        }`}
                >
                    {playing ? (
                        <span className="text-white text-xl translate-x-[-1px]">⏸</span>
                    ) : (
                        <span className="text-white text-xl translate-x-1">▶️</span>
                    )}
                </button>
                <div className="flex-1">
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-1">
                        <div className={`bg-orange-500 h-2 rounded-full transition-all duration-300 ${playing ? "w-1/3" : "w-0"}`}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                        <span>0:45</span>
                        <span>2:30</span>
                    </div>
                </div>
                <div className="text-xs font-bold text-orange-600 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">AI VOICE</div>
            </div>
        </div>
    );
}