"use client";

export default function PageContainer({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`w-full h-full text-white ${className}`}>
            {children}
        </div>
    );
}