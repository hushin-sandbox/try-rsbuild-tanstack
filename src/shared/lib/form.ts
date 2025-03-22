import { createFormHook } from '@tanstack/react-form';
import type { ReactNode } from 'react';
import { fieldContext, formContext } from './form-context';

// 任意のフォーム値の型を受け取るジェネリック型
export interface UseFormReturn<TFormData> {
  handleSubmit: () => void;
  state: {
    canSubmit: boolean;
    isSubmitting: boolean;
    errors: Record<keyof TFormData, string[]>;
    values: TFormData;
  };
  AppField: <TFieldName extends keyof TFormData>(props: {
    name: TFieldName;
    children: (field: {
      name: TFieldName;
      state: {
        value: TFormData[TFieldName];
        meta: {
          errors: string[];
          isTouched: boolean;
          isValidating: boolean;
        };
      };
      handleChange: (value: TFormData[TFieldName]) => void;
      handleBlur: () => void;
    }) => ReactNode;
  }) => ReactNode;
}

// フォームのオプション型
export interface FormOptions<TFormData> {
  defaultValues: TFormData;
  validators?: {
    onChange?: (context: { value: TFormData }) =>
      | Partial<Record<keyof TFormData, string>>
      | undefined;
  };
  onSubmit?: (context: { value: TFormData }) => Promise<void> | void;
}

const { useAppForm: baseUseAppForm, withForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext,
});

// ジェネリック型を適切に扱うラッパー関数
export function useAppForm<TFormData extends Record<string, unknown>>({
  defaultValues,
  validators,
  onSubmit,
}: FormOptions<TFormData>) {
  return baseUseAppForm({
    defaultValues,
    validators,
    onSubmit,
  }) as unknown as UseFormReturn<TFormData>;
}

export { withForm };
