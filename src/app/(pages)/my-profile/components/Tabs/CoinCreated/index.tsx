import ProjectCard from "@/app/(pages)/_components/ProjectCard";
import TabTitle from "../../TabTitle";

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
  {
    title: "Project name",
    percent: 70,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus doloribus dolorum minus vero molestias iste ullam perspiciatis, odio ipsum harum laudantium earum consequuntur nesciunt dolore sapiente error deleniti perferendis nulla!",
    total: 500000,
    currentValue: 200000,
    stage: "S1",
  },
];
const CoinCreatedTab = () => {
  return (
    <div>
      <TabTitle title="Coin created" />
      <div className="grid grid-cols-2 gap-6 my-9">
        {data?.map((project: any, index: number) => (
          <ProjectCard data={project} key={index} />
        ))}
      </div>
    </div>
  );
};

export default CoinCreatedTab;
