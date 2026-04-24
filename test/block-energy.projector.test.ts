import { EnergyCalculator } from '../src/modules/bitcoin/projectors/energy-calculator';
import { BlockEnergyProjector } from '../src/modules/bitcoin/projectors/block-energy.projector';
import { describe, expect, it } from 'vitest'

describe('BlockEnergyProjector', () => {
  it('projects block transactions into energy data', () => {
    const projector = new BlockEnergyProjector(new EnergyCalculator(4.56));

    const result = projector.project({
      hash: 'block-1',
      height: 123,
      timestamp: new Date('2026-04-24T00:00:00.000Z'),
      transactions: [
        {
          hash: 'tx-1',
          blockHash: 'block-1',
          sizeBytes: 100,
        },
        {
          hash: 'tx-2',
          blockHash: 'block-1',
          sizeBytes: 200,
        },
      ],
    });

    expect(result).toEqual({
      blockHash: 'block-1',
      blockHeight: 123,
      timestamp: new Date('2026-04-24T00:00:00.000Z'),
      transactionCount: 2,
      totalSizeBytes: 300,
      totalEnergyKwh: expect.closeTo(1368),
      transactions: [
        {
          transactionHash: 'tx-1',
          blockHash: 'block-1',
          sizeBytes: 100,
          energyKwh: expect.closeTo(456),
        },
        {
          transactionHash: 'tx-2',
          blockHash: 'block-1',
          sizeBytes: 200,
          energyKwh: expect.closeTo(912),
        },
      ],
    });
  });
});