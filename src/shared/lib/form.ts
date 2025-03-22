import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './form-context';

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm };
