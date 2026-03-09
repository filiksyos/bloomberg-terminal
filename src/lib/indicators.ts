import type { CandleData } from "./types";

export function calculateSMA(data: CandleData[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      result.push(sum / period);
    }
  }
  return result;
}

export function calculateEMA(data: CandleData[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);

  // Start with SMA for the first EMA value
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sum += data[i].close;
      result.push(null);
    } else if (i === period - 1) {
      sum += data[i].close;
      result.push(sum / period);
    } else {
      const prev = result[i - 1]!;
      const ema = (data[i].close - prev) * multiplier + prev;
      result.push(ema);
    }
  }
  return result;
}

export function calculateRSI(data: CandleData[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = [];
  const changes: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      changes.push(0);
      result.push(null);
      continue;
    }

    const change = data[i].close - data[i - 1].close;
    changes.push(change);

    if (i < period) {
      result.push(null);
      continue;
    }

    if (i === period) {
      let avgGain = 0;
      let avgLoss = 0;
      for (let j = 1; j <= period; j++) {
        if (changes[j] > 0) avgGain += changes[j];
        else avgLoss += Math.abs(changes[j]);
      }
      avgGain /= period;
      avgLoss /= period;

      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        result.push(100 - 100 / (1 + rs));
      }
    } else {
      const prevRSI = result[i - 1];
      if (prevRSI === null) {
        result.push(null);
        continue;
      }

      // Calculate smoothed averages
      let avgGain = 0;
      let avgLoss = 0;
      for (let j = i - period + 1; j <= i; j++) {
        if (changes[j] > 0) avgGain += changes[j];
        else avgLoss += Math.abs(changes[j]);
      }
      avgGain /= period;
      avgLoss /= period;

      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        result.push(100 - 100 / (1 + rs));
      }
    }
  }
  return result;
}

export interface MACDResult {
  macdLine: (number | null)[];
  signalLine: (number | null)[];
  histogram: (number | null)[];
}

export function calculateMACD(
  data: CandleData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  const macdLine: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (fastEMA[i] === null || slowEMA[i] === null) {
      macdLine.push(null);
    } else {
      macdLine.push(fastEMA[i]! - slowEMA[i]!);
    }
  }

  // Calculate signal line (EMA of MACD line)
  const signalLine: (number | null)[] = [];
  const macdValues = macdLine.filter((v): v is number => v !== null);
  const multiplier = 2 / (signalPeriod + 1);

  let signalStartIndex = -1;
  let nonNullCount = 0;

  for (let i = 0; i < data.length; i++) {
    if (macdLine[i] === null) {
      signalLine.push(null);
      continue;
    }

    nonNullCount++;

    if (nonNullCount < signalPeriod) {
      signalLine.push(null);
    } else if (nonNullCount === signalPeriod) {
      // SMA of first signalPeriod MACD values
      let sum = 0;
      let count = 0;
      for (let j = 0; j <= i; j++) {
        if (macdLine[j] !== null) {
          sum += macdLine[j]!;
          count++;
          if (count === signalPeriod) break;
        }
      }
      signalLine.push(sum / signalPeriod);
      signalStartIndex = i;
    } else {
      const prev = signalLine[i - 1];
      if (prev === null) {
        signalLine.push(null);
      } else {
        signalLine.push((macdLine[i]! - prev) * multiplier + prev);
      }
    }
  }

  // Calculate histogram
  const histogram: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (macdLine[i] === null || signalLine[i] === null) {
      histogram.push(null);
    } else {
      histogram.push(macdLine[i]! - signalLine[i]!);
    }
  }

  return { macdLine, signalLine, histogram };
}

export interface BollingerBandsResult {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
}

export function calculateBollingerBands(
  data: CandleData[],
  period: number = 20,
  stdDevMultiplier: number = 2
): BollingerBandsResult {
  const middle = calculateSMA(data, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (middle[i] === null) {
      upper.push(null);
      lower.push(null);
    } else {
      // Calculate standard deviation
      let sumSquaredDiff = 0;
      for (let j = 0; j < period; j++) {
        const diff = data[i - j].close - middle[i]!;
        sumSquaredDiff += diff * diff;
      }
      const stdDev = Math.sqrt(sumSquaredDiff / period);
      upper.push(middle[i]! + stdDevMultiplier * stdDev);
      lower.push(middle[i]! - stdDevMultiplier * stdDev);
    }
  }

  return { upper, middle, lower };
}
