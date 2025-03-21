import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { TaskList } from '~entities/task/ui/task-list';
import { Button } from '~shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~shared/ui/card';
import { LoadingFallback } from '~shared/ui/loading';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">タスク管理アプリ</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>タスク一覧</CardTitle>
            <CardDescription>すべてのタスクを表示します</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingFallback />}>
              <TaskList />
            </Suspense>
          </CardContent>
          <CardFooter>
            <Button>新規タスク作成</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
