import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import '../src/styles.css';

import type { Preview } from '@storybook/react';
import { Providers, createQueryClient } from '../src/shared/lib/providers';

initialize();

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
