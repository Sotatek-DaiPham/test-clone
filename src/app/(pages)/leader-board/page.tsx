"use client";
import AppInput from "@/components/app-input";
import useDebounce from "@/hooks/useDebounce";
import Image from "next/image";
import { useState } from "react";

const LeaderboardPage = () => {
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);

  return (
    <div className="m-auto max-w-[var(--width-content-sidebar-layout)]">
      <div></div>
      <div className="w-full flex justify-end">
        <AppInput
          className="!w-[400px]"
          isSearch={true}
          iconPosition="right"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="my-6">
        <div className="grid grid-cols-6 gap-4">
          <div>
            {/* <Image
              src={TopKingCoinFrame}
              alt="menu icon"
              className="top-king"
            /> */}
          </div>
          <div>
            <div></div>
            <span></span>
          </div>
          <div>
            <span></span>
          </div>
          <div>
            <span></span>
          </div>
          <div>
            <span></span>
          </div>
          <div>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
