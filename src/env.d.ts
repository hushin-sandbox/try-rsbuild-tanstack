/// <reference types="@rsbuild/core/types" />

declare global {
  interface ImportMetaEnv {
    readonly MODE: 'development' | 'production';
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
