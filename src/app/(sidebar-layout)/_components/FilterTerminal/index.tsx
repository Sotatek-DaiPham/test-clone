import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import Image from "next/image";

interface IFilterTerminal {
  search?: string;
  onChangeSearch: (search: string) => void;
  filterArr: any[];
  searchParams: any;
  handleClickFilter: (value: string, key: string) => void;
}

const FilterTerminal = ({
  filterArr,
  search,
  onChangeSearch,
  searchParams,
  handleClickFilter,
}: IFilterTerminal) => {
  return (
    <div className="w-full flex flex-row justify-between items-center mt-5 overflow-auto">
      <div className="mr-4 overflow-auto relative flex flex-row">
        {filterArr?.map((filter: any, index: number) => (
          <AppButton
            key={index}
            typeButton={
              filter?.value === (searchParams?.filter ?? "trending")
                ? "primary"
                : "secondary"
            }
            customClass="!w-fit mr-4"
            onClick={() => {
              handleClickFilter(filter?.value, "filter");
            }}
            classChildren="!flex !flex-row"
          >
            {filter?.icon && (
              <Image
                src={filter?.icon}
                alt={searchParams?.filter ?? "trending"}
                className={
                  filter?.value === (searchParams?.filter ?? "trending")
                    ? "active-filter-icon"
                    : "filter-icon"
                }
              />
            )}
            <span className="ml-2">{filter?.label}</span>
          </AppButton>
        ))}
      </div>
      <AppInput
        className="!w-[300px] !rounded-full"
        isSearch
        iconPosition="left"
        placeholder="Search"
        value={search}
        onChange={(e) => onChangeSearch(e.target.value)}
      />
    </div>
  );
};

export default FilterTerminal;
