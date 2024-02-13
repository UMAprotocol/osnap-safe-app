"use client";
import { useConnect, useConnectors } from "wagmi";
import React, { useEffect } from "react";

const AUTOCONNECTED_CONNECTOR_IDS = ["safe"];

// this is ripped from https://github.com/safe-global/safe-apps-sdk/blob/main/examples/wagmi/src/useAutoConnect.ts
function useSafeAutoConnect() {
  const { connect } = useConnect();
  const connectors = useConnectors();

  async function findAuthorizedConnector() {
    for (const connector of AUTOCONNECTED_CONNECTOR_IDS) {
      const connectorInstance = connectors.find(
        (c) => c.id === connector, // "ready" no longer property on Connector
      );
      if (!connectorInstance) {
        break;
      }
      const canConnect = await connectorInstance.isAuthorized();
      if (canConnect) {
        connect({ connector: connectorInstance });
      }
    }
  }

  useEffect(() => {
    void findAuthorizedConnector();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect, connectors]);
}

// Small wrapper function to add a pass through to the providers
function SafeAutoConnect({ children }: { children: React.ReactNode }) {
  useSafeAutoConnect();
  return children;
}

export { useSafeAutoConnect, SafeAutoConnect };
