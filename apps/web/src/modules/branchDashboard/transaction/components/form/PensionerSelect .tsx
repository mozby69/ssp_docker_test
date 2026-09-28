"use client";

import { useState, type ChangeEvent} from "react";
import { useSearchPensioners } from "../../hooks/useAddTransaction"; 

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";



type PensionerSelectProps<
  T extends FieldValues
> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
};

export function PensionerSelect<T extends FieldValues>({
  name,
  control,
  label = "Pensioner",
}: PensionerSelectProps<T>) {
  const [search, setSearch] = useState("");
  const [selectedLabel, setSelectedLabel] =   useState("");
  const [isOpen, setIsOpen] =useState(false);

  const {data: pensioners = [], isLoading} = useSearchPensioners(search);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearch(value);
    setSelectedLabel("");
    setIsOpen(true);
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field,
        fieldState,
      }) => (
        <div className="relative space-y-1">
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>

          <input
            type="text"
            value={
              selectedLabel || search
            }
            placeholder="Search ID or pensioner name"
            autoComplete="off"
            onFocus={() =>
              setIsOpen(true)
            }
            onChange={(event) => {
              field.onChange(0);

              handleSearchChange(
                event
              );
            }}
            className={[
              "w-full rounded-md border px-3 py-2 text-sm outline-none",
              "focus:ring-2 focus:ring-blue-500",
              fieldState.error
                ? "border-red-500"
                : "border-gray-300",
            ].join(" ")}
          />

          {isOpen && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
              {isLoading && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Searching...
                </div>
              )}

              {!isLoading &&
                pensioners.length ===
                  0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No pensioners
                    found.
                  </div>
                )}

              {!isLoading &&
                pensioners.map(
                  (pensioner) => {
                    const fullName =
                      `${pensioner.firstname ?? ""} ${pensioner.lastname ?? ""}`.trim();

                    const label =
                      `${fullName}`;

                    return (
                      <button
                        key={
                          pensioner.id
                        }
                        type="button"
                        onClick={() => {
                          field.onChange(
                            pensioner.id
                          );

                          setSelectedLabel(
                            label
                          );

                          setSearch("");
                          setIsOpen(
                            false
                          );
                        }}
                        className="flex w-full flex-col px-3 py-2 text-left hover:bg-gray-100"
                      >
                        <span className="text-sm font-medium">
                          {label}
                        </span>

                        {pensioner.age !==
                          null && (
                          <span className="text-xs text-gray-500">
                            Age:{" "}
                            {
                              pensioner.age
                            }
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
            </div>
          )}

          {fieldState.error && (
            <p className="text-sm text-red-500">
              {
                fieldState.error
                  .message
              }
            </p>
          )}
        </div>
      )}
    />
  );
}