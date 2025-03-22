import { initialize, mswLoader } from 'msw-storybook-addon';
import React, { useEffect } from 'react';
import '../src/styles.css';

import type { Preview } from '@storybook/react';
import { useQueryClient } from '@tanstack/react-query';
import { Providers } from '../src/shared/lib/providers';

initialize();

const ResetQueries = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.resetQueries();
    };
  }, [queryClient]);
  return null;
};

const preview: Preview = {
  parameters: {},
  loaders: [mswLoader],

  decorators: [
    (Story) => (
      <Providers>
        <Story />
        <ResetQueries />
      </Providers>
    ),
  ],
};

export default preview;
