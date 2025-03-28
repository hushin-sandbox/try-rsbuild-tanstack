/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as FormTestImport } from './routes/form-test';
import { Route as AboutImport } from './routes/about';
import { Route as IndexImport } from './routes/index';

// Create/Update Routes

const FormTestRoute = FormTestImport.update({
  id: '/form-test',
  path: '/form-test',
  getParentRoute: () => rootRoute,
} as any);

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/about': {
      id: '/about';
      path: '/about';
      fullPath: '/about';
      preLoaderRoute: typeof AboutImport;
      parentRoute: typeof rootRoute;
    };
    '/form-test': {
      id: '/form-test';
      path: '/form-test';
      fullPath: '/form-test';
      preLoaderRoute: typeof FormTestImport;
      parentRoute: typeof rootRoute;
    };
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '/about': typeof AboutRoute;
  '/form-test': typeof FormTestRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '/about': typeof AboutRoute;
  '/form-test': typeof FormTestRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexRoute;
  '/about': typeof AboutRoute;
  '/form-test': typeof FormTestRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: '/' | '/about' | '/form-test';
  fileRoutesByTo: FileRoutesByTo;
  to: '/' | '/about' | '/form-test';
  id: '__root__' | '/' | '/about' | '/form-test';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  AboutRoute: typeof AboutRoute;
  FormTestRoute: typeof FormTestRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  FormTestRoute: FormTestRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/form-test"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/form-test": {
      "filePath": "form-test.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
