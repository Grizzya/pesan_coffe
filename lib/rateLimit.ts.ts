type RateData = {
  count: number;
  startTime: number;
};

const rateStore = new Map<string, RateData>();

export function rateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const data = rateStore.get(key);

  if (!data) {
    rateStore.set(key, { count: 1, startTime: now });
    return true;
  }

  // reset window
  if (now - data.startTime > windowMs) {
    rateStore.set(key, { count: 1, startTime: now });
    return true;
  }

  if (data.count >= limit) {
    return false;
  }

  data.count++;
  return true;
}
