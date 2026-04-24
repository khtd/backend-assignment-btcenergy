import type {
  BitcoinBlockSummary,
  BitcoinBlockWithTransactions,
  BlockHash,
  WalletAddress,
  BitcoinTransaction,
} from '../domain/bitcoin.types';
import type { BitcoinDataProvider } from './bitcoin-data-provider';
import type {
  BlockchainInfoBlocksResponseDto,
  BlockchainInfoRawAddressDto,
  BlockchainInfoRawBlockDto,
} from './blockchain-info.types';
import { BlockchainInfoNormalizer } from './blockchain-info.normalizer';
import { fetchJson } from '../../../shared/http/fetch-json';

export class BlockchainInfoDataProvider implements BitcoinDataProvider {
  constructor(
    private readonly baseUrl = 'https://blockchain.info',
    private readonly normalizer = new BlockchainInfoNormalizer(),
  ) {}

  async getBlock(hash: BlockHash): Promise<BitcoinBlockWithTransactions> {
    const dto = await fetchJson<BlockchainInfoRawBlockDto>(
      `${this.baseUrl}/rawblock/${hash}`,
    );

    return this.normalizer.normalizeBlock(dto);
  }

  async getBlocksByDate(date: Date): Promise<BitcoinBlockSummary[]> {
    const timestampMs = date.getTime();

    const dto = await fetchJson<BlockchainInfoBlocksResponseDto>(
      `${this.baseUrl}/blocks/${timestampMs}?format=json`,
    );

    return dto.map((block) => this.normalizer.normalizeBlockSummary(block));
  }

  async getWalletTransactions(address: WalletAddress): Promise<BitcoinTransaction[]> {
    const dto = await fetchJson<BlockchainInfoRawAddressDto>(
      `${this.baseUrl}/rawaddr/${address}`,
    );

    return this.normalizer.normalizeAddressTransactions(dto);
  }
}