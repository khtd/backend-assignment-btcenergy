import type {
  BitcoinBlockSummary,
  BitcoinBlockWithTransactions,
  BlockHash,
  WalletAddress,
  BitcoinTransaction,
} from '../domain/bitcoin.types';

export interface BitcoinDataProvider {
  getBlock(hash: BlockHash): Promise<BitcoinBlockWithTransactions>;

  getBlocksByDate(date: Date): Promise<BitcoinBlockSummary[]>;

  getWalletTransactions(address: WalletAddress): Promise<BitcoinTransaction[]>;
}