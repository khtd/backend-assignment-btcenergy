export type BlockHash = string;
export type TransactionHash = string;
export type WalletAddress = string;

export type BitcoinBlock = {
  hash: BlockHash;
  height: number;
  timestamp: Date;
};

export type BitcoinTransaction = {
  hash: TransactionHash;
  blockHash: BlockHash;
  sizeBytes: number;
};

export type BitcoinBlockWithTransactions = BitcoinBlock & {
  transactions: BitcoinTransaction[];
};

export type BitcoinBlockSummary = {
  hash: BlockHash;
  height: number;
  timestamp: Date;
};