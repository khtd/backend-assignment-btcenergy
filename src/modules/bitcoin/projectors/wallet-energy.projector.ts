import type { BitcoinTransaction, WalletAddress } from '../domain/bitcoin.types';
import type { WalletEnergy } from '../domain/energy.types';
import { EnergyCalculator } from './energy-calculator';

export class WalletEnergyProjector {
  constructor(private readonly energyCalculator: EnergyCalculator) {}

  aggregate(address: WalletAddress, transactions: BitcoinTransaction[]): WalletEnergy {
    const totalSizeBytes = transactions.reduce((sum, tx) => sum + tx.sizeBytes, 0);

    return {
      address,
      transactionCount: transactions.length,
      totalSizeBytes,
      totalEnergyKwh: this.energyCalculator.calculateForBytes(totalSizeBytes),
    };
  }
}