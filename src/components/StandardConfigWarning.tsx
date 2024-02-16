type Props = {
  isStandard: boolean;
};

export const StandardConfigWarning = ({ isStandard }: Props) => {
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
