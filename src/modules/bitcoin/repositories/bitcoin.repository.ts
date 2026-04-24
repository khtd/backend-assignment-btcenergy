import type {
  BitcoinBlockSummary,
  BitcoinBlockWithTransactions,
  BlockHash,
  WalletAddress,
  BitcoinTransaction,
} from '../domain/bitcoin.types';

export interface BitcoinRepository {
  findBlockByHash(hash: BlockHash): Promise<BitcoinBlockWithTransactions | null>;

  saveBlock(block: BitcoinBlockWithTransactions): Promise<void>;

  findBlocksByDate(date: string): Promise<BitcoinBlockSummary[]>;

  saveBlocksForDate(date: string, blocks: BitcoinBlockSummary[]): Promise<void>;

  findTransactionsByWallet(address: WalletAddress): Promise<BitcoinTransaction[] | null>;

  saveTransactionsForWallet(
    address: WalletAddress,
    transactions: BitcoinTransaction[],
  ): Promise<void>;
}