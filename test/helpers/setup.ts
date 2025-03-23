import type { composeStory } from '@storybook/react';
import userEvent from '@testing-library/user-event';

type ComposedStoryFn = ReturnType<typeof composeStory>;

/**
 * テストのセットアップユーティリティ
 */
export async function setup(Story: ComposedStoryFn) {
  const user = userEvent.setup();
  await Story.run();
  return {
    user,
  };
}
