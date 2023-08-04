import Link from "next/link";
import { Icon } from ".";

type Props = {
  safeName: string;
  safeUrl: string;
  status: "active" | "inactive";
  errors: string[];
};

export function OsnapCard(props: Props) {
  function showAdvancedSettingsModal() {
    alert("advanced settings modal to be implemented");
  }

  function activateOsnap() {
    alert("activate oSnap");
  }

  function deactivateOsnap() {
    alert("deactivate oSnap");
  }

  const inactiveButtonStyles = "bg-gray-950 text-white";
  const activeButtonStyles = "bg-gray-200 text-gray-700 border border-gray-200";
  const buttonStyles =
    props.status === "active" ? activeButtonStyles : inactiveButtonStyles;

  return (
    <div className="max-w-[560px] p-12 rounded-[32px] bg-white">
      <Icon name="osnap-logo" className="w-[153px] h-[60px] mb-5 mx-auto" />
      <h1 className="text-xl text-gray-600 text-center mb-10">
        Propel your DAO into the future with instant, secure and trustless
        execution.
      </h1>
      <div className="mb-6 border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <p className="justify-self-start font-semibold">{props.safeName}</p>
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
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <Link
            href={props.safeUrl}
            target="_blank"
            className="flex justify-between text-gray-600"
          >
            {props.safeUrl}{" "}
            <Icon name="external-link" className="w-5 h-5 text-black" />
          </Link>
        </div>
      </div>
      <button
        onClick={props.status === "active" ? deactivateOsnap : activateOsnap}
        className={`mb-3 font-semibold  w-full py-3 px-5 rounded-lg shadow-[0px_1px_2px_0px_rgba(50,50,50,0.05)] ${buttonStyles}`}
      >
        {props.status === "active" ? "Deactivate" : "Activate"} oSnap
      </button>
      <div>
        {props.errors.map((error) => (
          <p className="text-error-500 text-center">{error}</p>
        ))}
      </div>
    </div>
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
