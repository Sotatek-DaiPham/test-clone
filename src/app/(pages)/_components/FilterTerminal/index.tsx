import AppButton from "@/components/app-button";
import AppImage from "@/components/app-image";
import AppInput from "@/components/app-input";

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
            customClass="w-fit mr-4"
            onClick={() => {
              handleClickFilter(filter?.value, "filter");
            }}
          >
            <AppImage src={filter?.icon} />
            {filter?.label}
          </AppButton>
        ))}
      </div>
      <AppInput
        className="!w-[300px]"
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
