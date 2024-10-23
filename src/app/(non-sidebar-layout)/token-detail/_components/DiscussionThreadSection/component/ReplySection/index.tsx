import AppImage from '@/components/app-image'
import React from 'react'
import { Form } from 'antd'
import AppInputComment from '@/components/app-input/app-input-comment'
import { AxiosResponse } from 'axios';
import Image from 'next/image';
import { CloseIcon } from '@public/assets';

interface DiscussionThreadItem {
    comment_id: number;
    avatar: string | null;
    username: string;
    created_at: string;
    content: string;
}

interface ReplySectionProps {
    selectedReplies: DiscussionThreadItem[];
    onAddReply: (comment: string, image?: File) => void;
    isAuthenticated: string | null;
    userId: string | null;
    tokenId: string | string[];
    replyTo: {
        commentId: number | null;
        replyUserId: number | null;
    };
    handleUpload: (file: File) => Promise<string>;
    postCommentMutation: {
        mutateAsync: (payload: any) => Promise<AxiosResponse<any, any>>;
    };
    refetchReplies: any;
    onClose: () => void;
}

const ReplySection: React.FC<ReplySectionProps> = ({ 
    onClose, 
    selectedReplies, 
    onAddReply, 
    isAuthenticated, 
    userId, 
    tokenId, 
    replyTo, 
    handleUpload, 
    postCommentMutation, 
    refetchReplies 
}) => {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            let imageUrl = '';
            if (values?.image && values?.image instanceof File) {
                imageUrl = await handleUpload(values.image);
            }
            console.log('imageUrl', imageUrl);
            const payload = {
                userId: Number(userId),
                tokenId: Number(tokenId),
                replyId: replyTo.commentId,
                replyUserId: replyTo.replyUserId,
                content: values.comment,
                image: imageUrl
            }
            console.log('payload',payload)
            await postCommentMutation.mutateAsync(payload);
            form.resetFields();

            await refetchReplies();
        } catch (error: any) {
            console.log('error', error);
        }
    };

    return (
        <div className='flex flex-col gap-4 bg-neutral-2 px-6 py-4 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl flex-1 h-fit relative'>
            <span className='text-neutral-9 text-16px-bold'>
                {`View replies (${selectedReplies.length})`}
            </span>
            <Image
                src={CloseIcon}
                alt="Close"
                className="absolute top-4 right-4 cursor-pointer"
                width={24}
                height={24}
                onClick={onClose}
            />
            <div className='max-h-[750px] overflow-y-auto'>
                {selectedReplies.map((reply: DiscussionThreadItem) => (
                    <div key={reply?.comment_id} className='flex flex-col gap-2 mb-4'>
                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center gap-3'>
                                <div className="p-auto">
                                    <AppImage
                                        className="!bg-neutral-4 w-[40px] h-[40px] rounded-full overflow-hidden flex"
                                        src={reply.avatar || ''}
                                        alt="avatar"
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-neutral-9 text-16px-bold" break-words'>
                                        {reply.username || "-"}
                                    </span>
                                    <span className='text-neutral-7 text-14px-medium break-words'>
                                        {new Date(reply.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <p className='text-neutral-9 text-14px-normal break-words max-w-[300px] md:max-w-[400px]'>
                                {reply.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='w-full h-[1px] bg-neutral-3'></div>

            {isAuthenticated && (
                <Form form={form} onFinish={onFinish}>
                    <AppInputComment 
                        onCancel={() => form.resetFields()} 
                        onSubmit={onFinish} 
                        showCancelButton={false} 
                    />
                </Form>
            )}
        </div>
    )
}

export default ReplySection
