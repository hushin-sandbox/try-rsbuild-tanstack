/// <reference types="@rsbuild/core/types" />

declare global {
  interface ImportMetaEnv {
    readonly MODE: 'development' | 'production' | 'test';
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
