import { type Stack, type Work } from '../db';

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
    addItem(item:Work) {
      if (this.keys.has(item.key)) return;

      this.$patch((state) => {
        state.keys.add(item.key);
        state.items.push(item);
      });
    }
  },
});