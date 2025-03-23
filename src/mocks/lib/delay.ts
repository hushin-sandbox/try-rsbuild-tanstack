import { delay } from 'msw';

export function customDelay(duration: Parameters<typeof delay>[0]) {
  if (import.meta.env.MODE === 'test' && duration !== 'infinite') {
    return delay(0);
  }

  return delay(duration);
}
