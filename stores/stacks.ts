import { db, type User, type Stack, type Work, uuid } from '../db';

export const useStacksStore = defineStore('stacks', {
  state: () => {
    return {
      list: <Stack[]>[{
        id: uuid.parse(undefined),
        name: 'To Read',
        user_id: uuid.parse(undefined),
        isDefault: true,
        items: [],
      }]
    };
  },
  actions: {
    async getByUser(userId:User['id']) {
      await db.transaction('rw', [db.stacks], async () => {
        const stacks = await db.stacks.where('user_id').equals(userId).reverse().sortBy('isDefault');
        // non-logged in user
        // logged in user
        if (stacks.length) {
          this.$patch((state) => {
            state.list = stacks;
          });
          return;
        }
        // first time visit
        await db.stacks.add(toRaw(this.list[0]));
      });
    },

    async moveGeneralStackToUser(stackName:string, userId:User['id'], items:Work[]) {
      const newStack = <Stack>{
        id: self.crypto.randomUUID(),
        user_id: userId,
        isDefault: true,
        name: stackName,
        items: toRaw(items),
      };
      await db.transaction('rw', db.stacks, async () => {
        await db.stacks.add(newStack);
        await db.stacks.update(uuid.parse(undefined), {items: []});
      })

      this.$patch({
        list: [newStack]
      });
    },

    async create(stackName:string, userId:User['id'], isDefault = false, items = <Work[]>[]) {
      const newStack = <Stack>{
        id: userId === uuid.parse(undefined) ? uuid.parse(undefined) : self.crypto.randomUUID(),
        user_id: userId,
        isDefault,
        name: stackName,
        items: toRaw(items),
      };
      await db.stacks.add(newStack);
      if (isDefault) {
        await this.setDefaultStack(userId, newStack.id);
      }
      this.$patch(s => s.list.push(newStack));
    },

    async setDefaultStack(userId:User['id'], stackId:Stack['id']) {
      await db.transaction('rw', db.stacks, async () => {
        await db.stacks.where(['user_id']).equals(userId).modify(s => s.isDefault = false);
        await db.stacks.update(stackId, {isDefault: true});
      });
      this.$patch((stackState) => {
        stackState.list.forEach(s => {
          s.isDefault = (s.id === stackId);
        })
      })
    },

    async remove(stackId:Stack['id']) {
      const index = this.list.findIndex(s => s.id === stackId);
      if (index === -1) return;

      const stack = this.list[index];
      await db.stacks.delete(stack.id);
      this.$patch(s => s.list.splice(index, 1));
    },

    async addItemToStack(item:Work, stackId:Stack['id']|null = null) {
      let stack;

      if (stackId) {
        stack = this.list.find(s => s.id === stackId);
      } else {
        stack = this.list.find(s => s.isDefault);
      }

      if (!stack) return;
      if (stack.items.some(i => i.id === stackId)) return;

      await db.stacks.where('id').equals(stack.id).modify(s => {s.items.unshift(toRaw(item))});
      this.$patch(state => {
        const s = state.list.find(s => s.id === stack.id);
        if (s) {
          s.items.unshift(item);
        }
      });
    },

    async updateRank(stackId:Stack['id'], indexFrom:number, indexTo:number) {
      return db.stacks.where('id').equals(stackId).modify(s => {
        [s.items[indexFrom], s.items[indexTo]] = [s.items[indexTo], s.items[indexFrom]];
      });
    },

    async removeItem(stackId:Stack['id'], index:number) {
      await db.stacks.where('id').equals(stackId).modify(s => {s.items.splice(index, 1)});
      this.$patch((state) => {
        const stack = state.list.find((s) => s.id === stackId);
        if (stack) {
          stack.items.splice(index, 1);
        }
      });
    },

    logout() {
      this.$reset();
    }
  },
});