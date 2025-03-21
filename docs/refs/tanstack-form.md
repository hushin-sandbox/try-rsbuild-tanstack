# TanStack Form API チートシート (React)

TanStack Form は、さまざまなフレームワークに対応した強力なフォームライブラリですが、ここでは React での使用に特化した API と、ライブラリ間で共通する API について解説します。

## React 専用 API

これらの API は `@tanstack/react-form` パッケージに特有のものです。

### フック

*   **`useForm(opts?)`**: **フォームのインスタンスを作成**し、フォームの状態管理、送信処理、バリデーションなどを行うための API を提供する React Hook です。
    *   `opts`: フォームの初期値 (`defaultValues`)、バリデーション (`validators`)、送信処理 (`onSubmit`) などのオプションを設定する `FormOptions` 型のオブジェクト。
    *   **戻り値**: フォーム API (`ReactFormExtendedApi` 型) のインスタンス。これには、フォームの状態や操作を行うためのメソッドとプロパティが含まれます。
*   **`createFormHook(options)`**: **カスタムのフォームフックを作成**するための関数です。これにより、独自のデフォルト設定やコンポーネントのバインディングを行うことができます。
    *   `options`: `fieldContext`、`formContext`、`fieldComponents`、`formComponents` などのオプションを含む `CreateFormHookProps` 型のオブジェクト。
    *   **戻り値**: `useAppForm` フックと `withForm` HOC を含むオブジェクト。
*   **`useAppForm(props)`**: `createFormHook` によって作成された**カスタムフォームフック**です。
    *   `props`: `defaultValues`、`validators`、`onSubmit` などの `FormOptions` に加えて、カスタムフックに定義された追加のプロパティを受け取ることができます。
    *   **戻り値**: カスタム化されたフォーム API (`AppFieldExtendedReactFormApi` 型) のインスタンス。
*   **`useField(opts)`**: **個々のフォームフィールドの状態と API を管理**するための React Hook です。通常、`<Field>` コンポーネントの `children` 関数内で使用されます。
    *   `opts`: フィールドの名前 (`name`) やバリデーション (`validators`) などの `FieldApiOptions` 型のオブジェクト。
    *   **戻り値**: フィールド API (`FieldApi` 型) と React 固有のフィールド API (`ReactFieldApi` 型) を組み合わせたオブジェクト。
*   **`createFormHookContexts()`**: **フォームとフィールドのコンテキスト**を作成するための関数です。カスタムフォームフックで使用されます。
    *   **戻り値**: `fieldContext` (Context オブジェクト)、`formContext` (Context オブジェクト)、`useFieldContext()` (フィールドコンテキストを使用するフック)、`useFormContext()` (フォームコンテキストを使用するフック) を含むオブジェクト。
*   **`useFieldContext()`**: カスタムフィールドコンポーネント内で**フィールドのコンテキスト**にアクセスするための React Hook です。`createFormHookContexts` によって作成されたコンテキストで使用します。
    *   **戻り値**: `FieldApi` 型のフィールド API インスタンス。
*   **`useFormContext()`**: カスタムフォームコンポーネント内で**フォームのコンテキスト**にアクセスするための React Hook です。`createFormHookContexts` によって作成されたコンテキストで使用します。
    *   **戻り値**: `ReactFormExtendedApi` 型のフォーム API インスタンス。
*   **`useTransform(fn, deps)`**: フォームの状態を**変換**するための Hook です。サーバーアクションからの状態などをフォームにマージする際に便利です。
    *   `fn`: 変換関数。現在のフォーム API を受け取り、新しいフォーム API (またはその一部) を返します。
    *   `deps`: 変換関数が再実行される依存配列。
    *   **戻り値**: `FormTransform` 型の変換関数。
*   **`useStore(store, selector?)`**: TanStack Store の Hook で、フォームやフィールドの**リアクティブな状態**を購読するために使用します。
    *   `store`: フォームの `store` プロパティ (`form.store`) またはフィールドの `store` プロパティ (`field.store`)。
    *   `selector`: 状態の一部を選択する関数 (省略可能)。
    *   **戻り値**: 選択された状態の値。
*   **`useField()`** (型エイリアス `UseField`): `useField` Hook の型定義。

### コンポーネント

*   **`<Field name children validators>`**: **フォームの単一のフィールド**をレンダリングし、その状態と API を `children` prop を通じて提供する React コンポーネントです。
    *   `name`: フォームの `defaultValues` に対応するフィールドの名前。
    *   `children`: フィールドの状態 (`field.state`) や API (`field.api`) を引数として受け取る関数。
    *   `validators`: フィールド固有のバリデーションルールを設定する `FieldValidators` 型のオブジェクト。
*   **`form.Field`**: `useForm` フックから返されるフォーム API オブジェクトに含まれる `<Field>` コンポーネントです。
*   **`form.Subscribe children selector?`**: **フォームの状態の変化を購読**し、`children` prop を通じてリアクティブに UI を更新する React コンポーネントです。
    *   `children`: フォームの状態 (`state`) または選択された状態を引数として受け取る関数または ReactNode。
    *   `selector`: 購読する状態の一部を選択する関数 (省略可能)。

### Higher-Order Component (HOC)

*   **`withForm(options)(WrappedComponent)`**: **既存の React コンポーネントにフォームの API と状態**を注入する Higher-Order Component です。
    *   `options`: フォームのオプション (`FormOptions`) やレンダリングロジック (`render`) を含む `WithFormProps` 型のオブジェクト。
    *   `WrappedComponent`: フォームの props が注入されるコンポーネント。

### 型エイリアス

*   **`FieldComponent`**: `<Field>` コンポーネントの型定義。
*   **`ReactFormExtendedApi`**: `FormApi` に React 固有の機能を追加した型。
*   **`UseField`**: `useField` Hook の型定義。

### 関数

*   **`createFormHookContexts()`**: 上記参照。
*   **`createFormHook(options)`**: 上記参照。
*   **`Field(props)`**: `<Field>` コンポーネントの関数定義。
*   **`useField(opts)`**: 上記参照。
*   **`useForm(opts?)`**: 上記参照。
*   **`useTransform(fn, deps)`**: 上記参照。

## ライブラリ共通 API

これらの API は `@tanstack/form-core` パッケージに含まれており、React だけでなく他のフレームワーク (Vue, Solid など) でも共通して使用されます。

### クラス

*   **`FormApi<TFormData, TOnMount, ...>`**: **フォームの核となる機能**を提供するクラスです。状態の管理、値の取得/設定、バリデーションの実行、送信処理など、フォーム全体のロジックを扱います。`useForm` フックや `createForm` 関数などによってインスタンス化されます。
*   **`FieldApi<TParentData, TName, TData, TOnMount, ...>`**: **個々のフォームフィールドの核となる機能**を提供するクラスです。フィールドの状態管理、値の取得/設定、バリデーションの実行などを扱います。`useField` フックや `createField` 関数などによってインスタンス化されます。

### インターフェース

*   **`FormOptions<TFormData, TOnMount, ...>`**: `FormApi` の**コンストラクタや `useForm` フックに渡すオプション**を定義するインターフェースです。`defaultValues`、`validators`、`onSubmit` などを設定します。
*   **`FieldApiOptions<TParentData, TName, TData, TOnMount, ...>`**: `FieldApi` の**コンストラクタや `useField` フックに渡すオプション**を定義するインターフェースです。`name`、`validators`、`defaultValue` などを設定します。
*   **`FieldListeners<TParentData, TName, TData>`**: **フィールドのイベントリスナー** (`onChange`, `onBlur` など) を定義するインターフェースです。
*   **`FormValidators<TFormData>`**: **フォーム全体のバリデーションルール**を定義するインターフェースです。
*   **`FieldValidators<TParentData, TName, TData>`**: **個々のフィールドのバリデーションルール**を定義するインターフェースです。
*   **`StandardSchemaV1Issue`**: 標準スキーマバリデーションのエラー情報を表すインターフェース。

### 型エイリアス

*   **`FormValidator<TFormData, TType, TFn>`**: フォームのバリデーション関数を表す型。
*   **`FieldValidator<TParentData, TName, TData, TType, TFn>`**: フィールドのバリデーション関数を表す型 (具体的な型引数は省略)。
*   **`FormState<TFormData, TOnMount, ...>`**: フォームの状態オブジェクトの型。`values`、`errors`、`meta` などのプロパティを含みます。
*   **`FieldState`**: フィールドの状態オブジェクトの型。`value`、`meta` などのプロパティを含みます。
*   **`FieldMetaBase<TParentData, TName, TData>`**: フィールドのメタ情報オブジェクトの基本型。`isTouched`、`isDirty`、`isValidating` などのフラグを含みます。
*   **`FieldMeta<TParentData, TName, TData>`**: フィールドのメタ情報オブジェクトの型。
*   **`ValidationMeta`**: バリデーションに関するメタ情報の型。
*   **`AnyFormApi`**: ジェネリクスが `any` に設定された汎用的な `FormApi` 型。
*   **`AnyFieldApi`**: ジェネリクスが `any` に設定された汎用的な `FieldApi` 型。

### 関数

*   **`mergeForm<TFormData>(baseForm, state)`**: 既存の `FormApi` インスタンスに**部分的なフォームの状態をマージ**するための関数です。主にサーバーサイドからの状態更新と連携する際に使用されます。
*   **`formOptions(options)`**: 複数のフォームで**共通のオプション**を定義し、再利用するための関数です。

このチートシートは、TanStack Form (React) の主要な API をまとめたものです。より詳細な情報や具体的な使用例については、公式ドキュメントを参照してください。