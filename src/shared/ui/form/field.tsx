import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { useFieldContext } from '../../lib/form-context';
import { cn } from '../../lib/utils';
import { Input } from '../input';
import { Label } from '../label';

// Form Item
type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

export function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

// Form Label
export function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const field = useFieldContext();
  const { id } = React.useContext(FormItemContext);

  return (
    <Label
      data-slot="form-label"
      data-error={field.state.meta.errors.length > 0}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={id}
      {...props}
    />
  );
}

// Form Control
export function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const field = useFieldContext();
  const { id } = React.useContext(FormItemContext);

  return (
    <Slot
      data-slot="form-control"
      id={id}
      aria-describedby={
        field.state.meta.errors.length > 0 ? `${id}-error` : undefined
      }
      aria-invalid={field.state.meta.errors.length > 0}
      {...props}
    />
  );
}

// Form Description
export function FormDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  const { id } = React.useContext(FormItemContext);

  return (
    <p
      data-slot="form-description"
      id={`${id}-description`}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

// Form Message
export function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<'p'>) {
  const field = useFieldContext();
  const { id } = React.useContext(FormItemContext);

  const body =
    field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={`${id}-error`}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  );
}

// Field Components
export function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
      </FormControl>
      {field.state.meta.errors.length > 0 ? (
        <FormMessage />
      ) : (
        <FormDescription>Enter a value</FormDescription>
      )}
    </FormItem>
  );
}

export { FormItemContext };
