import { ENERGY_KWH_PER_BYTE } from './bitcoin.constants';
import { BitcoinIngestionService } from './services/bitcoin-data.service';
import { EnergyQueryService } from './services/energy-query.service';
import { BlockchainInfoDataProvider } from './ingestion/blockchain-info.data-provider';
import { InMemoryBitcoinRepository } from './repositories/in-memory-bitcoin.repository';
import { InMemoryEnergyRepository } from './repositories/in-memory-energy.repository';
import { EnergyCalculator } from './projectors/energy-calculator';
import { BlockEnergyProjector } from './projectors/block-energy.projector';
import { DailyEnergyProjector } from './projectors/daily-energy.projector';
import { WalletEnergyProjector } from './projectors/wallet-energy.projector';

export function createBitcoinModule() {
  const bitcoinRepository = new InMemoryBitcoinRepository();
  const energyRepository = new InMemoryEnergyRepository();

  const bitcoinDataProvider = new BlockchainInfoDataProvider();

  const energyCalculator = new EnergyCalculator(ENERGY_KWH_PER_BYTE);
  const blockEnergyProjector = new BlockEnergyProjector(energyCalculator);
  const dailyEnergyProjector = new DailyEnergyProjector();
  const walletEnergyProjector = new WalletEnergyProjector(energyCalculator);

  const ingestionService = new BitcoinIngestionService(bitcoinDataProvider, bitcoinRepository);

  const energyQueryService = new EnergyQueryService(
    ingestionService,
    energyRepository,
    blockEnergyProjector,
    dailyEnergyProjector,
    walletEnergyProjector,
  );

  return {
    energyQueryService,
  };
}