import { setProjectAnnotations } from '@storybook/react';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import * as previewAnnotations from '../.storybook/preview';

setProjectAnnotations(previewAnnotations);

afterEach(() => {
  cleanup();
});

// グローバルな crypto.randomUUID のモック
const mockRandomUUID = vi.fn(() => '00000000-0000-0000-0000-000000000000');
Object.defineProperty(globalThis, 'crypto', {
  value: {
    ...globalThis.crypto,
    randomUUID: mockRandomUUID,
  },
});

// テスト用の固定時間を設定
vi.setSystemTime(new Date('2025-03-21T00:00:00.000Z'));
