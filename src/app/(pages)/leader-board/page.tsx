"use client";
import { TopKingCoinFrame } from "@/assets/icons";
import AppInput from "@/components/app-input";
import useDebounce from "@/hooks/useDebounce";
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
          <div>{/* <TopKingCoinFrame /> */}</div>
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
