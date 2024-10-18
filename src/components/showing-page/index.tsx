"use client";

import withClient from "@/helpers/with-client";

const ShowingPage = ({ total, range }: any) => {
  return (
    <span className="!text-neutral-7">
      Showing {range[0]}-{range[1]} of {total}
    </span>
  );
};

export default withClient(ShowingPage);
