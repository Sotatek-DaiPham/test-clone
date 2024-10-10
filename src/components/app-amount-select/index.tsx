const AppAmountSelect = ({
  numbers,
  onSelect,
}: {
  numbers: number[];
  onSelect: (value: number) => void;
}) => {
  return (
    <div className="flex gap-2 mt-2">
      {numbers.map((num, index) => (
        <button
          key={index}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={() => onSelect(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default AppAmountSelect;
