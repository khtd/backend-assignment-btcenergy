import type { BlockHash, WalletAddress } from '../domain/bitcoin.types';
import type { BlockEnergy, DailyEnergy, WalletEnergy } from '../domain/energy.types';
import type { EnergyRepository } from '../repositories/energy.repository';
import { BitcoinIngestionService, toDateKey } from './bitcoin-data.service';
import { BlockEnergyProjector } from '../projectors/block-energy.projector';
import { DailyEnergyProjector } from '../projectors/daily-energy.projector';
import { WalletEnergyProjector } from '../projectors/wallet-energy.projector';
import { InvalidDaysError } from '../domain/bitcoin.errors';
import { mapWithConcurrency } from '../../../shared/async/map-with-concurrency';

const MAX_BLOCKS_PER_DAILY_QUERY = 10;

export class EnergyQueryService {
  constructor(
    private readonly ingestionService: BitcoinIngestionService,
    private readonly energyRepository: EnergyRepository,
    private readonly blockEnergyProjector: BlockEnergyProjector,
    private readonly DailyEnergyProjector: DailyEnergyProjector,
    private readonly WalletEnergyProjector: WalletEnergyProjector,
  ) {}

  async getBlockEnergy(blockHash: BlockHash): Promise<BlockEnergy> {
    const existing = await this.energyRepository.findBlockEnergy(blockHash);

    if (existing) {
      return existing;
    }

    // Future:
    // This method currently implements read-through ingestion (fetch on miss).
    // In a production setup, ingestion + projection should be handled asynchronously
    // (e.g. via background workers / queue), and this method would become read-only.
    const block = await this.ingestionService.getOrIngestBlock(blockHash);
    const blockEnergy = this.blockEnergyProjector.project(block);

    await this.energyRepository.saveBlockEnergy(blockEnergy);

    return blockEnergy;
  }

  async getDailyEnergy(days: number, now = new Date()): Promise<DailyEnergy[]> {
    if (!Number.isInteger(days) || days < 1 || days > 30) {
      throw new InvalidDaysError(days);
    }

    const dates = Array.from({ length: days }, (_, index) => {
      const date = new Date(now);
      date.setUTCDate(date.getUTCDate() - index);
      date.setUTCHours(0, 0, 0, 0);

      return date;
    });
 
    const result: DailyEnergy[] = [];

    for (const date of dates) {
      result.push(await this.getDailyEnergyForDate(date));
    }
    
    return result;
  }

  async getWalletEnergy(address: WalletAddress): Promise<WalletEnergy> {
    const existing = await this.energyRepository.findWalletEnergy(address);

    if (existing) {
      return existing;
    }

    // Future:
    // same as "getBlockEnergy'
    const transactions = await this.ingestionService.getOrIngestWalletTransactions(address);
    const walletEnergy = this.WalletEnergyProjector.aggregate(address, transactions);

    await this.energyRepository.saveWalletEnergy(walletEnergy);

    return walletEnergy;
  }

  // Future:
  // Daily aggregation is expensive because it requires loading all blocks for a day.
  // In production this should be precomputed asynchronously by background workers
  // and stored as a denormalized read model. GraphQL should only read the result.
  private async getDailyEnergyForDate(date: Date): Promise<DailyEnergy> {
    const dateKey = toDateKey(date);

    const existing = await this.energyRepository.findDailyEnergy(dateKey);

    if (existing) {
      return existing;
    }

    const blockSummaries = await this.ingestionService.getOrIngestBlocksByDate(date);

    // Assignment/demo guard:
    // Fetching every block for a day can easily hit public API rate limits.
    // Production should precompute this asynchronously.
    const limitedBlockSummaries = blockSummaries.slice(0, MAX_BLOCKS_PER_DAILY_QUERY);

    const blockEnergies = await mapWithConcurrency(
      blockSummaries,
      5,
      (block) => this.getBlockEnergy(block.hash),
    );

    const dailyEnergy = this.DailyEnergyProjector.aggregate(dateKey, blockEnergies);

    await this.energyRepository.saveDailyEnergy(dailyEnergy);

    return dailyEnergy;
  }
}