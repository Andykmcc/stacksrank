import { db, type Work, type User } from '../db';
import { toRaw } from 'vue';
import { unregisteredId } from './user';

export const useStacksStore = defineStore('stack', {
  state: () => {
    return {
      id: self.crypto.randomUUID(),
      user_id: unregisteredId,
      name: 'Read',
      items: <Work[]>[],
      keys: new Set<string>(),
    };
  },
  actions: {
    async updateStackFromStorage(userId:User['id']) {
      const userStacks = await db.stacks.where({'user_id': userId}).first();
      if (userStacks) {
        this.$patch(state => {
          state.id = userStacks.id;
          state.items = userStacks.items;
          state.keys = new Set(userStacks.items.map(i => i.key));
          state.name = userStacks.name;
        });
      }
    },

    async create(user:User) {
      await db.stacks.add({
        id: this.id,
        user_id: user.id,
        name: this.name,
        items: toRaw(this.items),
      });
      this.$patch({
        user_id: user.id,
      });
    },

    async addItem(item:Work) {
      if (this.keys.has(item.key)) return;

      this.$patch((state) => {
        state.keys.add(item.key);
        state.items.unshift(item);
      });
      await db.stacks.where('id').equals(this.id).modify(s => {s.items.unshift(toRaw(item))});
    },

    async updateRank(indexFrom:number, indexTo:number) {
      return db.stacks.where('id').equals(this.id).modify(s => {
        [s.items[indexFrom], s.items[indexTo]] = [s.items[indexTo], s.items[indexFrom]];
      });
    },

    async removeItem(index:number) {
      return db.stacks.where('id').equals(this.id).modify(s => {s.items.splice(index, 1)});
    },

    logout() {
      this.$reset();
    }
  },
});