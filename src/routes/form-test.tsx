import { createFileRoute } from '@tanstack/react-router';
import { useAppForm } from '~shared/lib/form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~shared/ui/form';
import { Input } from '~shared/ui/input';

type FormValues = {
  [K in 'name']: string;
};

function FormTest() {
  const form = useAppForm<FormValues>({
    defaultValues: {
      name: '',
    },
    validators: {
      onChange: ({ value }) => {
        if (!value.name) {
          return { name: '名前は必須です' };
        }
        if (value.name.length < 3) {
          return { name: '名前は3文字以上で入力してください' };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      alert(`送信しました: ${JSON.stringify(value)}`);
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">フォームテスト</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.AppField name="name">
          {(field) => (
            <FormField name={field.name}>
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </FormControl>
                <FormDescription>3文字以上で入力してください</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          )}
        </form.AppField>

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!form.state.canSubmit}
          >
            送信
          </button>
        </div>
      </Form>
    </div>
  );
}

export const Route = createFileRoute('/form-test')({
  component: FormTest,
});
