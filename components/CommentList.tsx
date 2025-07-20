"use client";
import { useState, useEffect } from "react";
import { getCommentsByPost, createComment, hideComment } from "../services/comment";
import { Comment } from "../interfaces/comment";
import Image from "next/image";
import { useDebounce } from "use-debounce";

interface CommentListProps {
    pageId: string;
    postId: string;
}

export default function CommentList({ pageId, postId }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [debouncedMessage] = useDebounce(message, 300);
    const [debouncedReplyMessage] = useDebounce(replyMessage, 300);

    const fetchComments = async (pageNum: number = 1) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCommentsByPost(postId, pageNum, 10);
            setComments((prev) => (pageNum === 1 ? data : [...prev, ...data]));
            setHasMore(data.length === 10);
            // Tự động ẩn bình luận chứa số điện thoại
            data.forEach((comment) => {
                if (comment.containsPhoneNumber && !comment.hidden) {
                    hideComment(comment.commentId, true).catch((err) =>
                        console.error("Failed to auto-hide comment:", err.message)
                    );
                }
            });
        } catch (err: any) {
            setError(err.message || "Lỗi không xác định khi lấy bình luận");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchComments(1);
        }
    }, [postId]);

    const handleSubmit = async () => {
        if (!debouncedMessage.trim()) return;
        setSubmitting(true);
        try {
            const response = await createComment(postId, debouncedMessage, replyTo); // Giả định API trả về bình luận mới
            const newComment: Comment = {
                commentId: response.data?.id || `temp_${Date.now()}`,
                from: "Bạn",
                picture: "/default-avatar.png",
                message: debouncedMessage,
                created_time: new Date().toISOString(),
                attachments: undefined,
                hidden: false,
                parent_id: replyTo,
                containsPhoneNumber: /(?:\+84|0)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}\b/.test(debouncedMessage),
            };
            setComments((prev) => [...prev, newComment].sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime()));
            setMessage("");
            setReplyTo(null);
        } catch (err: any) {
            setError(err.message || "Lỗi khi tạo bình luận");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentId: string) => {
        if (!debouncedReplyMessage.trim()) return;
        setSubmitting(true);
        try {
            const response = await createComment(postId, debouncedReplyMessage, parentId); // Giả định API trả về bình luận mới
            const newComment: Comment = {
                commentId: response.data?.id || `temp_${Date.now()}`,
                from: "Bạn",
                picture: "/default-avatar.png",
                message: debouncedReplyMessage,
                created_time: new Date().toISOString(),
                attachments: undefined,
                hidden: false,
                parent_id: parentId,
                containsPhoneNumber: /(?:\+84|0)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}\b/.test(debouncedReplyMessage),
            };
            setComments((prev) => [...prev, newComment].sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime()));
            setReplyMessage("");
            setReplyTo(null);
        } catch (err: any) {
            setError(err.message || "Lỗi khi trả lời bình luận");
        } finally {
            setSubmitting(false);
        }
    };

    const handleHideComment = async (commentId: string, hidden: boolean) => {
        try {
            await hideComment(commentId, hidden);
            setComments((prev) =>
                prev.map((c) => (c.commentId === commentId ? { ...c, hidden } : c))
            );
        } catch (err: any) {
            setError(err.message || `Lỗi khi ${hidden ? "ẩn" : "hiện"} bình luận`);
        }
    };

    const renderComments = (parentId: string | null = null, level = 0) => {
        if (level > 2) return null;
        return comments
            .filter((c) => (c.parent_id ?? null) === parentId)
            .map((c) => (
                <div key={c.commentId} className={`ml-${level * 4} mb-2 max-w-2xl`}>
                    <div className="flex items-start mb-1">
                        <Image
                            src={c.picture || "/default-avatar.png"}
                            alt={c.from}
                            width={32}
                            height={32}
                            className="rounded-full mr-2"
                        />
                        <div className="flex-1">
                            <div className={`p-3 rounded-lg ${c.hidden ? "bg-gray-200 opacity-50" : "bg-gray-100"}`}>
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm text-gray-900">{c.from || "Ẩn danh"}</p>
                                    <button
                                        onClick={() => handleHideComment(c.commentId, !c.hidden)}
                                        className="text-xs text-gray-500 hover:text-blue-500"
                                    >
                                        {c.hidden ? "Hiện" : "Ẩn"}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-800 break-words">{c.message}</p>
                                {c.containsPhoneNumber && (
                                    <p className="text-xs text-red-500 mt-1">Bình luận chứa số điện thoại</p>
                                )}
                                {c.attachments?.map((att, index) => (
                                    <div key={index} className="mt-2">
                                        {att.type === "photo" && (
                                            <Image src={att.url} alt="Attachment" width={200} height={200} className="rounded-lg" />
                                        )}
                                        {att.type === "video" && (
                                            <video src={att.url} controls className="max-w-full rounded-lg" />
                                        )}
                                    </div>
                                ))}
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(c.created_time).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            {level < 2 && (
                                <button
                                    onClick={() => setReplyTo(c.commentId)}
                                    className="text-xs text-gray-600 hover:text-blue-500 mt-1"
                                >
                                    Trả lời
                                </button>
                            )}
                        </div>
                    </div>
                    {replyTo === c.commentId && level < 2 && (
                        <div className="ml-10 mb-2">
                            <textarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Viết trả lời..."
                                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => handleReply(c.commentId)}
                                    disabled={submitting || !debouncedReplyMessage.trim()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Gửi
                                </button>
                                <button
                                    onClick={() => setReplyTo(null)}
                                    className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}
                    {renderComments(c.commentId, level + 1)}
                </div>
            ));
    };

    return (
        <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bình luận</h3>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            {loading && page === 1 ? (
                <div className="animate-pulse space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start">
                            <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <p className="text-gray-600">Chưa có bình luận nào.</p>
            ) : (
                <div>{renderComments()}</div>
            )}
            {hasMore && !error && (
                <button
                    onClick={() => {
                        setPage((prev) => prev + 1);
                        fetchComments(page + 1);
                    }}
                    className="mt-4 text-blue-500 hover:text-blue-600 text-sm"
                >
                    Tải thêm
                </button>
            )}
            <div className="mt-4 flex items-start gap-2">
                <Image
                    src="/default-avatar.png"
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Viết bình luận..."
                    className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                />
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !debouncedMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}