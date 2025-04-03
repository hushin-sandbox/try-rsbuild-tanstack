import { delay as mswDelay } from 'msw';

export const delay = (duration: number | 'infinite' = 1000) => {
  if (import.meta.env.MODE === 'test' && duration !== 'infinite') {
    return mswDelay(0);
  }
  return mswDelay(duration);
};
