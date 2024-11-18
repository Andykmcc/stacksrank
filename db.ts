// db.js
import Dexie, { type EntityTable } from 'dexie';

export interface User {
  id: `${string}-${string}-${string}-${string}-${string}`,
}
export interface Stack {
  id: `${string}-${string}-${string}-${string}-${string}`,
  user_id: `${string}-${string}-${string}-${string}-${string}`,
  name: string,
  items: Work[],
}
export interface Work {
  id: `${string}-${string}-${string}-${string}-${string}`,
  title: string,
  author_name: string[],
  key: string,
  publish_year: number[],
}
export interface Shortcut {
  key: string,
  value: any,
}

export const db = new Dexie('StacksRank') as Dexie & {
  users: EntityTable<
    User,
    'id'
  >;
  stacks: EntityTable<
    Stack,
    'id'
  >;
  works: EntityTable<
    Work,
    'id'
  >;
  shortcuts: EntityTable<
    Shortcut,
    'key'
  >;
};

db.version(1).stores({
  users: 'id',
  stacks: 'id,user_id',
  works: 'id,title,author_name',
  shortcuts: 'key',
});