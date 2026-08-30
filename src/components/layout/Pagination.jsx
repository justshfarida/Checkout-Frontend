import "./Pagination.css";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="pagination"
      aria-label="Product pages"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() =>
          onPageChange(page - 1)
        }
      >
        Previous
      </button>

      {Array.from(
        { length: totalPages },
        (_, index) => {
          const pageNumber =
            index + 1;

          return (
            <button
              key={pageNumber}
              type="button"
              className={
                page === pageNumber
                  ? "pagination__button pagination__button--active"
                  : "pagination__button"
              }
              onClick={() =>
                onPageChange(
                  pageNumber
                )
              }
            >
              {pageNumber}
            </button>
          );
        }
      )}

      <button
        type="button"
        disabled={
          page === totalPages
        }
        onClick={() =>
          onPageChange(page + 1)
        }
      >
        Next
      </button>
    </nav>
  );
}