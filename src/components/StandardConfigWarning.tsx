import { useIsStandardConfig } from "@/hooks/OptimisticGovernor";

type Props = {
  isStandard: boolean;
};

export const StandardConfigFormWarning = ({ isStandard }: Props) => {
  if (isStandard) {
    return (
      <div className="mb-6 rounded-lg  border bg-success-50 px-3 py-2 text-sm text-success-700">
        <p>
          Warning! You are using the default settings. If your proposal passes,
          your transaction will be <strong>automatically executed</strong> and
          verified by the UMA Optimistic Oracle.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg  border bg-warning-50 px-3 py-2 text-sm text-warning-700">
      <p>
        Warning! You are <strong>not</strong> using the default settings. If
        your proposal passes, you will be required to <strong>manually</strong>{" "}
        request transaction execution and post a bond to the UMA Optimistic
        Oracle for verification.
      </p>
    </div>
  );
};

export const StandardConfigCardWarning = ({
  configState,
}: {
  configState: ReturnType<typeof useIsStandardConfig>;
}) => {
  if (!configState) {
    return;
  }

  if (configState.automaticExecution) {
    return <StandardConfigFormWarning isStandard />;
  }

  return (
    <div className="mb-6 flex flex-col gap-2 rounded-lg  border bg-warning-50 px-3 py-2 text-sm text-warning-700">
      <p>
        Warning! You are <strong>not</strong> using the default settings. If
        your proposal passes, you will be required to <strong>manually</strong>{" "}
        request transaction execution and post a bond to the UMA Optimistic
        Oracle for verification.
      </p>
      <p>
        Settings that are <strong>Non standard:</strong>{" "}
      </p>
      <ul className="pl-4 [&>li]:list-disc">
        {!configState.bondAmount && <li>Bond Amount (Should be 2)</li>}
        {!configState.bondToken && <li>Bond Token (Should be WETH)</li>}
        {!configState.rules && (
          <li>
            Space URL (only snapshot.org <strong>production</strong> spaces are
            supported with automated execution. There is no bot support for
            testnets.)
          </li>
        )}
      </ul>
    </div>
  );
};
