import { Card } from './card';

export function LoadingFallback() {
  return (
    <Card className="p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </Card>
  );
}
