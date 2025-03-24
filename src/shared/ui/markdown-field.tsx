import { marked } from 'marked';
import { memo, useState } from 'react';
import { Button } from './button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Textarea } from './textarea';

const PreviewIcon = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const MarkdownPreview = memo(function MarkdownPreview({
  content,
}: {
  content: string;
}) {
  return (
    <div
      className="prose dark:prose-invert max-w-none min-h-[150px] p-4 border rounded-md bg-background"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
    />
  );
});

export interface MarkdownFieldProps {
  name: string;
  label?: string;
  description?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export function MarkdownField({
  name,
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  maxLength = 1000,
  placeholder,
  disabled,
  rows = 5,
}: MarkdownFieldProps) {
  const [isPreview, setIsPreview] = useState(false);
  const currentLength = value.length;

  return (
    <FormField name={name}>
      <FormItem className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>{label}</FormLabel>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            disabled={disabled}
          >
            {isPreview ? (
              <>
                <EditIcon />
                <span className="ml-2">エディタ</span>
              </>
            ) : (
              <>
                <PreviewIcon />
                <span className="ml-2">プレビュー</span>
              </>
            )}
          </Button>
        </div>
        <FormControl>
          {isPreview ? (
            <MarkdownPreview content={value} />
          ) : (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              maxLength={maxLength}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
            />
          )}
        </FormControl>
        <div className="flex justify-between">
          <FormDescription>{description}</FormDescription>
          <FormDescription>
            {currentLength} / {maxLength}文字
          </FormDescription>
        </div>
        <FormMessage>{error}</FormMessage>
      </FormItem>
    </FormField>
  );
}
