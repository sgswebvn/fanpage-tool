"use client";
import { useState, useEffect } from "react";
import { getConnectedPages } from "../../../services/fanpages";
import { Fanpage } from "../../../interfaces/fanpage";
import Image from "next/image";

interface FanpageSelectorProps {
    selected: string | null;
    onSelect: (pageId: string | null) => void;
}

export default function FanpageSelector({ selected, onSelect }: FanpageSelectorProps) {
    const [pages, setPages] = useState<Fanpage[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getConnectedPages()
            .then((data) => {
                setPages(data);
                if (!selected && data.length > 0) {
                    onSelect(data[0].pageId);
                }
            })
            .catch(() => console.error("Lỗi khi lấy danh sách Fanpage"))
            .finally(() => setLoading(false));
    }, []);

    const handleSelect = (pageId: string) => {
        onSelect(pageId);
        localStorage.setItem("selectedPageId", pageId);
    };

    return (
        <div className="relative">
            {loading ? (
                <div className="animate-pulse flex items-center space-x-2 p-2 rounded-lg bg-gray-100">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
            ) : (
                <select
                    value={selected || ""}
                    onChange={(e) => handleSelect(e.target.value)}
                    className="w-full p-2 pl-10 pr-8 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                    <option value="" disabled>
                        Chọn Fanpage
                    </option>
                    {pages.map((page) => (
                        <option key={page.pageId} value={page.pageId}>
                            {page.name}
                        </option>
                    ))}
                </select>
            )}
            <Image
                src={pages.find((p) => p.pageId === selected)?.picture || "/default-avatar.png"}
                alt="Fanpage"
                width={24}
                height={24}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
            />
            <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );
}