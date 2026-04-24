# Bitcoin Energy Consumption API

A GraphQL API that estimates energy consumption of Bitcoin transactions based on transaction size.

## Overview

This project models Bitcoin blockchain data and derives energy consumption metrics using a simple assumption:

> **Energy cost = 4.56 kWh per byte**

The system is designed with clear separation of concerns to allow future scaling into a production-grade data platform.

---

## Features

- Energy consumption per transaction for a block
- Total energy consumption per day (last N days)
- Total energy consumption for a wallet address
- Read-through ingestion (avoids repeated external API calls)


## Architecture

External API (blockchain.info)  
→ Ingestion Layer  
→ Domain Model (normalized Bitcoin data)  
→ Processing Layer (energy projection & aggregation)  
→ Repositories (in-memory)  
→ GraphQL API (read layer)

### Layers

#### 1. Ingestion

Responsible for fetching and normalizing external data.

```
BlockchainInfoDataProvider → BlockchainInfoNormalizer → Domain models
```
#### 2. Processing

Pure business logic:

- Energy calculation
- Block projection
- Daily aggregation
- Wallet aggregation

No I/O, fully testable.

#### 3. Application Layer

Coordinates:
```
GraphQL → Service → Repository → (Ingest if needed) → Process → Store → Return
```
Implements **read-through ingestion**:
- Data is fetched only if missing
- Results are cached in repositories

#### 4. Repositories

In-memory storage acting as both cache and persistence (see "Scaling Path" below)

---

## API

### Query: Block energy

```graphql
query {
  blockEnergy(blockHash: "...") {
    blockHash
    totalEnergyKwh
    transactions {
      transactionHash
      energyKwh
    }
  }
}
```
### Query: Daily energy

```graphql
query {
  dailyEnergy(days: 3) {
    date
    totalEnergyKwh
  }
}
```

### Query: Wallet energy
```graphql
query {
  walletEnergy(address: "...") {
    totalEnergyKwh
  }
}
```
---
## Scaling Path

- Background ingestion (cron / queue)
- Add request batching / concurrency limits
- Replace repositories with Postgres
- Add cache
- Precompute daily aggregates
- Store denormalized read models

## Running the project
Requirements:
- NodeJS 20.x (run `nvm use` in root folder)
- Yarn cli

Install dependencies:

```sh
yarn
```

Run tests

```sh
yarn run test
```

Run the serverless function in offline mode:

```sh
yarn start
```

The server will be ready at: `http://localhost:4000/graphql`