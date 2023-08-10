"use client";

import { Icon } from "@/components";
import { useOgDeployer } from "@/hooks/useOgDeployer";
import Link from "next/link";
import {
  AdvancedSettingsModal,
  useAdvancedSettingsModal,
} from "./AdvancedSettingsModal";

export function OsnapCard() {
  const ogDeployerProps = useOgDeployer();
  const advancedSettingsModalProps = useAdvancedSettingsModal(ogDeployerProps);
  const spaceName = ogDeployerProps.config.snapshotSpaceName;
  const spaceUrl = ogDeployerProps.config.snapshotSpaceUrl;
  const activationStatus = ogDeployerProps.config.osnapActivationStatus;
  const errors = ogDeployerProps.config.errors;
  const hasSpace = !!spaceName && !!spaceUrl;

  const noSpaceCardContent = (
    <div className="border-b border-gray-200 px-6 py-5 text-gray-600">
      <h2 className="mb-2 text-lg font-semibold text-black">
        Connect to Snapshot Space
      </h2>
      <p className="mb-2">
        Before proceeding with the oSnap activation, please connect to a Space
        on the Snapshot website.
      </p>
      <p>
        Read more about the full setup process{" "}
        <Link href="todo" className="text-primary-500 hover:underline">
          here.
        </Link>
      </p>
    </div>
  );

  const hasSpaceCardContent = (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
      <p className="justify-self-start font-semibold">{spaceName}</p>
      <div className="flex gap-4">
        <ActiveIndicator status={activationStatus} />{" "}
        <button
          onClick={showAdvancedSettingsModal}
          aria-label="Show advanced settings"
        >
          <Icon name="settings" className="h-5 w-5" />
        </button>
      </div>
      <AdvancedSettingsModal {...advancedSettingsModalProps} />
    </div>
  );

  const cardContent = hasSpace ? hasSpaceCardContent : noSpaceCardContent;

  const inactiveButtonStyles = "bg-gray-950 text-white";
  const activeButtonStyles = "bg-gray-200 text-gray-700 border border-gray-200";
  const buttonStyles =
    activationStatus === "active" ? activeButtonStyles : inactiveButtonStyles;

  function showAdvancedSettingsModal() {
    advancedSettingsModalProps.showModal();
  }

  function activateOsnap() {
    alert("activate oSnap\n\nsee console for config results");
    console.log(ogDeployerProps.config);
  }

  function deactivateOsnap() {
    alert("deactivate oSnap");
  }

  return (
    <div className="max-w-[560px] rounded-[32px] bg-white p-12">
      <Icon name="osnap-logo" className="mx-auto mb-5 h-[60px] w-[153px]" />
      <h1 className="mb-10 text-center text-xl text-gray-600">
        Propel your DAO into the future with instant, secure and trustless
        execution.
      </h1>
      <div className="rounded-xl border border-gray-200">
        {cardContent}
        <div className="rounded-b-xl bg-gray-50 px-6 py-4">
          <CardLink
            href={
              hasSpace && spaceUrl ? spaceUrl : "https://snapshot.org/spaces"
            }
          />
        </div>
      </div>
      {hasSpace && (
        <button
          onClick={
            activationStatus === "active" ? deactivateOsnap : activateOsnap
          }
          className={`mb-3 mt-6 w-full  rounded-lg px-5 py-3 font-semibold shadow-[0px_1px_2px_0px_rgba(50,50,50,0.05)] ${buttonStyles}`}
        >
          {activationStatus === "active" ? "Deactivate" : "Activate"} oSnap
        </button>
      )}
      <div>
        {errors.map((error) => (
          <p key={error} className="text-center text-error-500">
            {error}
          </p>
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
      {props.href} <Icon name="external-link" className="h-5 w-5 text-black" />
    </Link>
  );
}

function ActiveIndicator(props: { status: "active" | "inactive" }) {
  const activeStyles = "bg-success-50 border-success-200 text-success-700";
  const inactiveStyles = "bg-gray-50 border-gray-200 text-gray-700";
  const styles = props.status === "active" ? activeStyles : inactiveStyles;
  return (
    <div
      className={`flex w-fit items-center justify-center gap-2 rounded-full border px-4 py-1 ${styles}`}
    >
      <div
        className={`h-2 w-2 rounded-full ${
          props.status === "active" ? "bg-success-500" : "bg-gray-500"
        }`}
      />
      oSnap {props.status}
    </div>
  );
}
