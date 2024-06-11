export const graphStudioApiKey = (() => {
  const graphStudioApiKey = process.env.NEXT_PUBLIC_GRAPH_STUDIO_API_KEY;
  if (graphStudioApiKey === undefined)
    throw new Error("Subgraph Studio API key missing!");
  return graphStudioApiKey;
})();
