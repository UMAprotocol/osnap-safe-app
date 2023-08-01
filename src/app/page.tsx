import { Icon } from "@/components/Icon";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Page() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: 12,
      }}
    >
      <ConnectButton />
      <Icon name="osnap-logo" />
    </div>
  );
}

export default Page;
