import { NumberInput, useNumberInput } from "@/components/NumberInput";
import { Meta, StoryObj } from "@storybook/react";
import { ReactNode, useEffect } from "react";

const meta = {
  component: NumberInput,
} satisfies Meta<typeof NumberInput>;

export default meta;

type Args = {
  label: ReactNode;
  onChange?: () => void;
  errors?: string[];
  id?: string;
  placeholder?: string;
};

type Story = StoryObj<Args>;

const Template: Story = {
  render: function Wrapper(args) {
    const numberInputProps = useNumberInput({
      ...args,
      onChange: args.onChange ?? (() => undefined),
    });
    useEffect(() => {
      args.errors?.forEach((error) => {
        numberInputProps.addError(error);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <div className="p-4">
        <p>value = {numberInputProps.value}</p>
        <p>id = {numberInputProps.id}</p>
        <NumberInput {...numberInputProps} />
        <button
          style={{
            background: "red",
            color: "white",
            padding: "1rem",
            fontSize: "1rem",
            borderRadius: "0.5rem",
            margin: "1rem",
          }}
          onClick={numberInputProps.clearErrors}
        >
          Clear errors
        </button>
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

export const WithErrors: Story = {
  ...Template,
  args: {
    label: "With errors",
    errors: ["A longer text example of an error that happened", "Error 2"],
  },
};
