import React, { ChangeEvent, useState, useRef } from 'react';
import { Input, message } from 'antd';
import { LinkHorizontalIcon, CloseIcon } from '@public/assets';
import Image from 'next/image';
import AppRoundedInfo from '@/components/app-rounded-info';

const { TextArea } = Input;

interface FileItem {
    uid: string;
    name: string;
    status: string;
    url: string | ArrayBuffer | null;
}

interface AppInputCommentProps {
    onCancel: () => void;
}

const AppInputComment: React.FC<AppInputCommentProps> = ({ onCancel }) => {
    const [comment, setComment] = useState('');
    const [fileList, setFileList] = useState<FileItem[]>([]);
    const [canUpload, setCanUpload] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    console.log('fileList', fileList)

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!canUpload) return;

        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    setFileList([{
                        uid: '-1',
                        name: file.name,
                        status: 'done',
                        url: e.target.result,
                    }]);
                    setCanUpload(false);
                }
            };
            reader.readAsDataURL(file);
            message.success(`${file.name} tệp đã được tải lên thành công.`);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current && canUpload) {
            fileInputRef.current.click();
        }
    };

    const removeImage = () => {
        setFileList([]);
        setCanUpload(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="app-input-comment border border-neutral-5 rounded-[8px] p-3">
            <TextArea
                rows={1}
                placeholder="Describe ..."
                value={comment}
                onChange={handleCommentChange}
                className="comment-textarea border-none focus:shadow-none !bg-transparent text-neutral-9 !resize-none"
            />
            <div className="upload-section flex items-end justify-between mt-2">
                <div className="flex items-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    {fileList.length > 0 && fileList[0].url && (
                        <div className="uploaded-image relative">
                            <Image src={fileList[0].url.toString()} alt="Uploaded" width={80} height={80} className="max-h-[80px] object-cover" />
                            <Image
                                src={CloseIcon}
                                alt="Xóa"
                                onClick={removeImage}
                                className="absolute top-0 right-0 cursor-pointer"
                                width={20}
                                height={20}
                                style={{ color: '#777E90' }}
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center gap-3">
                    <Image
                        src={LinkHorizontalIcon}
                        alt="image"
                        onClick={triggerFileInput}
                        className={`upload-icon cursor-pointer ${!canUpload ? 'opacity-50' : ''}`}
                    />
                    <AppRoundedInfo
                        text="Cancel"
                        onClick={onCancel}
                        customClassName='w-fit'
                    />
                    <AppRoundedInfo
                        text="Post"
                        onClick={() => {/* Xử lý đăng bài */ }}
                        customClassName='w-fit'
                    />
                </div>
            </div>
        </div>
    );
};

export default AppInputComment;
