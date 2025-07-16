import { z } from "zod";
import { HttpError } from "./errors";
import networks from "@snapshot-labs/snapshot.js/src/networks.json";

// VALIDATORS
export const ethereumAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
export const snapshotSupportedNetwork = z.keyof(z.object(networks));
export const asset = z.object({
  name: z.string(),
  address: z.union([z.literal("main"), ethereumAddress]), //
  logoUri: z.optional(z.url()),
  imageUri: z.optional(z.url()),
});

export const token = z.object({
  ...asset.shape,
  symbol: z.string(),
  decimals: z.int(),
  balance: z.optional(z.string()),
  verified: z.optional(z.boolean()),
  chainId: z.optional(snapshotSupportedNetwork),
});

export const nft = z.object({
  ...asset.shape,
  id: z.string(),
  tokenName: z.optional(z.string()),
});

export const ogTransaction = z.tuple([
  z.string(), // to
  z.literal(0), // operation
  z.string(), // value
  z.string(), // data
]);
export const baseTransaction = z.object({
  to: z.string(),
  value: z.string(),
  data: z.string(),
  formatted: ogTransaction,
});

export const rawTransaction = z.object({
  ...baseTransaction.shape,
  type: z.literal("raw"),
});
export const contractInteractionTransaction = z.object({
  ...baseTransaction.shape,
  type: z.literal("contractInteraction"),
  abi: z.optional(z.string()),
  methodName: z.optional(z.string()),
  parameters: z.optional(z.array(z.string())),
});
export const transferNftTransaction = z.object({
  ...baseTransaction.shape,
  type: z.literal("transferNFT"),
  recipient: z.optional(z.string()),
  collectable: z.optional(nft),
});

export const transferFundsTransaction = z.object({
  ...baseTransaction.shape,
  type: z.literal("transferFunds"),
  amount: z.optional(z.string()),
  recipient: z.optional(z.string()),
  token: z.optional(token),
});
export const supportedOsnapTransaction = z.union([
  rawTransaction,
  contractInteractionTransaction,
  transferNftTransaction,
  transferFundsTransaction,
]);

export const gnosisSafe = z.object({
  safeName: z.string(),
  safeAddress: ethereumAddress,
  network: snapshotSupportedNetwork,
  moduleAddress: ethereumAddress,
  transactions: z.array(supportedOsnapTransaction),
});

// HELPERS
export function validateApiRequest<T extends z.ZodSchema>(
  schema: T,
  value: unknown, // req.nextUrl.searchParams || req.body
): z.infer<T> {
  try {
    console.log("DATA RECEIVED", value);
    return schema.parse(value);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");

      throw new HttpError({
        statusCode: 400,
        msg: `Invalid query parameters: ${issues}`,
      });
    }

    // Fallback for unexpected errors
    throw new HttpError({
      statusCode: 500,
      msg: "Query parameter validation failed",
    });
  }
}
