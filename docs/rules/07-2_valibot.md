### Valibot のルール

詳しくは [document](docs/refs/valibot.md) を参照

```ts
// Example
import * as v from 'valibot';

// Create login schema with email and password
const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

// Infer output TypeScript type of login schema as
// { email: string; password: string }
type LoginData = v.InferOutput<typeof LoginSchema>;

// Throws error for email and password
const output1 = v.parse(LoginSchema, { email: '', password: '' });

// Returns data as { email: string; password: string }
const output2 = v.parse(LoginSchema, {
  email: 'jane@example.com',
  password: '12345678',
});
```
