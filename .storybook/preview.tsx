import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import '../src/styles.css';

import type { Preview } from '@storybook/react';
import { Providers } from '../src/shared/lib/providers';

initialize();

const preview: Preview = {
  parameters: {},
  loaders: [mswLoader],

  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
};

export default preview;
