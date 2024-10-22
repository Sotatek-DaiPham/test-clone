import AppImage from '@/components/app-image';
import {
  ArrowTurnDownRightIcon
} from "@public/assets";
import Image from 'next/image';
import { useState } from 'react';
import AppRoundedInfo from "@/components/app-rounded-info";
import AppInputComment from '@/components/app-input/app-input-comment';

const fakeData = [
  {
    id: 1,
    username: 'Người dùng 1',
    avatar: 'https://example.com/avatar1.jpg',
    date: '2023-06-15T10:30:00Z',
    comment: 'Đây là một bình luận mẫu.',
    replies: [
      {
        id: 2,
        username: 'Người dùng 2',
        avatar: 'https://example.com/avatar2.jpg',
        date: '2023-06-15T11:00:00Z',
        comment: 'Đây là một phản hồi mẫu.'
      }
    ]
  },
  {
    id: 3,
    username: 'Người dùng 3',
    avatar: 'https://example.com/avatar3.jpg',
    date: '2023-06-15T12:00:00Z',
    comment: 'Một bình luận mẫu khác.',
    replies: []
  }
]

const DiscussionItem = ({ data, onShowReplies }: any) => {
  return (
    <div className='flex flex-col gap-1'>
      <div className='px-6 py-4 rounded-2xl bg-neutral-2 flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <AppImage src={data.avatar} alt='avatar' className='w-10 h-10 rounded-full' />
          <div className='flex flex-col'>
            <span className='text-neutral-9 text-16px-bold"'>
              {data.username || "-"}
            </span>
            <span className='text-neutral-7 text-14px-medium'>
              {new Date(data.date).toLocaleString()}
            </span>
          </div>
        </div>
        <p className='text-neutral-9 text-14px-normal'>{data.comment}</p>
      </div>

      <div className='flex flex-col ml-6 gap-2'>
        <span className='text-neutral-7 text-14px-normal'>{`day ago`}</span>
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => onShowReplies(data.replies)}>
          <Image src={ArrowTurnDownRightIcon} alt="my-portfolio" />
          <span className='text-white text-14px-medium'>{`Reply (${data.replies.length})`}</span>
        </div>
      </div>
    </div>
  )
}

const DiscussionThread = () => {
  const [selectedReplies, setSelectedReplies] = useState([]);
  const [showInputComment, setShowInputComment] = useState(false);

  const handleShowReplies = (replies: any) => {
    setSelectedReplies(replies);
  }

  return (
    <div className='flex gap-6 w-full'>
      <div className='flex flex-col gap-6 flex-1'>
        {fakeData.map(item => (
          <DiscussionItem key={item.id} data={item} onShowReplies={handleShowReplies} />
        ))}

        {!showInputComment && <AppRoundedInfo text="Post a Reply" onClick={() => {setShowInputComment(true)}} />}

        {showInputComment && <AppInputComment onCancel={() => setShowInputComment(false)} />}
      </div>

      {selectedReplies.length > 0 && (
        <div className='flex flex-col gap-4 bg-neutral-2 px-6 py-4 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl flex-1'>
          <span className='text-neutral-9 text-16px-bold'>{`View replies (${selectedReplies.length})`}</span>
          {selectedReplies.map((reply: any) => (
            <div key={reply?.id} className='flex flex-col gap-2'>
              <div className=' flex flex-col gap-4'>
                <div className='flex items-center gap-3'>
                  <AppImage src={reply.avatar} alt='avatar' className='w-10 h-10 rounded-full' />
                  <div className='flex flex-col'>
                    <span className='text-neutral-9 text-16px-bold"'>
                      {reply.username || "-"}
                    </span>
                    <span className='text-neutral-7 text-14px-medium'>
                      {new Date(reply.date).toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className='text-neutral-9 text-14px-normal'>{reply.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DiscussionThread
