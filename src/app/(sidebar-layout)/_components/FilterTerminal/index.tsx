import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import Image from "next/image";

interface IFilterTerminal {
  search?: string;
  onChangeSearch: (search: string) => void;
  filterArr: any[];
  searchParams: any;
  handleClickFilter: (
    value: string,
    key: string,
    subValue?: any,
    subQueryKey?: any
  ) => void;
  handleClickFilterOption: (value: string, key: string) => void;
}

const FilterTerminal = ({
  filterArr,
  search,
  onChangeSearch,
  searchParams,
  handleClickFilter,
  handleClickFilterOption,
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
            customClass={`!w-fit mr-4 ${
              filter?.value === (searchParams?.filter ?? "trending")
                ? "hover:!opacity-100"
                : ""
            }`}
            onClick={() => {
              handleClickFilter(
                filter?.value,
                "filter",
                filter?.children ? filter?.children?.[0]?.value : "",
                filter?.children ? filter?.value : ""
              );
            }}
            classChildren="!flex !flex-row !items-center !pr-2"
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
            <span className="mx-2 ">{filter?.label}</span>
            {filter?.children &&
              filter?.value === (searchParams?.filter ?? "trending") && (
                <div className="flex flex-row gap-1">
                  {filter?.children?.map((children: any, index: number) => (
                    <span
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClickFilterOption(children?.value, filter?.value);
                      }}
                      className={`px-2 text-neutral-2 !text-14px-normal py-[3px] rounded-3xl bg-primary-7 hover:!bg-primary-2 hover:!text-neutral-9 ${
                        children?.value === searchParams?.[filter.value]
                          ? "!bg-primary-2 !text-neutral-9"
                          : ""
                      }`}
                    >
                      {children?.label}
                    </span>
                  ))}
                </div>
              )}
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
