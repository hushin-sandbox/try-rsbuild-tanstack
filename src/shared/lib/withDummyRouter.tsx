// https://zenn.dev/hmochizuki/articles/b3037e1df0cf9f

import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { type ReactNode, createContext, useContext } from 'react';

const StoryContext = createContext<(() => ReactNode) | undefined>(undefined);
const RenderStory = () => {
  const storyFn = useContext(StoryContext);
  if (!storyFn) {
    throw new Error('Storybook root not found');
  }
  return storyFn();
};

// List the paths of your application
const paths = ['/', '/about', '/paths'];
const routes = paths.map((path) =>
  createRoute({
    path,
    getParentRoute: () => rootRoute,
    component: RenderStory,
  }),
);

const rootRoute = createRootRoute();
rootRoute.addChildren(routes);
const storyRouter = createRouter({
  history: createMemoryHistory({ initialEntries: ['/'] }),
  routeTree: rootRoute,
});

/** StoryBook用ダミーRouter */
export const withDummyRouter =
  (initialPath: (typeof paths)[number]) => (storyFn: () => ReactNode) => {
    storyRouter.history.push(initialPath);
    return (
      <StoryContext.Provider value={storyFn}>
        <RouterProvider router={storyRouter} />
      </StoryContext.Provider>
    );
  };
