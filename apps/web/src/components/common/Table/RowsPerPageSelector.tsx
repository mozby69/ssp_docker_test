type RowsPerPageSelectorProps = {
    rowsPerPage: number;
    setRowsPerPage: (value: number) => void;

    options?: number[];
    disabled?: boolean;
};

export function RowsPerPageSelector({
    rowsPerPage,
    setRowsPerPage,
    options = [5,10, 25, 50, 100],
    disabled = false,
}: RowsPerPageSelectorProps) {
    return (
        <select
            value={rowsPerPage}
            disabled={disabled}
            onChange={(event) =>
                setRowsPerPage(
                    Number(event.target.value)
                )
            }
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700"
        >
            {options.map((option) => (
                <option
                    key={option}
                    value={option}
                >
                    {option}
                </option>
            ))}
        </select>
    );
}