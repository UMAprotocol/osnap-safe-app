"use client";
import { useConnect } from "wagmi";
import React, { useEffect } from "react";

const AUTOCONNECTED_CONNECTOR_IDS = ["safe"];

// this is ripped from https://github.com/safe-global/safe-apps-sdk/blob/main/examples/wagmi/src/useAutoConnect.ts
function useSafeAutoConnect() {
  const { connect, connectors } = useConnect();

  useEffect(() => {
    AUTOCONNECTED_CONNECTOR_IDS.forEach((connector) => {
      const connectorInstance = connectors.find(
        (c) => c.id === connector && c.ready,
      );

      if (connectorInstance) {
        connect({ connector: connectorInstance });
      }
    });
  }, [connect, connectors]);
}

// Small wrapper function to add a pass through to the providers
function SafeAutoConnect({ children }: { children: React.ReactNode }) {
  useSafeAutoConnect();
  return children;
}

export { useSafeAutoConnect, SafeAutoConnect };
