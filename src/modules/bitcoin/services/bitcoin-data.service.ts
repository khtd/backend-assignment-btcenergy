import type {
  BitcoinBlockSummary,
  BitcoinBlockWithTransactions,
  BitcoinTransaction,
  BlockHash,
  WalletAddress,
} from '../domain/bitcoin.types';
import type { BitcoinDataProvider } from '../ingestion/bitcoin-data-provider';
import type { BitcoinRepository } from '../repositories/bitcoin.repository';

export class BitcoinIngestionService {
  constructor(
    private readonly bitcoinDataProvider: BitcoinDataProvider,
    private readonly repository: BitcoinRepository,
  ) {}

  async getOrIngestBlock(hash: BlockHash): Promise<BitcoinBlockWithTransactions> {
    const existing = await this.repository.findBlockByHash(hash);

    if (existing) {
      return existing;
    }

    const block = await this.bitcoinDataProvider.getBlock(hash);

    await this.repository.saveBlock(block);

    return block;
  }

  async getOrIngestBlocksByDate(date: Date): Promise<BitcoinBlockSummary[]> {
    const dateKey = toDateKey(date);

    const existing = await this.repository.findBlocksByDate(dateKey);

    if (existing.length > 0) {
      return existing;
    }

    const blocks = await this.bitcoinDataProvider.getBlocksByDate(date);

    await this.repository.saveBlocksForDate(dateKey, blocks);

    return blocks;
  }

  async getOrIngestWalletTransactions(
    address: WalletAddress,
  ): Promise<BitcoinTransaction[]> {
    const existing = await this.repository.findTransactionsByWallet(address);

    if (existing) {
      return existing;
    }

    const transactions = await this.bitcoinDataProvider.getWalletTransactions(address);

    await this.repository.saveTransactionsForWallet(address, transactions);

    return transactions;
  }
}

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}