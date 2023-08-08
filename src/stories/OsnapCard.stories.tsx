import { OsnapCard } from "@/components/OsnapCard";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: OsnapCard,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="grid h-screen w-screen place-items-center bg-gray-50">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OsnapCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
  args: {
    spaceName: "HartDAO Arb Safe",
    spaceUrl: "https://snapshot.org/spaces/hartdaoarbsafe",
    status: "inactive",
    errors: [],
  },
};

export const Inactive = {
  ...Template,
  args: {
    ...Template.args,
    status: "inactive",
  },
};

export const Active: Story = {
  ...Template,
  args: {
    ...Template.args,
    status: "active",
  },
};

export const Error: Story = {
  ...Template,
  args: {
    ...Template.args,
    errors: ["Something went wrong when doing something", "Error 2"],
  },
};

export const NoSpace: Story = {
  ...Template,
  args: {
    ...Template.args,
    spaceName: undefined,
    spaceUrl: undefined,
  },
};
