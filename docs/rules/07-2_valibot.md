### Valibot の使い方

zodとはAPIが違うので注意すること

```ts
import * as v from 'valibot'; // `* as v` で import して 使う

const LoginSchema = v.object({
  // .pipe でスキーマにパイプラインを追加
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)), 
});

// v.InferOutput で型を生成
type LoginData = v.InferOutput<typeof LoginSchema>;
```
