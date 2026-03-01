"use client";

import { useState, useCallback, useEffect } from "react";
import apiClient from "@/services/apiClient";

export type Language = "python" | "javascript" | "typescript" | "java" | "cpp" | "go";

export const LANGUAGE_LABELS: Record<Language, string> = {
    python: "Python",
    javascript: "JavaScript",
    typescript: "TypeScript",
    java: "Java",
    cpp: "C++",
    go: "Go",
};

const PYTHON_ONLY_LANGUAGES: Language[] = ["javascript", "typescript", "java", "cpp", "go"];

export const TEMPLATES: Record<string, { label: string; language: Language; code: string }> = {
    hello_world: {
        label: "Hello World",
        language: "python",
        code: `print("Hello, World!")`,
    },
    fibonacci: {
        label: "Fibonacci",
        language: "python",
        code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,
    },
    list_ops: {
        label: "List Operations",
        language: "python",
        code: `numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"Original: {numbers}")
print(f"Squared:  {squared}")
print(f"Sum:      {sum(numbers)}")`,
    },
    api_request: {
        label: "API Request",
        language: "python",
        code: `import urllib.request
import json

url = "https://api.github.com/users/octocat"
with urllib.request.urlopen(url) as response:
    data = json.loads(response.read())
    print(f"User:  {data['login']}")
    print(f"Repos: {data['public_repos']}")`,
    },
};

const DEFAULT_CODE = `# Welcome to Thenali AI Playground
# Press Ctrl+Enter to run  |  Python 3.x

def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("Neural Operator"))
`;

export interface PlaygroundState {
    code: string;
    language: Language;
    output: string | null;
    error: string | null;
    isRunning: boolean;
    executionTime: number | null;
}

export interface SessionEntry {
    id: string;
    language: Language;
    firstLine: string;
    timestamp: string;
    code: string;
}

export default function usePlayground() {
    const [code, setCode] = useState<string>(DEFAULT_CODE);
    const [language, setLanguage] = useState<Language>("python");
    const [output, setOutput] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [sessionHistory, setSessionHistory] = useState<SessionEntry[]>([]);

    // ─── Keyboard shortcut: Ctrl+Enter / Cmd+Enter ─────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                runCode();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, language]);

    // ─── Run code ──────────────────────────────────────────────────
    const runCode = useCallback(async () => {
        const trimmed = code.trim();
        if (!trimmed) {
            setError("Please write some code first.");
            setOutput(null);
            return;
        }

        // Non-Python languages: send to backend but handle gracefully
        if (PYTHON_ONLY_LANGUAGES.includes(language)) {
            // Show a friendly message instead of a broken call for unimplemented langs
            setOutput(null);
            setError(`${LANGUAGE_LABELS[language]} execution coming soon. Currently Python only.`);
            return;
        }

        setIsRunning(true);
        setOutput(null);
        setError(null);
        setExecutionTime(null);

        try {
            const { data } = await apiClient.post("/playground/run", {
                code: trimmed,
                language,
            });

            setExecutionTime(data.execution_time_ms ?? null);

            if (data.error) {
                setError(`Runtime Error:\n${data.error}`);
                setOutput(null);
            } else if (!data.output || data.output.trim() === "") {
                setOutput("Code executed successfully (no output)");
            } else {
                setOutput(data.output);
            }

            // Add to local session history (last 5)
            const entry: SessionEntry = {
                id: Date.now().toString(),
                language,
                firstLine: trimmed.split("\n").find(l => l.trim()) || trimmed.slice(0, 40),
                timestamp: new Date().toLocaleTimeString(),
                code: trimmed,
            };
            setSessionHistory(prev => [entry, ...prev].slice(0, 5));

        } catch (err: any) {
            const status = err.response?.status;
            if (status === 401) {
                setError("Please login to run code.");
            } else if (status === 408 || err.code === "ECONNABORTED") {
                setError("Execution timed out.");
            } else if (status === 422) {
                setError("Invalid request. Please check your input.");
            } else if (status === 500) {
                setError("Server error. Please try again.");
            } else if (!err.response) {
                setError("Execution failed. Is the backend running?");
            } else {
                setError(err.response?.data?.detail || "Execution failed. Please try again.");
            }
        } finally {
            setIsRunning(false);
        }
    }, [code, language]);

    // ─── Clear output ───────────────────────────────────────────────
    const clearOutput = useCallback(() => {
        setOutput(null);
        setError(null);
        setExecutionTime(null);
    }, []);

    // ─── Load template ──────────────────────────────────────────────
    const loadTemplate = useCallback((templateKey: string) => {
        const tpl = TEMPLATES[templateKey];
        if (!tpl) return;
        setCode(tpl.code);
        setLanguage(tpl.language);
        clearOutput();
    }, [clearOutput]);

    // ─── Restore from session history ───────────────────────────────
    const restoreSession = useCallback((entry: SessionEntry) => {
        setCode(entry.code);
        setLanguage(entry.language);
        clearOutput();
    }, [clearOutput]);

    // ─── Copy code to clipboard ─────────────────────────────────────
    const copyCode = useCallback(async (): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(code);
            return true;
        } catch {
            return false;
        }
    }, [code]);

    return {
        // state
        code, setCode,
        language, setLanguage,
        output,
        error,
        isRunning,
        executionTime,
        sessionHistory,
        // actions
        runCode,
        clearOutput,
        loadTemplate,
        restoreSession,
        copyCode,
    };
}
