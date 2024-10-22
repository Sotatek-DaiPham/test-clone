import AppButton from "@/components/app-button";
import AppDropdown from "@/components/app-dropdown";
import AppInput from "@/components/app-input";
import { DropdownIcon } from "@public/assets";
import Image from "next/image";
import { useState } from "react";

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
  const [openDropdownStatus, setOpenDropdownStatus] = useState<any>({
    age: false,
    minProgress: false,
    maxProgress: false,
  });

  return (
    <div className="w-full flex flex-row justify-between items-center mt-5 overflow-auto">
      <div className="mr-4 overflow-auto relative flex flex-row">
        {[...filterArr?.slice(0, 5)]?.map((filter: any, index: number) => (
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
        {[...filterArr?.slice(5)]?.map((filter: any, index: number) => {
          const child1 = filter?.children;
          const child2 = filter?.children1 ? filter?.children1 : [];
          let child = [...child1, ...child2];
          return (
            <AppDropdown
              key={index}
              menu={{
                items: child?.map((x) => ({
                  ...x,
                  onClick: () => {
                    handleClickFilterOption(x?.key, filter.value);
                  },
                })),
                selectable: true,
              }}
              open={openDropdownStatus[filter?.value]}
              onOpenChange={(open: any) =>
                setOpenDropdownStatus({
                  ...openDropdownStatus,
                  [filter?.value]: open,
                })
              }
              trigger={["click"]}
              className="!mr-4"
            >
              <div className="app-button min-w-fit mr-4 secondary middle text-14px-bold flex flex-row items-center px-[15px] py-3 cursor-pointer">
                <Image
                  src={DropdownIcon}
                  alt="drop-down"
                  className={
                    openDropdownStatus[filter?.value] ? "rotate-180" : ""
                  }
                />
                <span className="ml-2">
                  {child?.find((x) => x?.key === searchParams[filter?.value])
                    ? child?.find((x) => x?.key === searchParams[filter?.value])
                        ?.label
                    : filter?.label}
                </span>
              </div>
            </AppDropdown>
          );
        })}
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
