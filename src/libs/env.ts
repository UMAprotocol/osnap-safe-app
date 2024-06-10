export const studioApiKey = (() => {
  const studioApiKey = process.env.NEXT_PUBLIC_STUDIO_API_KEY;
  if (studioApiKey === undefined)
    throw new Error("Subgraph Studio API key missing!");
  return studioApiKey;
})();
