import AppButton from "@/components/app-button";
import AppImage from "@/components/app-image";
import AppInput from "@/components/app-input";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { useCallback } from "react";

interface IFilterTerminal {
  search?: string;
  onChangeSearch: (search: string) => void;
  activeFilter: string;
}

const FILTER_TERMINAL = [
  {
    label: "Trending",
    value: "trending",
    icon: null,
  },
  {
    label: "Top",
    value: "top",
    icon: null,
  },
  {
    label: "Rising",
    value: "rising",
    icon: null,
  },
  {
    label: "New",
    value: "new",
    icon: null,
  },
  {
    label: "Finalized",
    value: "finalized",
    icon: null,
  },
  {
    label: "Age",
    value: "age",
    icon: null,
  },
  {
    label: "Min progress",
    value: "min-progress",
    icon: null,
  },
  {
    label: "Max progress",
    value: "max-progress",
    icon: null,
  },
];

const FilterTerminal = ({ search, onChangeSearch }: IFilterTerminal) => {
  const { searchParams, setSearchParams } = useAppSearchParams("filter");

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
    <div className="w-full flex flex-row items-center mt-5">
      <div className="w-full overflow-scroll flex flex-row">
        {FILTER_TERMINAL?.map((filter: any, index: number) => (
          <AppButton
            key={index}
            typeButton={
              filter?.value === searchParams?.filter ? "primary" : "secondary"
            }
            customClass="w-fit mr-4"
            onClick={() => {
              handleClickFilter(filter?.value, "filter");
            }}
          >
            <AppImage src={filter?.icon} />
            {filter?.label}
          </AppButton>
        ))}
        <AppButton
          typeButton="primary"
          customClass="w-fit"
          onClick={(v) => {
            handleClickFilter("trending", "filter");
          }}
        >
          Trending
        </AppButton>
        <AppButton
          typeButton="secondary"
          customClass="w-fit"
          onClick={(v) => {
            handleClickFilter("top", "filter");
          }}
        >
          Top
        </AppButton>
        <AppButton
          typeButton="secondary"
          customClass="w-fit"
          onClick={(v) => {
            handleClickFilter("rising", "filter");
          }}
        >
          Rising
        </AppButton>
        <AppButton typeButton="secondary" customClass="w-fit">
          New
        </AppButton>
        <AppButton typeButton="secondary" customClass="w-fit">
          Finalized
        </AppButton>
        <AppButton typeButton="outline" customClass="w-fit">
          Age
        </AppButton>
        <AppButton typeButton="outline" customClass="w-fit">
          Min progress
        </AppButton>
        <AppButton typeButton="outline" customClass="w-fit">
          Max progress
        </AppButton>
      </div>
      <AppInput
        className="w-[200px]"
        isSearch
        iconPosition="right"
        placeholder="Search"
        value={search}
        onChange={(e) => onChangeSearch(e.target.value)}
      />
    </div>
  );
};

export default FilterTerminal;
