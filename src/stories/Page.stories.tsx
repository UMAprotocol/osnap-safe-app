import Home from "@/app/page";
import RootLayout from "@/app/layout";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Home,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <RootLayout>
        <Story />
      </RootLayout>
    ),
  ],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
