import { SchemaComposer } from 'graphql-compose';
import { createBitcoinModule } from './modules/bitcoin/bitcoin.module';

const schemaComposer = new SchemaComposer();

const { energyQueryService } = createBitcoinModule();

schemaComposer.createObjectTC({
  name: 'TransactionEnergy',
  fields: {
    transactionHash: 'String!',
    blockHash: 'String!',
    sizeBytes: 'Int!',
    energyKwh: 'Float!',
  },
});

schemaComposer.createObjectTC({
  name: 'BlockEnergy',
  fields: {
    blockHash: 'String!',
    blockHeight: 'Int!',
    timestamp: 'Date!',
    transactionCount: 'Int!',
    totalSizeBytes: 'Int!',
    totalEnergyKwh: 'Float!',
    transactions: '[TransactionEnergy!]!',
  },
});

schemaComposer.createObjectTC({
  name: 'DailyEnergy',
  fields: {
    date: 'String!',
    blockCount: 'Int!',
    transactionCount: 'Int!',
    totalSizeBytes: 'Int!',
    totalEnergyKwh: 'Float!',
  },
});

schemaComposer.createObjectTC({
  name: 'WalletEnergy',
  fields: {
    address: 'String!',
    transactionCount: 'Int!',
    totalSizeBytes: 'Int!',
    totalEnergyKwh: 'Float!',
  },
});

schemaComposer.Query.addFields({
  hello: {
    type: 'String!',
    resolve: () => 'Hi there, good luck with the assignment!',
  },

  blockEnergy: {
    type: 'BlockEnergy!',
    args: {
      blockHash: 'String!',
    },
    resolve: async (_, { blockHash }: { blockHash: string }) => {
      return energyQueryService.getBlockEnergy(blockHash);
    },
  },

  dailyEnergy: {
    type: '[DailyEnergy!]!',
    args: {
      days: 'Int!',
    },
    resolve: async (_, { days }: { days: number }) => {
      return energyQueryService.getDailyEnergy(days);
    },
  },

  walletEnergy: {
    type: 'WalletEnergy!',
    args: {
      address: 'String!',
    },
    resolve: async (_, { address }: { address: string }) => {
      return energyQueryService.getWalletEnergy(address);
    },
  },
});

export const schema = schemaComposer.buildSchema();