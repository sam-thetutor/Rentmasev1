export const startTick = 1660052760;
export const first_tick = 1660052760;

export function lastStartedTick(tickInterval, currentTimestamp) {
    const elapsedTime = currentTimestamp - startTick;
    let tn = Math.floor(elapsedTime / tickInterval);
    return tn * tickInterval + startTick;
  }

  export function i2t(interval) {
    switch (interval) {
      case 't5m':
        return 60 * 5;
      case 't1h':
        return 60 * 60;
      case 't1d':
        return 60 * 60 * 24;
      default:
        throw new Error('Unknown interval');
    }
  }
export function p2i(period) {
    var interval = 't1d';
    if (period <= 31) interval = 't1h';
    if (period <= 7) interval = 't5m';
    return interval;
  }