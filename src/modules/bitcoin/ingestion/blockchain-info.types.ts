export type BlockchainInfoBlockSummaryDto = {
  hash: string;
  height: number;
  time: number;
};

export type BlockchainInfoBlocksResponseDto =  BlockchainInfoBlockSummaryDto[];

export type BlockchainInfoTransactionDto = {
  hash: string;
  size: number;
};

export type BlockchainInfoRawBlockDto = {
  hash: string;
  height: number;
  time: number;
  tx: BlockchainInfoTransactionDto[];
};

export type BlockchainInfoRawAddressDto = {
  address: string;
  txs: BlockchainInfoTransactionDto[];
};