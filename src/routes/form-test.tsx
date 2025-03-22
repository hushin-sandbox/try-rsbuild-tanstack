import { createFileRoute } from '@tanstack/react-router';
import { useAppForm } from '../shared/lib/form';

interface FormValues {
  name: string;
}

function FormTest() {
  const form = useAppForm({
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.AppField name="name">
          {(field) => <field.TextField label="名前" />}
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
      </form>
    </div>
  );
}

export const Route = createFileRoute('/form-test')({
  component: FormTest,
});
