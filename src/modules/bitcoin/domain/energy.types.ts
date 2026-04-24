import type { BlockHash, TransactionHash, WalletAddress } from './bitcoin.types';

export type TransactionEnergy = {
  transactionHash: TransactionHash;
  blockHash: BlockHash;
  sizeBytes: number;
  energyKwh: number;
};

export type BlockEnergy = {
  blockHash: BlockHash;
  blockHeight: number;
  timestamp: Date;
  transactionCount: number;
  totalSizeBytes: number;
  totalEnergyKwh: number;
  transactions: TransactionEnergy[];
};

export type DailyEnergy = {
  date: string;
  blockCount: number;
  transactionCount: number;
  totalSizeBytes: number;
  totalEnergyKwh: number;
};

export type WalletEnergy = {
  address: WalletAddress;
  transactionCount: number;
  totalSizeBytes: number;
  totalEnergyKwh: number;
};