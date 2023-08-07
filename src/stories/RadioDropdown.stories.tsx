import { RadioDropdown, type DropdownItem } from "@/components/RadioDropdown";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta = {
  component: RadioDropdown,
} satisfies Meta<typeof RadioDropdown>;

export default meta;

type Story = StoryObj<typeof RadioDropdown>;

const mockItems = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" },
];

const Template: Story = {
  args: {
    items: mockItems,
  },
  render: function Wrapper(args) {
    const [selected, setSelected] = useState<DropdownItem | undefined>(
      args.selected,
    );

    return (
      <RadioDropdown {...args} selected={selected} onSelect={setSelected} />
    );
  },
};

export const Default = {
  ...Template,
  args: {
    ...Template.args,
    label: "Default",
  },
};

export const Selected = {
  ...Template,
  args: {
    ...Template.args,
    label: "Selected",
    selected: mockItems[1],
  },
};

export const Disabled = {
  ...Template,
  args: {
    ...Template.args,
    label: "Disabled",
    disabled: true,
  },
};
