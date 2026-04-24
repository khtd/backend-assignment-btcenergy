export class EnergyCalculator {
  constructor(private readonly energyKwhPerByte: number) {}

  calculateForBytes(sizeBytes: number): number {
    if (!Number.isInteger(sizeBytes) || sizeBytes < 0) {
      throw new Error(`Invalid transaction size: ${sizeBytes}`);
    }

    return sizeBytes * this.energyKwhPerByte;
  }
}