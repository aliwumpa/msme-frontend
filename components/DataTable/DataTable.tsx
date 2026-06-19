import { useMSMEStore } from "@/store/useStore";
import { Dispatch, SetStateAction, useMemo } from "react";

type DataTableProps = {
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedInvoice: Dispatch<SetStateAction<string | null>>;
};

const getStatusClassName = (status: string) => {
  switch (status) {
    case "validated":
      return "verified";

    case "flagged":
      return "flagged";

    case "PROCESSING":
      return "processing";

    default:
      return "";
  }
};

const DataTable = ({ setIsDrawerOpen, setSelectedInvoice }: DataTableProps) => {
  const isTableLoading = useMSMEStore((state) => state.isTableLoading);
  const invoicesList = useMSMEStore((state) => state.invoicesList);
  const tableHeader = [
    "Invoice ID",
    "Vendor",
    "Date",
    "Amount",
    "Status",
    "Flagged Items",
  ];

  const tableRows = useMemo(() => {
    return invoicesList.map((item) => (
      <tr
        key={item.id}
        onClick={() => {
          setIsDrawerOpen(true);
          setSelectedInvoice(item.id);
        }}
      >
        <td>
          <div className="data-table__invoice">
            <strong>{item.invoiceNumber}</strong>
            {/* <p>
                  <span>{`${item.fileType} ${item.fileSize}`}</span>
                </p> */}
          </div>
        </td>

        <td>{item.vendorName}</td>

        <td>
          {" "}
          {new Date(item.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </td>

        <td>
          <strong>{item.total}</strong>
        </td>

        <td>
          <div
            className={`data-table__status ${getStatusClassName(
              item.validationStatus,
            )}`}
          >
            {getStatusClassName(item.validationStatus)}
          </div>
        </td>

        <td>
          <div className="data-table__flag-items">
            <span
              className={`data-table__flag-count ${getStatusClassName(
                item.validationStatus,
              )}`}
            >
              {item.flaggedItems}
            </span>
          </div>
        </td>
      </tr>
    ));
  }, [invoicesList]);

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

  const renderTable = () => {
    if (
      !Array.isArray(invoicesList) ||
      (invoicesList.length == 0 && !isTableLoading)
    ) {
      return (
        <div className="data-table__wrapper data-table__wrapper-empty">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
            <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
          </svg>
          <p>There is no submitted Invoices</p>
        </div>
      );
    }

    if (isTableLoading) {
      return <span className="icon-loader"></span>;
    }

    return (
      <>
        <div className="data-table__header">
          <h2 className="data-table__title">Recent Submissions</h2>

          {/* <button className="data-table__view-all">
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
        </button> */}
        </div>

        <div className="data-table__wrapper">
          <table className="data-table__table">
            {renderTableHeader()}
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div
      className={`data-table${isTableLoading ? " data-table__loading" : ""}`}
    >
      {renderTable()}
    </div>
  );
};

export default DataTable;
