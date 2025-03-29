# Valibot チートシート

## Example

```ts
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

## はじめに

Valibot は、型安全で軽量なデータバリデーションライブラリです。スキーマを使用してデータの構造と制約を定義し、実行時に検証を行います。

## 基本的な概念

Valibot のメンタルモデルは、主にスキーマ、メソッド、そしてアクションに分けられます。

- スキーマ: 特定のデータ型（文字列、オブジェクト、日付など）を検証するための開始点です。
- メソッド: スキーマを使用または変更するのに役立ちます（`parse`など）。
- アクション: `pipe`メソッドと組み合わせて使用され、特定のデータ型の検証や変換をさらに行います。

## スキーマ関数

データ型を定義します。

- プリミティブスキーマ:
  - `v.bigint()`: `bigint`型
  - `v.boolean()`: `boolean`型
  - `v.null()`: `null`型
  - `v.number()`: `number`型
  - `v.string()`: `string`型
  - `v.symbol()`: `symbol`型
  - `v.undefined()`: `undefined`型
  - `v.nan()`: `NaN`
  - `v.never()`: `never`型
  - `v.void()`: `void`型
  - `v.unknown()`: `unknown`型
  - `v.any()`: `any`型
- 複合スキーマ:
  - `v.array(itemSchema)`: 同じ型の要素を持つ配列
  - `v.blob()`: `Blob`オブジェクト
  - `v.date()`: `Date`オブジェクト
  - `v.file()`: `File`オブジェクト
  - `v.function()`: 関数
  - `v.looseObject(entries)`: 不明なエントリを許容するオブジェクト
  - `v.looseTuple(items)`: 不明なアイテムを許容するタプル
  - `v.map(keySchema, valueSchema)`: `Map`オブジェクト
  - `v.object(entries)`: 特定の形状のオブジェクト
  - `v.objectWithRest(entries, rest)`: 特定の形状と残りのプロパティのスキーマを持つオブジェクト
  - `v.promise()`: `Promise`オブジェクト
  - `v.record(keySchema, valueSchema)`: 均一なキーと値を持つオブジェクト
  - `v.set(itemSchema)`: `Set`オブジェクト
  - `v.strictObject(entries)`: 不明なエントリを許容しないオブジェクト
  - `v.strictTuple(items)`: 不明なアイテムを許容しないタプル
  - `v.tuple(items)`: 特定の形状のタプル
  - `v.tupleWithRest(items, rest)`: 特定の形状と残りの要素のスキーマを持つタプル
- 特殊なスキーマ:
  - `v.any()`: 任意の型
  - `v.custom(check)`: カスタム検証ロジック
  - `v.enum(enumObject)`: 列挙型
  - `v.exactOptional(schema)`: オブジェクト内でキーが存在しないことを許容するオプショナル
  - `v.instance(Class)`: 特定のクラスのインスタンス
  - `v.intersect(schemas)`: 全てのスキーマに一致する型
  - `v.lazy(() => schema)`: 遅延評価されるスキーマ (再帰的な型定義に)
  - `v.literal(value)`: 特定のリテラル値
  - `v.nonNullable(schema)`: `null`を許容しない型
  - `v.nonNullish(schema)`: `null`と`undefined`を許容しない型
  - `v.nonOptional(schema)`: `undefined`を許容しない型
  - `v.nullable(schema)`: `null`を許容する型
  - `v.nullish(schema)`: `null`と`undefined`を許容する型
  - `v.optional(schema, defaultValue?)`: `undefined`を許容する型 (デフォルト値も指定可能)
  - `v.picklist(values)`: 配列内のいずれかの値
  - `v.undefinedable(schema, defaultValue?)`: `undefined`を許容する型 (デフォルト値も指定可能)
  - `v.union(schemas)`: いずれかのスキーマに一致する型
  - `v.variant(discriminator, options)`: 判別されたユニオン型

## スキーマメソッド

スキーマを操作するためのユーティリティ関数です。

- `v.assert(schema, input)`: 入力がスキーマに一致しない場合にエラーをスローします。
- `v.config(schema, config)`: スキーマの構成を設定します。
- `v.fallback(schema, fallback)`: 検証に失敗した場合にフォールバック値を返します。
- `v.flatten(issues)`: 問題の配列をフラットなオブジェクトに変換します。
- `v.getDefault(schema)`: スキーマのデフォルト値を返します。
- `v.getDefaults(schemas)`: 複数のスキーマのデフォルト値を返します。
- `v.getFallback(schema)`: スキーマのフォールバック値を返します。
- `v.getFallbacks(schemas)`: 複数のスキーマのフォールバック値を返します。
- `v.is(schema, input)`: 入力がスキーマに一致するかどうかを返します (型ガード)。
- `v.parse(schema, input, config?)`: 入力を検証し、成功すれば検証済みのデータを返します。
- `v.safeParse(schema, input, config?)`: 入力を検証し、結果オブジェクトを返します (`{ success: true, output: ... }` または `{ success: false, issues: ... }`)。
- `v.pipe(schema, ...actions)`: スキーマにパイプラインを追加します。
- `v.unwrap(schema)`: スキーマの内部スキーマを返します。

## オブジェクトメソッド

オブジェクトスキーマを操作するためのメソッドです。

- `v.keyof(objectSchema)`: オブジェクトスキーマのキーのユニオン型スキーマを作成します。
- `v.omit(objectSchema, keys)`: オブジェクトスキーマから指定されたキーを除外した新しいスキーマを作成します。
- `v.partial(objectSchema)`: オブジェクトスキーマの全てのプロパティをオプショナルにした新しいスキーマを作成します。
- `v.pick(objectSchema, keys)`: オブジェクトスキーマから指定されたキーのみを持つ新しいスキーマを作成します。
- `v.required(objectSchema)`: オブジェクトスキーマの全てのプロパティを必須にした新しいスキーマを作成します。

## パイプラインメソッド (アクション)

スキーマの検証と変換を行うための関数です。

- 検証アクション:
  - `v.base64(message?)`
  - `v.bic(message?)`
  - `v.bytes(message?)`
  - `v.check(check, message?)`
  - `v.checkItems(check, message?)`
  - `v.creditCard(message?)`
  - `v.cuid2(message?)`
  - `v.decimal(message?)`
  - `v.digits(message?)`
  - `v.email(message?)`
  - `v.emoji(message?)`
  - `v.empty(message?)`
  - `v.endsWith(value, message?)`
  - `v.everyItem(schema)`
  - `v.excludes(value, message?)`
  - `v.finite(message?)`
  - `v.graphemes(message?)`
  - `v.gtValue(value, message?)`
  - `v.hash(algo, message?)`
  - `v.hexadecimal(message?)`
  - `v.hexColor(message?)`
  - `v.includes(value, message?)`
  - `v.integer(message?)`
  - `v.ip(message?)`
  - `v.ipv4(message?)`
  - `v.ipv6(message?)`
  - `v.isoDate(message?)`
  - `v.isoDateTime(message?)`
  - `v.isoTime(message?)`
  - `v.isoTimeSecond(message?)`
  - `v.isoTimestamp(message?)`
  - `v.isoWeek(message?)`
  - `v.length(length, message?)`
  - `v.ltValue(value, message?)`
  - `v.mac(message?)`
  - `v.mac48(message?)`
  - `v.mac64(message?)`
  - `v.maxBytes(bytes, message?)`
  - `v.maxGraphemes(graphemes, message?)`
  - `v.maxLength(length, message?)`
  - `v.maxSize(size, message?)`
  - `v.maxValue(value, message?)`
  - `v.maxWords(words, message?)`
  - `v.mimeType(mimes, message?)`
  - `v.minBytes(bytes, message?)`
  - `v.minGraphemes(graphemes, message?)`
  - `v.minLength(length, message?)`
  - `v.minSize(size, message?)`
  - `v.minValue(value, message?)`
  - `v.minWords(words, message?)`
  - `v.multipleOf(multiple, message?)`
  - `v.nanoid(message?)`
  - `v.nonEmpty(message?)`
  - `v.notBytes(bytes, message?)`
  - `v.notGraphemes(graphemes, message?)`
  - `v.notLength(length, message?)`
  - `v.notSize(size, message?)`
  - `v.notValue(value, message?)`
  - `v.notValues(values, message?)`
  - `v.notWords(words, message?)`
  - `v.octal(message?)`
  - `v.partialCheck(entries, check, message?)`
  - `v.rawCheck(check, message?)`
  - `v.regex(regex, message?)`
  - `v.rfcEmail(message?)`
  - `v.safeInteger(message?)`
  - `v.size(size, message?)`
  - `v.slug(message?)`
  - `v.someItem(schema)`
  - `v.startsWith(value, message?)`
  - `v.ulid(message?)`
  - `v.url(message?)`
  - `v.uuid(message?)`
  - `v.value(value, message?)`
  - `v.values(values, message?)`
  - `v.words(words, message?)`
- 変換アクション:
  - `v.brand()`
  - `v.filterItems(filter)`
  - `v.findItem(find)`
  - `v.mapItems(map)`
  - `v.rawTransform(transform)`
  - `v.readonly()`
  - `v.reduceItems(reduce, initialValue)`
  - `v.sortItems(compare?)`
  - `v.toLowerCase()`
  - `v.toMaxValue(maxValue)`
  - `v.toMinValue(minValue)`
  - `v.toUpperCase()`
  - `v.transform(transform)`
  - `v.trim()`
  - `v.trimEnd()`
  - `v.trimStart()`
- メタデータアクション:
  - `v.description(description)`
  - `v.metadata(metadata)`
  - `v.title(title)`

## パイプラインメソッド (高度なメソッド)

- `v.forward(action, path)`: ネストされたスキーマに問題を関連付けます。

## 解析メソッド

- `v.parse(schema, data, config?)`: スキーマに対してデータを検証し、成功した場合は検証済みのデータを返します。失敗した場合は `ValiError` をスローします。
- `v.safeParse(schema, data, config?)`: スキーマに対してデータを検証し、結果オブジェクト (`{ success: true, output: ... }` または `{ success: false, issues: ... }`) を返します。
- `v.is(schema, data)`: データがスキーマに一致するかどうかを真偽値で返します (型ガード)。
- `v.assert(schema, data)`: データがスキーマに一致しない場合にエラーをスローします (型ガード)。

## エラー処理

検証中に問題が発生した場合の情報を提供します。

- `ValiError`: `parse` が失敗した場合にスローされるエラーオブジェクトです。
- `issue`: 検証の失敗に関する詳細情報を含むオブジェクトです。
  - `kind`: 問題の種類 (`'schema'`, `'validation'`, `'transformation'`)
  - `type`: バリデーションを行った関数の名前
  - `input`: 問題が発生した入力値
  - `expected`: 期待される値
  - `received`: 受け取った値
  - `message`: 人間が理解できるエラーメッセージ
  - `requirement`: 追加の検証情報 (例: 最小長)
  - `path`: 複雑なデータ構造内の問題の場所を示す配列
  - `issues`: `union` スキーマで使用される、子スキーマの問題の配列
  - `lang`: 使用された言語
  - `abortEarly`: 早期に検証が中止されたかどうか
  - `abortPipeEarly`: パイプラインが早期に中止されたかどうか
  - `skipPipe`: パイプラインがスキップされたかどうか
- `v.flatten(issues)`: 問題の配列を、ネストされたキーを持つフラットなオブジェクトに変換します。

## オプショナル

- `v.optional(schema, defaultValue?)`: `undefined` を許容します。オブジェクト内では `key?: string | undefined` となります。デフォルト値を設定できます。
- `v.exactOptional(schema)`: `undefined` を許容しませんが、オブジェクト内でキーが存在しないことを許容します。オブジェクト内では `key?: string` となります。
- `v.undefinedable(schema, defaultValue?)`: `undefined` を許容します。デフォルト値を設定できます。
- `v.nullable(schema, defaultValue?)`: `null` を許容します。デフォルト値を設定できます。
- `v.nullish(schema, defaultValue?)`: `null` と `undefined` を許容します。オブジェクト内では `key?: string | undefined` となります。デフォルト値を設定できます。

## 非同期検証

非同期の検証が必要な場合は、対応する `...Async` 関数を使用します (`v.objectAsync`, `v.pipeAsync` など)。

## 命名規則

スキーマと型のエクスポートに関する推奨される命名規則があります。

- 規約 1: スキーマと型に同じ名前を使用します。
- 規約 2: スキーマには `Schema` サフィックス、入力型には `Input` サフィックス、出力型には `Output` サフィックスを使用します。
