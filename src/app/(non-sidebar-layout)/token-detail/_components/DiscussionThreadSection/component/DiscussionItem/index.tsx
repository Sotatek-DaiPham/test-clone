import AppImage from "@/components/app-image";
import { DiscussionThreadItem, IReplyThreadItem } from "@/entities/my-profile";
import { ArrowTurnDownRightIcon } from "@public/assets";
import Image from "next/image";

interface DiscussionItemProps {
  data: DiscussionThreadItem;
  onShowReplies: (commentId: number, replyUserId: number) => void;
  selectedReplies: IReplyThreadItem[];
}

const DiscussionItem: React.FC<DiscussionItemProps> = ({ data, onShowReplies, selectedReplies }) => {
  return (
    <div className='flex flex-col gap-1 mb-6'>
      <div className='px-6 py-4 rounded-2xl bg-neutral-2 flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <div className="p-auto">
            <AppImage
              className="!bg-neutral-4 w-[40px] h-[40px] rounded-full overflow-hidden flex"
              src={data.avatar || ''}
              alt="avatar"
            />
          </div>
          <div className='flex flex-col'>
            <span className='text-neutral-9 text-16px-bold"'>
              {data.username || "-"}
            </span>
            <span className='text-neutral-7 text-14px-medium'>
              {new Date(data.created_at).toLocaleString()}
            </span>
          </div>
        </div>
        <p className='text-neutral-9 text-14px-normal'>{data.content}</p>
      </div>

      <div className='flex flex-col ml-6 gap-2'>
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => {
          onShowReplies(data.comment_id, data.user_id);
        }}>
          <Image src={ArrowTurnDownRightIcon} alt="my-portfolio" />
          {data.mostRecentUserComments && data.mostRecentUserComments.length > 0 && (
            <div className="flex mr-2 relative">
              {data.mostRecentUserComments.slice(0, 2).map((comment, index) => (
                <AppImage
                  key={index}
                  className={`!bg-neutral-4 w-[18px] h-[18px] rounded-full overflow-hidden flex border-2 border-neutral-2 ${index === 1 ? 'absolute left-[14px]' : ''}`}
                  src={comment.avatar || ''}
                  alt={`User ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          <span className={`${selectedReplies.some(reply => Number(reply?.reply_id) === Number(data?.comment_id)) ? 'text-primary-main' : 'text-white'} text-14px-medium`}>{`Reply (${data.number_replies})`}</span>
        </div>
      </div>
    </div>
  )
}
export default DiscussionItem;