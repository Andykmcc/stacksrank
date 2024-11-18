import { db, type Work, type User } from '../db';
import { toRaw } from 'vue';

export const useStacksStore = defineStore('stack', {
  state: () => {
    const currentUser = useUsersStore();
    return {
      id: self.crypto.randomUUID(),
      user_id: currentUser.id,
      name: 'Read',
      items: <Work[]>[],
      keys: new Set<string>(),
    };
  },
  actions: {
    async updateStackFromStorage(userId:User['id']) {
      const userStack = await db.stacks.where({'user_id': userId}).first();
      if (userStack) {
        this.$patch((state) => {
          state.id = userStack.id;
          state.items = userStack.items
          state.keys = new Set(userStack.items.map(i => i.key))
          state.name = userStack.name;
        });
      }
      else {
        await db.stacks.add({
          id: this.id,
          user_id: this.user_id,
          items: toRaw(this.items),
          name: this.name,
        });
      }
    },

    async addItem(item:Work) {
      if (this.keys.size === 0) {
        await requestPersistance();
      }
      if (this.keys.has(item.key)) return;

      this.$patch((state) => {
        state.keys.add(item.key);
        state.items.unshift(item);
      });
      try {
        await db.stacks.where('id').equals(this.id).modify(s => {s.items.unshift(toRaw(item))});
      }
      catch (error) {
        console.error(error);
      }
    },

    async updateRank(indexFrom:number, indexTo:number) {
      return db.stacks.where('id').equals(this.id).modify(s => {
        [s.items[indexFrom], s.items[indexTo]] = [s.items[indexTo], s.items[indexFrom]];
      });
    },

    async removeItem(index:number) {
      return db.stacks.where('id').equals(this.id).modify(s => {
        s.items.splice(index, 1);
      });
    }
  },
});