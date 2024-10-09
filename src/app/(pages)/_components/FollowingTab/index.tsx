import useDebounce from "@/hooks/useDebounce";
import { useCallback, useState } from "react";
import FilterTerminal from "../FilterTerminal";
import ProjectCard from "../ProjectCard";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";

const data = [
  {
    title: "Project name",
    percent: 70,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus doloribus dolorum minus vero molestias iste ullam perspiciatis, odio ipsum harum laudantium earum consequuntur nesciunt dolore sapiente error deleniti perferendis nulla!",
    total: 500000,
    currentValue: 200000,
    stage: "S1",
  },
  {
    title: "Project name",
    percent: 10,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus doloribus dolorum minus vero molestias iste ullam perspiciatis, odio ipsum harum laudantium earum consequuntur nesciunt dolore sapiente error deleniti perferendis nulla!",
    total: 5900000,
    currentValue: 2123000,
    stage: "S1",
  },
  {
    title: "Project name",
    percent: 70,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus doloribus dolorum minus vero molestias iste ullam perspiciatis, odio ipsum harum laudantium earum consequuntur nesciunt dolore sapiente error deleniti perferendis nulla!",
    total: 500000,
    currentValue: 200000,
    stage: "S1",
  },
  {
    title: "Project name",
    percent: 10,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus doloribus dolorum minus vero molestias iste ullam perspiciatis, odio ipsum harum laudantium earum consequuntur nesciunt dolore sapiente error deleniti perferendis nulla!",
    total: 5900000,
    currentValue: 2123000,
    stage: "S1",
  },
];

const FILTER_TERMINAL = [
  {
    label: "Activity",
    value: "activity",
    icon: null,
  },
  {
    label: "Created coins",
    value: "created",
    icon: null,
  },
];

const FollowingTab = () => {
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const { searchParams, setSearchParams } = useAppSearchParams("terminal");

  const handleClickFilter = useCallback(
    (value: any, queryKey: string) => {
      setSearchParams({
        ...searchParams,
        [queryKey]: value,
      });
    },
    [searchParams, setSearchParams]
  );
  return (
    <div>
      <FilterTerminal
        search={search}
        onChangeSearch={setSearch}
        filterArr={FILTER_TERMINAL}
        searchParams={searchParams}
        handleClickFilter={handleClickFilter}
      />
      <div className="grid grid-cols-3 gap-6 my-9">
        {data?.map((project: any, index: number) => (
          <ProjectCard data={project} key={index} />
        ))}
      </div>
    </div>
  );
};

export default FollowingTab;
