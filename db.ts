// db.js
import Dexie, { type EntityTable } from 'dexie';
import { z } from 'zod';

export const uuid = z.custom<`${string}-${string}-${string}-${string}-${string}`>(val =>
  typeof val === "string" ? /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(val) : false
).default("00000000-0000-4000-9800-000000000000");
export type Uuid = z.infer<typeof uuid>; // `${string}-${string}-${string}-${string}-${string}`

export const userSchema = z.object({
  id: uuid,
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
});
export type User = z.output<typeof userSchema>

export const workSchema = z.object({
  id: uuid,
  title: z.string(),
  author_name: z.array(z.string()),
  key: z.string(),
  publish_year: z.array(z.number()),
});
export type Work = z.output<typeof workSchema>;

export const stackSchema = z.object({
  id: uuid,
  user_id: uuid,
  isDefault: z.boolean().default(false),
  name: z.string(),
  items: z.array(workSchema),
});
export type Stack = z.output<typeof stackSchema>;

export const db = new Dexie('StacksRank') as Dexie & {
  users: EntityTable<
    User,
    'id'
  >;
  stacks: EntityTable<
    Stack,
    'id'
  >;
};

db.version(1).stores({
  users: 'id',
  stacks: 'id,user_id',
});