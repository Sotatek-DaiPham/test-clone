import AppInput from "@/components/app-input";
import TabTitle from "../../TabTitle";
import UserFollow from "../../UserFollow";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import AppPagination from "@/components/app-pagination";

const data = [
  {
    name: "ABC",
    avatar: null,
    follower: 1,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 2,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 0,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 345,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 345,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 4575678,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 1231,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
];

const FollowingTab = () => {
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);

  return (
    <div>
      <TabTitle title="Following" />
      <AppInput
        className="!w-[400px]"
        isSearch
        iconPosition="right"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="my-6 w-[70%]">
        {data?.map((user: any, index: number) => (
          <UserFollow data={user} key={index} />
        ))}
      </div>
      <AppPagination />
    </div>
  );
};

export default FollowingTab;
