# React Testing のベストプラクティス

## 概要

React アプリケーションのテストにおいて、実装の詳細ではなくユーザーの視点に焦点を当てたテストを書くことが重要です。このドキュメントでは、効果的なテストを書くためのベストプラクティスをまとめています。

## 主要な原則

### 1. 実装の詳細を避ける

実装の詳細のテストは以下の問題を引き起こす可能性があります：

- リファクタリング時にテストが壊れる（偽陰性）
- アプリケーションが壊れているのにテストが通る（偽陽性）

代わりに：

- ユーザーの視点でテストを書く
- コンポーネントの外部動作に注目する
- アクセシビリティを考慮したクエリを使用する

### 2. テストの独立性を保つ

- 各テストは独立して実行できるようにする
- テスト間で状態を共有しない
- 不要な副作用を避ける

### 3. シンプルなテストを書く

- ネストを避け、フラットな構造を維持する
- 過度な抽象化を避ける
- テストの意図を明確にする

### 4. ユースケースベースのテスト

- 個々の機能ではなく、ユーザーシナリオをテスト
- エンドツーエンドの動作を確認
- 実際のユースケースに基づいたテスト

## 推奨されるアプローチ

### テストの書き方

```typescript
// ❌ 避けるべきアプローチ（ネストが深い）
describe('Login', () => {
  describe('when form is submitted', () => {
    describe('with valid credentials', () => {
      it('calls onSubmit', () => {
        // ...
      });
    });
  });
});

// ✅ 推奨されるアプローチ（フラット）
test('submits form with valid credentials', () => {
  // ...
});
```

### クエリの選択

優先順位の高い順に：

1. `getByRole` - アクセシビリティと役割に基づく検索
2. `getByLabelText` - フォーム要素に最適
3. `getByText` - テキストコンテンツで要素を見つける
4. `getByTestId` - 最後の手段として

## サンプルコード

### コンポーネント実装

```typescript
// login.ts
interface LoginProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
}

function Login({ onSubmit }: LoginProps) {
  const [error, setError] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const elements = event.currentTarget
      .elements as HTMLFormControlsCollection & {
      usernameInput: HTMLInputElement;
      passwordInput: HTMLInputElement;
    };
    const username = elements.usernameInput.value;
    const password = elements.passwordInput.value;

    if (!username) {
      setError('username is required');
    } else if (!password) {
      setError('password is required');
    } else {
      setError('');
      onSubmit({ username, password });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="usernameInput">Username</label>
        <input id="usernameInput" />
      </div>
      <div>
        <label htmlFor="passwordInput">Password</label>
        <input id="passwordInput" type="password" />
      </div>
      <button type="submit">Submit</button>
      {error ? <div role="alert">{error}</div> : null}
    </form>
  );
}
```

### テストコード

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import Login from './login';

test('shows error messages for invalid submissions', async () => {
  const handleSubmit = jest.fn();
  render(<Login onSubmit={handleSubmit} />);

  // Submit without username
  await userEvent.click(screen.getByText(/submit/i));
  expect(screen.getByRole('alert')).toHaveTextContent('username is required');

  // Add username and submit without password
  await userEvent.type(screen.getByLabelText(/username/i), 'test');
  await userEvent.click(screen.getByText(/submit/i));
  expect(screen.getByRole('alert')).toHaveTextContent('password is required');

  // Valid submission
  await userEvent.type(screen.getByLabelText(/password/i), 'password');
  await userEvent.click(screen.getByText(/submit/i));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(handleSubmit).toHaveBeenCalledWith({
    username: 'test',
    password: 'password',
  });
});
```

## テストツール

### 1. React Testing Library

最も推奨されるテストライブラリで、以下の特徴があります：

- ユーザー中心のテストを促進
- アクセシビリティを重視
- 実装の詳細に依存しない

### 2. ESLint プラグイン

- `eslint-plugin-testing-library`
- `eslint-plugin-jest-dom`

これらのプラグインは、ベストプラクティスに従ったテストの記述を支援します。

### 3. `userEvent`

`fireEvent`の代わりに`userEvent`を使用することで、より実際のユーザー操作に近い動作をシミュレートできます：

```typescript
// ❌ 避ける
fireEvent.change(input, { target: { value: 'test' } });

// ✅ 推奨
await userEvent.type(input, 'test');
```

### 4. jest-dom

カスタムマッチャーを提供し、より直感的なアサーションを可能にします：

```typescript
// ❌ 避ける
expect(element.disabled).toBe(true);

// ✅ 推奨
expect(element).toBeDisabled();
```
