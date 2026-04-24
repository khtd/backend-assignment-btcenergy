import type {
  BitcoinBlockSummary,
  BitcoinBlockWithTransactions,
  BitcoinTransaction,
  BlockHash,
} from '../domain/bitcoin.types';
import type {
  BlockchainInfoBlockSummaryDto,
  BlockchainInfoRawAddressDto,
  BlockchainInfoRawBlockDto,
} from './blockchain-info.types';

export class BlockchainInfoNormalizer {
  normalizeBlockSummary(dto: BlockchainInfoBlockSummaryDto): BitcoinBlockSummary {
    return {
      hash: dto.hash,
      height: dto.height,
      timestamp: new Date(dto.time * 1000),
    };
  }

  normalizeBlock(dto: BlockchainInfoRawBlockDto): BitcoinBlockWithTransactions {
    return {
      hash: dto.hash,
      height: dto.height,
      timestamp: new Date(dto.time * 1000),
      transactions: dto.tx.map((tx) => this.normalizeTransaction(tx, dto.hash)),
    };
  }

  normalizeAddressTransactions(dto: BlockchainInfoRawAddressDto): BitcoinTransaction[] {
    return dto.txs.map((tx) => ({
      hash: tx.hash,
      blockHash: '',
      sizeBytes: tx.size,
    }));
  }

  private normalizeTransaction(
    tx: { hash: string; size: number },
    blockHash: BlockHash,
  ): BitcoinTransaction {
    return {
      hash: tx.hash,
      blockHash,
      sizeBytes: tx.size,
    };
  }
}