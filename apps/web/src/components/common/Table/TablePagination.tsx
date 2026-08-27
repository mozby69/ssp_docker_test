import type { TablePaginationProps } from "./table.types";

export function TablePagination({
    pagination,
    onPageChange,
}: TablePaginationProps) {
    if (!pagination) {
        return null;
    }

    const { page, totalPages } = pagination;



    const canGoPrevious = page > 1;
    const canGoNext = page < totalPages;

    return (
        <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={!canGoPrevious}
                    onClick={() => onPageChange(page - 1)}
                    className="
                        rounded-md
                        border border-gray-300
                        px-3 py-2
                        text-sm text-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    Previous
                </button>

                <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => onPageChange(page + 1)}
                    className="
                        rounded-md
                        border border-gray-300
                        px-3 py-2
                        text-sm text-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    Next
                </button>
            </div>
        </div>
    );
}