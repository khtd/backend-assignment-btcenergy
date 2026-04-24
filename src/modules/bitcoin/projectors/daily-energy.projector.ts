import type { DailyEnergy } from '../domain/energy.types';
import type { BlockEnergy } from '../domain/energy.types';

export class DailyEnergyProjector {
  aggregate(date: string, blocks: BlockEnergy[]): DailyEnergy {
    return {
      date,
      blockCount: blocks.length,
      transactionCount: blocks.reduce((sum, block) => sum + block.transactionCount, 0),
      totalSizeBytes: blocks.reduce((sum, block) => sum + block.totalSizeBytes, 0),
      totalEnergyKwh: blocks.reduce((sum, block) => sum + block.totalEnergyKwh, 0),
    };
  }
}