import withClient from "@/helpers/with-client";
import { NoDataIcon } from "@public/assets";
import Image from "next/image";

const NoData = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center mt-[150px] md:mb-[150px]">
      <div className="w-fit m-auto">
        <Image src={NoDataIcon} alt="no-data" />
      </div>
      <div className="text-16px-medium text-neutral-7 text-center mt-3">
        No Data
      </div>
    </div>
  );
};

export default withClient(NoData);
