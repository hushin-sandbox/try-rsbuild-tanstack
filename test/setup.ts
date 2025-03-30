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

/**
 * JSDOM doesn't implement PointerEvent so we need to mock our own implementation
 * Default to mouse left click interaction
 * https://github.com/radix-ui/primitives/issues/1822
 * https://github.com/jsdom/jsdom/pull/2666
 */
class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || 'mouse';
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

// button type=submit のクリックイベントをsubmitイベントに変換する
// https://github.com/capricorn86/happy-dom/issues/527
const originalDispatchEvent = HTMLElement.prototype.dispatchEvent;
HTMLElement.prototype.dispatchEvent = function (event): boolean {
  const result = originalDispatchEvent.call(this, event);
  if (
    event.type === 'click' &&
    this.tagName === 'BUTTON' &&
    this.getAttribute('type') === 'submit'
  ) {
    this.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
  }
  return result;
};
