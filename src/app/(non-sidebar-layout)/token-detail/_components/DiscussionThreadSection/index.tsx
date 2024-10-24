"use client";

import AppInputComment from "@/components/app-input/app-input-comment";
import AppRoundedInfo from "@/components/app-rounded-info";
import { API_PATH } from "@/constant/api-path";
import { useAppSelector } from "@/libs/hooks";
import { getAPI, postFormDataAPI } from "@/service";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Form, message } from "antd";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import DiscussionItem from "./component/DiscussionItem";
import ReplySection from "./component/ReplySection";
import { DiscussionThreadItem } from "@/entities/my-profile";

const DiscussionThread = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const { id: tokenId } = params;
  const queryClient = useQueryClient();

  const { accessToken: isAuthenticated, address } = useAppSelector(
    (state) => state.user
  );
  const { userId } = useAppSelector((state) => state.user);

  const [selectedReplies, setSelectedReplies] = useState([]);
  const [showInputComment, setShowInputComment] = useState(false);
  const [isShowReplySection, setIsShowReplySection] = useState(false);
  const [replyTo, setReplyTo] = useState<{
    commentId: number | null;
    replyUserId: number | null;
  }>({ commentId: null, replyUserId: null });

  const fetchDiscussionThreads = async ({ pageParam = 1 }) => {
    const response = await getAPI(API_PATH.TOKEN.DISCUSSION_THREADS, {
      params: {
        direction: "DESC",
        page: pageParam,
        limit: 4,
        tokenId: Number(tokenId),
      },
    });
    return response.data;
  };

  const fetchRepliesDiscussion = async ({ pageParam = 1 }) => {
    const response = await getAPI(API_PATH.TOKEN.DISCUSSION_THREADS, {
      params: {
        direction: "DESC",
        page: pageParam,
        limit: 4,
        tokenId: Number(tokenId),
        replyId: replyTo.commentId,
      },
    });
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["discussionThreads", tokenId],
    queryFn: fetchDiscussionThreads,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < 4) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  const {
    data: repliesData,
    fetchNextPage: fetchNextRepliesPage,
    hasNextPage: hasNextRepliesPage,
    refetch: refetchReplies,
  } = useInfiniteQuery({
    queryKey: ["repliesDiscussion", replyTo.commentId],
    queryFn: fetchRepliesDiscussion,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < 4) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!replyTo.commentId,
  });

  useEffect(() => {
    if (repliesData) {
      const replies = repliesData.pages.flatMap((page) => page.data) || [];
      setSelectedReplies(replies as any);
    }
  }, [repliesData]);

  const handleShowReplies = useCallback(
    async (commentId: number, replyUserId: number) => {
      setReplyTo({ commentId, replyUserId });
      await refetchReplies();
      setIsShowReplySection(true);
    },
    [refetchReplies]
  );

  const uploadImagesMutation = useMutation({
    mutationFn: (payload: FormData) =>
      postFormDataAPI(API_PATH.UPLOAD_IMAGE, payload),
    onError: () => {
      message.error("Upload image failed");
    },
  });

  const postCommentMutation = useMutation({
    mutationFn: (payload: {
      userId: number;
      tokenId: number;
      replyId: number | null;
      replyUserId: number | null;
      content: string;
      image: string;
    }) => postFormDataAPI(API_PATH.USER.POST_COMMENT, payload),
    onSuccess: () => {
      message.success("Comment has been posted");
      form.resetFields();
      setShowInputComment(false);
      queryClient.invalidateQueries({ queryKey: ["discussionThreads"] });
      refetchReplies();
    },
    onError: () => {
      message.error("Post comment failed");
    },
  });

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadImagesMutation.mutateAsync(formData);
      if (data.success) {
        return data.data;
      } else {
        return "";
      }
    } catch (error) {
      return "";
    }
  };

  const onFinish = async (values: any) => {
    try {
      let imageUrl = "";
      if (values?.image && values?.image instanceof File) {
        imageUrl = await handleUpload(values.image);
      }

      const payload = {
        userId: Number(userId),
        tokenId: Number(tokenId),
        replyId: null,
        replyUserId: null,
        content: values.comment,
        image: imageUrl,
      };

      await postCommentMutation.mutateAsync(payload);
    } catch (error: any) {
      console.log("error submit comment", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const handleCloseReplySection = () => {
    setIsShowReplySection(false);
    setReplyTo({ commentId: null, replyUserId: null });
  };

  return (
    <div className="flex gap-6 w-full">
      <div className="flex gap-6 w-full">
        <div className="flex flex-col gap-6 flex-1 w-1/2">
          <InfiniteScroll
            dataLength={data?.pages.flatMap((page) => page.data).length || 0}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<div>Loading...</div>}
            style={{ maxHeight: "750px", overflow: "auto" }}
            endMessage={<p>No more comments to load</p>}
          >
            {data?.pages.flatMap((page) =>
              page.data.map((item: DiscussionThreadItem, index: number) => (
                <div key={index}>
                  <DiscussionItem
                    data={item}
                    onShowReplies={handleShowReplies}
                    selectedReplies={selectedReplies}
                  />
                </div>
              ))
            )}
          </InfiniteScroll>
          {isAuthenticated && !showInputComment && (
            <AppRoundedInfo
              text="Post a Reply"
              customClassName="cursor-pointer"
              onClick={() => {
                setShowInputComment(true);
              }}
            />
          )}

          {isAuthenticated && showInputComment && (
            <Form form={form} onFinish={onFinish}>
              <AppInputComment
                onCancel={() => {
                  setShowInputComment(false);
                }}
                onSubmit={onFinish}
              />
            </Form>
          )}
        </div>
        {/* reply section */}
        <div className="flex-1 w-1/2">
          {isShowReplySection && (
            <InfiniteScroll
              dataLength={selectedReplies?.flatMap((page) => page).length || 0}
              next={fetchNextRepliesPage}
              hasMore={!!hasNextRepliesPage}
              loader={<div>Loading...</div>}
            >
              <ReplySection
                onClose={handleCloseReplySection}
                refetchReplies={refetchReplies}
                selectedReplies={selectedReplies}
                isAuthenticated={isAuthenticated}
                onAddReply={onFinish}
                userId={userId}
                tokenId={tokenId}
                replyTo={replyTo}
                handleUpload={handleUpload}
                postCommentMutation={postCommentMutation}
              />
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionThread;
