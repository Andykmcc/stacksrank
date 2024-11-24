import { db, type User, type Stack } from "../db";
import { toRaw } from 'vue';

export const unregisteredId = "00000000-0000-4000-9800-000000000000";
const localStorageKey = 'stacksrank-currentUserId';

export const useUsersStore = defineStore('user', {
  state: () => {
    return <User>{
      id: unregisteredId,
      firstName: '',
      lastName: '',
      defaultStackId: unregisteredId,
    };
  },
  getters: {
    isRegistered: state => {
      return state.id !== unregisteredId;
    },
    unregisteredId: () => {
      return unregisteredId;
    }
  },
  actions: {
    async fetchStoredUser() {
      const storedUserId = localStorage.getItem(localStorageKey) as User['id'] | null;

      if (storedUserId) {
        try {
          const storedUser = await db.users.get(storedUserId);
          if (storedUser) {
            this.id = storedUser.id;
            this.firstName = storedUser.firstName;
            this.lastName = storedUser.lastName;
            this.defaultStackId = storedUser.defaultStackId;
            return;
          }
        } catch (error) {
          console.warn(`could not parse stored current user.`);
          localStorage.removeItem(localStorageKey);
        }
      }

      await db.users.put({
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        defaultStackId: this.defaultStackId,
      });
      localStorage.setItem(localStorageKey, this.id);
    },
    
    async createUser(userFormData:User) {
      // create the users unique ID
      const newUserId = self.crypto.randomUUID();
      // save new users to DB
      await db.users.add({...toRaw(userFormData), ...{id: newUserId}});
      // update the "current user" ref in localstorage
      localStorage.setItem(localStorageKey, newUserId);
      // update the pinia store with new user data
      this.$patch({
        id: newUserId,
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
      });
    },
    
    async setDefaultStack(stackId:Stack['id']) {
      await db.users.update(this.id, {defaultStackId: stackId});
      this.$patch({
        defaultStackId: stackId,
      });
    },

    login(user:User) {
      localStorage.setItem(localStorageKey, user.id);
      this.$patch({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        defaultStackId: user.defaultStackId,
      });
      return this;
    },

    logout() {
      localStorage.setItem(localStorageKey, unregisteredId);
      this.$reset();
    }
  }
})