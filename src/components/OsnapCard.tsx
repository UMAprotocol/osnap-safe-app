import Link from "next/link";
import { Icon } from ".";

type Props = {
  spaceName: string | undefined;
  spaceUrl: string | undefined;
  status: "active" | "inactive";
  errors: string[];
};

export function OsnapCard(props: Props) {
  const hasSpace = !!props.spaceName && !!props.spaceUrl;

  const noSpaceCardContent = (
    <div className="border-b border-gray-200 px-6 py-5 text-gray-600">
      <h2 className="font-semibold mb-2 text-lg text-black">
        Connect to Snapshot Space
      </h2>
      <p className="mb-2">
        Before proceeding with the oSnap activation, please connect to a Space
        on the Snapshot website.
      </p>
      <p>
        Read more about the full setup process <Link href="todo" className="text-primary-500 hover:underline">here.</Link>
      </p>
    </div>
  );

  const hasSpaceCardContent = (
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
      <p className="justify-self-start font-semibold">{props.spaceName}</p>
      <div className="flex gap-4">
        <ActiveIndicator status={props.status} />{" "}
        <button
          onClick={showAdvancedSettingsModal}
          aria-label="Show advanced settings"
        >
          <Icon name="settings" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const cardContent = hasSpace ? hasSpaceCardContent : noSpaceCardContent;

  const inactiveButtonStyles = "bg-gray-950 text-white";
  const activeButtonStyles = "bg-gray-200 text-gray-700 border border-gray-200";
  const buttonStyles =
    props.status === "active" ? activeButtonStyles : inactiveButtonStyles;

  function showAdvancedSettingsModal() {
    alert("advanced settings modal to be implemented");
  }

  function activateOsnap() {
    alert("activate oSnap");
  }

  function deactivateOsnap() {
    alert("deactivate oSnap");
  }

  return (
    <div className="max-w-[560px] p-12 rounded-[32px] bg-white">
      <Icon name="osnap-logo" className="w-[153px] h-[60px] mb-5 mx-auto" />
      <h1 className="text-xl text-gray-600 text-center mb-10">
        Propel your DAO into the future with instant, secure and trustless
        execution.
      </h1>
      <div className="border border-gray-200 rounded-xl">
        {cardContent}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <CardLink
            href={
              hasSpace && props.spaceUrl
                ? props.spaceUrl
                : "https://snapshot.org/spaces"
            }
          />
        </div>
      </div>
      {hasSpace && (
        <button
          onClick={props.status === "active" ? deactivateOsnap : activateOsnap}
          className={`mb-3 mt-6 font-semibold  w-full py-3 px-5 rounded-lg shadow-[0px_1px_2px_0px_rgba(50,50,50,0.05)] ${buttonStyles}`}
        >
          {props.status === "active" ? "Deactivate" : "Activate"} oSnap
        </button>
      )}
      <div>
        {props.errors.map((error) => (
          <p className="text-error-500 text-center">{error}</p>
        ))}
      </div>
    </div>
  );
}

function CardLink(props: { href: string }) {
  return (
    <Link
      href={props.href}
      target="_blank"
      className="flex justify-between text-gray-600"
    >
      {props.href} <Icon name="external-link" className="w-5 h-5 text-black" />
    </Link>
  );
}

function ActiveIndicator(props: { status: "active" | "inactive" }) {
  const activeStyles = "bg-success-50 border-success-200 text-success-700";
  const inactiveStyles = "bg-gray-50 border-gray-200 text-gray-700";
  const styles = props.status === "active" ? activeStyles : inactiveStyles;
  return (
    <div
      className={`flex items-center justify-center gap-2 px-4 py-1 w-fit border rounded-full ${styles}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          props.status === "active" ? "bg-success-500" : "bg-gray-500"
        }`}
      />
      oSnap {props.status}
    </div>
  );
}