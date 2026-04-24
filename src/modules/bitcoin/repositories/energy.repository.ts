import type { BlockHash, WalletAddress } from '../domain/bitcoin.types';
import type { BlockEnergy, DailyEnergy, WalletEnergy } from '../domain/energy.types';

export interface EnergyRepository {
  findBlockEnergy(blockHash: BlockHash): Promise<BlockEnergy | null>;

  saveBlockEnergy(blockEnergy: BlockEnergy): Promise<void>;

  findDailyEnergy(date: string): Promise<DailyEnergy | null>;

  saveDailyEnergy(dailyEnergy: DailyEnergy): Promise<void>;

  findWalletEnergy(address: WalletAddress): Promise<WalletEnergy | null>;

  saveWalletEnergy(walletEnergy: WalletEnergy): Promise<void>;
}