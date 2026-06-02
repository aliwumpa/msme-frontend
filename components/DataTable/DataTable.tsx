import { Dispatch, SetStateAction } from "react";

type DataTableProps = {
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedInvoice: Dispatch<SetStateAction<string | null>>;
};

const dataInvoice = [
  {
    invoiceId: "#INV-2024-089",
    fileType: "PDF",
    fileSize: "2.4 MB",
    vendor: "Global Logistics Inc.",
    date: "Oct 24, 2023",
    amount: "$12,450.00",
    status: "VERIFIED",
    flagCount: 0,
  },
  {
    invoiceId: "#INV-2024-090",
    fileType: "XML",
    fileSize: "156 KB",
    vendor: "Stark Industries",
    date: "Oct 23, 2023",
    amount: "$84,200.50",
    status: "FLAGGED",
    flagCount: 2,
  },
];

const getStatusClassName = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return "verified";

    case "FLAGGED":
      return "flagged";

    case "PROCESSING":
      return "processing";

    default:
      return "";
  }
};

const DataTable = ({ setIsDrawerOpen, setSelectedInvoice }: DataTableProps) => {
  const tableHeader = [
    "Invoice ID",
    "Vendor",
    "Date",
    "Amount",
    "Status",
    "Flagged Items",
  ];

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          {tableHeader.map((name, idx) => (
            <th key={`head-${idx}`}>{name}</th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody>
        {dataInvoice.map((item) => (
          <tr
            key={item.invoiceId}
            onClick={() => {
              setIsDrawerOpen(true);
              setSelectedInvoice(item.invoiceId);
            }}
          >
            <td>
              <div className="data-table__invoice">
                <strong>{item.invoiceId}</strong>
                <p>
                  <span>{`${item.fileType} ${item.fileSize}`}</span>
                </p>
              </div>
            </td>

            <td>{item.vendor}</td>

            <td>{item.date}</td>

            <td>
              <strong>{item.amount}</strong>
            </td>

            <td>
              <div
                className={`data-table__status ${getStatusClassName(
                  item.status,
                )}`}
              >
                {item.status}
              </div>
            </td>

            <td>
              <div className="data-table__flag-items">
                <span
                  className={`data-table__flag-count ${getStatusClassName(
                    item.status,
                  )}`}
                >
                  {item.flagCount}
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="data-table">
      <div className="data-table__header">
        <h2 className="data-table__title">Recent Submissions</h2>

        <button className="data-table__view-all">
          <span>View All</span>
          <span>
            {" "}
            <svg
              className="data-table__icon-arrow-right"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
        </button>
      </div>

      <div className="data-table__wrapper">
        <table className="data-table__table">
          {renderTableHeader()}
          {renderTableBody()}
        </table>
      </div>
    </div>
  );
};

export default DataTable;
