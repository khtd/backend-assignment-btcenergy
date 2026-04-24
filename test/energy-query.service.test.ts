import type { BitcoinDataProvider } from '../src/modules/bitcoin/ingestion/bitcoin-data-provider';
import { BitcoinIngestionService } from '../src/modules/bitcoin/services/bitcoin-data.service';
import { EnergyQueryService } from '../src/modules/bitcoin/services/energy-query.service';
import { InMemoryBitcoinRepository } from '../src/modules/bitcoin/repositories/in-memory-bitcoin.repository';
import { InMemoryEnergyRepository } from '../src/modules/bitcoin/repositories/in-memory-energy.repository';
import { EnergyCalculator } from '../src/modules/bitcoin/projectors/energy-calculator';
import { BlockEnergyProjector } from '../src/modules/bitcoin/projectors/block-energy.projector';
import { DailyEnergyProjector } from '../src/modules/bitcoin/projectors/daily-energy.projector';
import { WalletEnergyProjector } from '../src/modules/bitcoin/projectors/wallet-energy.projector';
import { describe, expect, it, vi, assert } from 'vitest'

describe('EnergyQueryService', () => {
  it('returns block energy and ingests block only once', async () => {
    const provider: BitcoinDataProvider = {
      getBlock: vi.fn().mockResolvedValue({
        hash: 'block-1',
        height: 123,
        timestamp: new Date('2026-04-24T00:00:00.000Z'),
        transactions: [
          {
            hash: 'tx-1',
            blockHash: 'block-1',
            sizeBytes: 100,
          },
        ],
      }),
      getBlocksByDate: vi.fn(),
      getWalletTransactions: vi.fn(),
    };

    const service = createService(provider);

    const first = await service.getBlockEnergy('block-1');
    const second = await service.getBlockEnergy('block-1');

    expect(first.totalEnergyKwh).toBeCloseTo (456);
    expect(second.totalEnergyKwh).toBeCloseTo (456);
    expect(provider.getBlock).toHaveBeenCalledTimes(1);
  });

  it('aggregates daily energy', async () => {
    const provider: BitcoinDataProvider = {
      getBlock: vi
        .fn()
        .mockResolvedValueOnce({
          hash: 'block-1',
          height: 1,
          timestamp: new Date('2026-04-24T01:00:00.000Z'),
          transactions: [
            {
              hash: 'tx-1',
              blockHash: 'block-1',
              sizeBytes: 100,
            },
          ],
        })
        .mockResolvedValueOnce({
          hash: 'block-2',
          height: 2,
          timestamp: new Date('2026-04-24T02:00:00.000Z'),
          transactions: [
            {
              hash: 'tx-2',
              blockHash: 'block-2',
              sizeBytes: 200,
            },
          ],
        }),

      getBlocksByDate: vi.fn().mockResolvedValue([
        {
          hash: 'block-1',
          height: 1,
          timestamp: new Date('2026-04-24T01:00:00.000Z'),
        },
        {
          hash: 'block-2',
          height: 2,
          timestamp: new Date('2026-04-24T02:00:00.000Z'),
        },
      ]),

      getWalletTransactions: vi.fn(),
    };

    const service = createService(provider);

    const result = await service.getDailyEnergy(
      1,
      new Date('2026-04-24T12:00:00.000Z'),
    );

    expect(result).toEqual([
      {
        date: '2026-04-24',
        blockCount: 2,
        transactionCount: 2,
        totalSizeBytes: 300,
        totalEnergyKwh: expect.closeTo(1368),
      },
    ]);

    expect(provider.getBlocksByDate).toHaveBeenCalledTimes(1);
    expect(provider.getBlock).toHaveBeenCalledTimes(2);
  });

  it('aggregates wallet energy', async () => {
    const provider: BitcoinDataProvider = {
      getBlock: vi.fn(),
      getBlocksByDate: vi.fn(),
      getWalletTransactions: vi.fn().mockResolvedValue([
        {
          hash: 'tx-1',
          blockHash: '',
          sizeBytes: 100,
        },
        {
          hash: 'tx-2',
          blockHash: '',
          sizeBytes: 50,
        },
      ]),
    };

    const service = createService(provider);

    const result = await service.getWalletEnergy('wallet-1');

    expect(result).toEqual({
      address: 'wallet-1',
      transactionCount: 2,
      totalSizeBytes: 150,
      totalEnergyKwh: expect.closeTo(684),
    });

    expect(provider.getWalletTransactions).toHaveBeenCalledTimes(1);
  });

  it('does not fetch the same block twice', async () => {
    let providerCalls = 0;

    const provider = {
      getBlock: async () => {
        providerCalls++;

        return {
          hash: 'block-1',
          height: 1,
          timestamp: new Date('2026-04-24T00:00:00.000Z'),
          transactions: [
            { hash: 'tx-1', blockHash: 'block-1', sizeBytes: 100 },
          ],
        };
      },
      getBlocksByDate: async () => [],
      getWalletTransactions: async () => [],
    };

    const service = createService(provider);

    await service.getBlockEnergy('block-1');
    await service.getBlockEnergy('block-1');

    assert.equal(providerCalls, 1);
  });
});

function createService(provider: BitcoinDataProvider): EnergyQueryService {
  const bitcoinRepository = new InMemoryBitcoinRepository();
  const energyRepository = new InMemoryEnergyRepository();

  const calculator = new EnergyCalculator(4.56);

  const ingestionService = new BitcoinIngestionService(provider, bitcoinRepository);

  return new EnergyQueryService(
    ingestionService,
    energyRepository,
    new BlockEnergyProjector(calculator),
    new DailyEnergyProjector(),
    new WalletEnergyProjector(calculator),
  );
}