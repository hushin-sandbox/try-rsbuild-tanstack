import { dirname, join } from 'node:path';
import type { StorybookConfig } from 'storybook-react-rsbuild';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: [],
  framework: {
    name: getAbsolutePath(
      'storybook-react-rsbuild',
    ) as 'storybook-react-rsbuild',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
