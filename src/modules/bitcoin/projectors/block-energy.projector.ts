import type { BitcoinBlockWithTransactions } from '../domain/bitcoin.types';
import type { BlockEnergy, TransactionEnergy } from '../domain/energy.types';
import { EnergyCalculator } from './energy-calculator';

export class BlockEnergyProjector {
  constructor(private readonly energyCalculator: EnergyCalculator) {}

  project(block: BitcoinBlockWithTransactions): BlockEnergy {
    const transactions: TransactionEnergy[] = block.transactions.map((tx) => ({
      transactionHash: tx.hash,
      blockHash: tx.blockHash,
      sizeBytes: tx.sizeBytes,
      energyKwh: this.energyCalculator.calculateForBytes(tx.sizeBytes),
    }));

    const totalSizeBytes = transactions.reduce((sum, tx) => sum + tx.sizeBytes, 0);
    const totalEnergyKwh = transactions.reduce((sum, tx) => sum + tx.energyKwh, 0);

    return {
      blockHash: block.hash,
      blockHeight: block.height,
      timestamp: block.timestamp,
      transactionCount: transactions.length,
      totalSizeBytes,
      totalEnergyKwh,
      transactions,
    };
  }
}