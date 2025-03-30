import { initialize, mswLoader } from 'msw-storybook-addon';
import '../src/styles.css';

import type { Preview } from '@storybook/react';
import { configure } from '@storybook/test';
import { Providers, createQueryClient } from '../src/shared/lib/providers';

initialize();

configure({
  asyncUtilTimeout: 2000,
});

const preview: Preview = {
  parameters: {},
  loaders: [mswLoader],

  decorators: [
    (Story) => (
      // NOTE: story切替時にQueryのキャッシュをクリアするため、createQueryClientで毎回新しいQueryClientを生成
      <Providers queryClient={createQueryClient({ retry: false })}>
        <Story />
      </Providers>
    ),
  ],
};

export default preview;
