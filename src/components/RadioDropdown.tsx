"use client";

import { Icon } from "@/components";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useId, type ReactNode } from "react";

export type DropdownItem<
  TValue extends string | number,
  TLabel extends string,
> = {
  value: TValue;
  label: TLabel;
};

type Props<TValue extends string | number, TLabel extends string> = {
  items: DropdownItem<TValue, TLabel>[];
  selected: DropdownItem<TValue, TLabel> | undefined;
  onSelect: (item: DropdownItem<TValue, TLabel>) => void;
  label?: ReactNode;
  disabled?: boolean;
  id?: string;
};
export function RadioDropdown<
  TValue extends string | number,
  TLabel extends string,
>(props: Props<TValue, TLabel>) {
  const reactId = useId();
  const id = props.id ?? reactId;
  return (
    <div>
      {!!props.label && (
        <label htmlFor={props.id} className="mb-1 block font-semibold">
          {props.label}
        </label>
      )}
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger
          id={id}
          disabled={props.disabled}
          className="group flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-xs data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
        >
          {props.selected?.label ?? (
            <span className="opacity-50">Select option</span>
          )}
          <Icon
            name="chevron-down"
            className="h-5 w-5 text-gray-900 transition group-data-[state=open]:rotate-180"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          align="start"
          side="bottom"
          sideOffset={4}
          className="mt-1 w-[--radix-dropdown-menu-trigger-width] rounded-lg border border-gray-300 bg-white text-gray-900 shadow-xs"
        >
          {props.items.map((item) => (
            <DropdownMenu.RadioItem
              value={item.value.toString()}
              onSelect={() => {
                props.onSelect(item);
              }}
              key={item.value}
              className="mb-1 cursor-pointer px-3 py-2 transition first:rounded-t-lg last:mb-0 last:rounded-b-lg hover:bg-gray-50"
            >
              {item.label}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
