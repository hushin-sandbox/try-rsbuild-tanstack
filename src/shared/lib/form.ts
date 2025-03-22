import { createFormHook } from '@tanstack/react-form';
import { TextField } from '../ui/form/field';
import { fieldContext, formContext } from './form-context';

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

// より詳細な型定義は必要に応じて追加
