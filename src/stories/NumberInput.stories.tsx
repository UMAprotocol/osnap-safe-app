import { NumberInput, useNumberInput } from "@/components/NumberInput";
import { Meta, StoryObj } from "@storybook/react";
import { ReactNode } from "react";

const meta = {
  component: NumberInput,
} satisfies Meta<typeof NumberInput>;

export default meta;

type Args = {
  label: ReactNode;
  onChange?: (value: string) => void;
  required?: boolean;
  id?: string;
  placeholder?: string;
  validate?: (value: string) => boolean;
};

type Story = StoryObj<Args>;

const Template: Story = {
  render: function Wrapper(args) {
    const numberInputProps = useNumberInput(args);

    return (
      <div className="p-4">
        <p>value = {numberInputProps.value}</p>
        <p
          style={{
            marginBottom: "1rem",
          }}
        >
          id = {numberInputProps.id}
        </p>
        <NumberInput {...numberInputProps} />
      </div>
    );
  },
};

export const Default: Story = {
  ...Template,
  args: {
    label: "Default",
  },
};

export const Required: Story = {
  ...Template,
  args: {
    label: "Required",
    required: true,
  },
};

export const WithPlaceholder: Story = {
  ...Template,
  args: {
    label: "With placeholder",
    placeholder: "Placeholder",
  },
};

export const WithLabel: Story = {
  ...Template,
  args: {
    label: (
      <h3
        style={{
          color: "rebeccapurple",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Fancy label
      </h3>
    ),
  },
};

export const WithUserProvidedId: Story = {
  ...Template,
  args: {
    label: "With user provided id",
    id: "user-provided-id",
  },
};

export const WithChangeHandler: Story = {
  ...Template,
  args: {
    label: "With change handler",
    onChange: (value) => {
      if (value === "2") {
        alert("You entered 2!");
      }
    },
  },
};

export const WithCustomValidator: Story = {
  ...Template,
  args: {
    label: "With custom validator",
    validate: (value) => {
      if (value === "2") {
        return false;
      }
      return true;
    },
  },
};
