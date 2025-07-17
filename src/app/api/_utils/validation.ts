import { z } from "zod";
import { HttpError } from "./errors";
import networks from "@snapshot-labs/snapshot.js/src/networks.json";

// VALIDATORS
export const ethereumAddress = z
  .string()
  .regex(
    /^0x[a-fA-F0-9]{40}$/,
    "Invalid Ethereum address. Must be a 0x-prefixed 20 byte hex string",
  );
export const snapshotSupportedNetwork = z.keyof(z.object(networks));
export const osnapTransactionType = z.union([
  z.literal("raw"),
  z.literal("transferNFT"),
  z.literal("contractInteraction"),
  z.literal("transferFunds"),
]);
export const asset = z.object({
  name: z.string(),
  address: z.union([z.literal("main"), ethereumAddress]),
  logoUri: z.optional(z.url()),
  imageUri: z.optional(z.url()),
});

export const token = asset.extend({
  symbol: z.string(),
  decimals: z.int(),
  balance: z.optional(z.string()),
  verified: z.optional(z.boolean()),
  chainId: z.optional(snapshotSupportedNetwork),
});

export const nft = asset.extend({
  id: z.string(),
  tokenName: z.optional(z.string()),
});

export const ogTransaction = z.tuple([
  z.string({ error: "Transaction 'to' address is required" }), // to
  z.literal(0, { message: "Operation must be 0" }), // operation
  z.string({ error: "Transaction 'value' is required" }), // value
  z.string({ error: "Transaction 'data' is required" }), // data
]);
export const baseTransaction = z.object({
  to: z.string("Transaction 'to' address is required"),
  value: z.string("Transaction 'value' is required"),
  data: z.string("Transaction 'data' is required"),
  formatted: ogTransaction,
});

export const rawTransaction = baseTransaction.extend({
  type: osnapTransactionType,
});
export const contractInteractionTransaction = baseTransaction.extend({
  type: osnapTransactionType,
  abi: z.optional(z.string()),
  methodName: z.optional(z.string()),
  parameters: z.optional(z.array(z.string())),
});
export const transferNftTransaction = baseTransaction.extend({
  type: osnapTransactionType,
  recipient: z.optional(z.string()),
  collectable: z.optional(nft),
});

export const transferFundsTransaction = baseTransaction.extend({
  type: osnapTransactionType,
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
  transactions: z.array(supportedOsnapTransaction).min(1),
});

// HELPERS
export function validateApiRequest<T extends z.ZodSchema>(
  schema: T,
  value: unknown,
): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(z.prettifyError(error));
      const issues = error.issues
        .map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join(".") : "root";
          return `${path}: ${issue.message}`;
        })
        .join("; ");

      throw new HttpError({
        statusCode: 400,
        msg: `Invalid Request: ${issues}`,
      });
    }

    // Fallback for unexpected errors
    throw new HttpError({
      statusCode: 500,
      msg: "Query parameter validation failed",
    });
  }
}
