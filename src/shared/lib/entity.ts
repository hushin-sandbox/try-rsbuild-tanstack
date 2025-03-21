import * as v from 'valibot';

// Base Entity Schema
export const baseEntitySchema = v.object({
  id: v.string(),
  createdAt: v.string(), // ISO 8601 string
  updatedAt: v.string(), // ISO 8601 string
});

export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};
