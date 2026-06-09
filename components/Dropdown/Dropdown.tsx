"use client";

import { useMSMEStore } from "@/store/useStore";

type Option = {
  label: string;
  value: string;
};

const dropdownOptions: Option[] = [
  {
    label: "DISHUB - denda parkir",
    value: "dishub denda parkir",
  },
  {
    label: "DISHUB - tilang mobil barang",
    value: "dishub tilang mobil barang",
  },
  {
    label: "Menkeu - pajak kurang bayar",
    value: "menkeu pajak kurang bayar",
  },
  {
    label: "Menkeu - pajak bea cukai",
    value: "menkeu pajak bea cukai",
  },
];

const Dropdown = () => {
  const selectedOption = useMSMEStore((state) => state.selectedOption);
  const setSelectedOption = useMSMEStore((state) => state.setSelectedOption);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="dropdown">
      <label htmlFor="documentType" className="dropdown__label">
        Document Type
      </label>

      <select
        id="documentType"
        className="dropdown__select"
        value={selectedOption ?? ""}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select a document...
        </option>

        {dropdownOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
