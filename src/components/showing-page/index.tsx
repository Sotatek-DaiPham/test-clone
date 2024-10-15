"use client";

import withClient from "@/helpers/with-client";

const ShowingPage = ({ total, range }: any) => {
  return (
    <span>
      Showing {range[0]}-{range[1]} of {total}
    </span>
  );
};

export default withClient(ShowingPage);
