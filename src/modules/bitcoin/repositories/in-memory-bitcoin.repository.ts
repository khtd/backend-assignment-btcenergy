import type { BitcoinRepository } from './bitcoin.repository';
import type {
  BitcoinBlockSummary,
  BitcoinBlockWithTransactions,
  BitcoinTransaction,
  BlockHash,
  WalletAddress,
} from '../domain/bitcoin.types';

export class InMemoryBitcoinRepository implements BitcoinRepository {
  private readonly blocksByHash = new Map<BlockHash, BitcoinBlockWithTransactions>();
  private readonly blocksByDate = new Map<string, BitcoinBlockSummary[]>();
  private readonly transactionsByWallet = new Map<WalletAddress, BitcoinTransaction[]>();

  async findBlockByHash(hash: BlockHash): Promise<BitcoinBlockWithTransactions | null> {
    return this.blocksByHash.get(hash) ?? null;
  }

  async saveBlock(block: BitcoinBlockWithTransactions): Promise<void> {
    this.blocksByHash.set(block.hash, block);
  }

  async findBlocksByDate(date: string): Promise<BitcoinBlockSummary[]> {
    return this.blocksByDate.get(date) ?? [];
  }

  async saveBlocksForDate(date: string, blocks: BitcoinBlockSummary[]): Promise<void> {
    this.blocksByDate.set(date, blocks);
  }

  async findTransactionsByWallet(address: WalletAddress): Promise<BitcoinTransaction[] | null> {
    return this.transactionsByWallet.get(address) ?? null;
  }

  async saveTransactionsForWallet(
    address: WalletAddress,
    transactions: BitcoinTransaction[],
  ): Promise<void> {
    this.transactionsByWallet.set(address, transactions);
  }
}