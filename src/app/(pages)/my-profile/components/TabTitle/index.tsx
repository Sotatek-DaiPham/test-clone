import React from "react";

const TabTitle = ({ title }: { title: string }) => {
  return (
    <div className="my-4">
      <span className="text-24px-bold text-white">{title}</span>
    </div>
  );
};

export default TabTitle;
