import type { EnergyRepository } from './energy.repository';
import type { BlockHash, WalletAddress } from '../domain/bitcoin.types';
import type { BlockEnergy, DailyEnergy, WalletEnergy } from '../domain/energy.types';

export class InMemoryEnergyRepository implements EnergyRepository {
  private readonly blockEnergyByHash = new Map<BlockHash, BlockEnergy>();
  private readonly dailyEnergyByDate = new Map<string, DailyEnergy>();
  private readonly walletEnergyByAddress = new Map<WalletAddress, WalletEnergy>();

  async findBlockEnergy(blockHash: BlockHash): Promise<BlockEnergy | null> {
    return this.blockEnergyByHash.get(blockHash) ?? null;
  }

  async saveBlockEnergy(blockEnergy: BlockEnergy): Promise<void> {
    this.blockEnergyByHash.set(blockEnergy.blockHash, blockEnergy);
  }

  async findDailyEnergy(date: string): Promise<DailyEnergy | null> {
    return this.dailyEnergyByDate.get(date) ?? null;
  }

  async saveDailyEnergy(dailyEnergy: DailyEnergy): Promise<void> {
    this.dailyEnergyByDate.set(dailyEnergy.date, dailyEnergy);
  }

  async findWalletEnergy(address: WalletAddress): Promise<WalletEnergy | null> {
    return this.walletEnergyByAddress.get(address) ?? null;
  }

  async saveWalletEnergy(walletEnergy: WalletEnergy): Promise<void> {
    this.walletEnergyByAddress.set(walletEnergy.address, walletEnergy);
  }
}