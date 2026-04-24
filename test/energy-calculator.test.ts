import { EnergyCalculator } from '../src/modules/bitcoin/projectors/energy-calculator';
import { describe, expect, it } from 'vitest'

describe('EnergyCalculator', () => {
  it('calculates energy from bytes', () => {
    const calculator = new EnergyCalculator(4.56);

    expect(calculator.calculateForBytes(100)).toBeCloseTo(456);
  });

  it('rejects negative sizes', () => {
    const calculator = new EnergyCalculator(4.56);

    expect(() => calculator.calculateForBytes(-1)).toThrow('Invalid transaction size');
  });

  it('rejects non-integer sizes', () => {
    const calculator = new EnergyCalculator(4.56);

    expect(() => calculator.calculateForBytes(1.5)).toThrow('Invalid transaction size');
  });
});