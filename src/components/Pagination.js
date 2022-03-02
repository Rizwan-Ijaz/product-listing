import { Pagination as BootstrapPagination, Form } from "react-bootstrap";
import { usePagination, DOTS } from "../hooks/usePagination";

export function Pagination({ totalCount, currentPage, pageSize, onChange }) {
  const paginationRange = usePagination({
    totalCount,
    pageSize,
    currentPage,
    siblingCount: 2,
  });

  const handlePageChange = (page) => {
    onChange(page, pageSize);
  };

  const handlePageSizeChange = (size) => {
    onChange(currentPage, size);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="d-flex" style={{ gap: 10 }}>
      <BootstrapPagination size="sm">
        {currentPage > 1 && (
          <BootstrapPagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        )}

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <BootstrapPagination.Ellipsis disabled key={`dot-${index}`} />
            );
          }
          return (
            <BootstrapPagination.Item
              key={`page-${pageNumber}`}
              active={pageNumber === currentPage}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </BootstrapPagination.Item>
          );
        })}
        {currentPage < lastPage && (
          <BootstrapPagination.Next
            disabled={currentPage === lastPage}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        )}
      </BootstrapPagination>

      <Form.Select
        value={pageSize}
        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        size="sm"
        style={{ width: 100, height: 30 }}
      >
        <option>5</option>
        <option>10</option>
        <option>15</option>
      </Form.Select>
    </div>
  );
}
