import { db, type User, type Stack, uuid} from "../db";
import { toRaw } from 'vue';

const localStorageKey = 'stacksrank-currentUserId';

export const useUsersStore = defineStore('user', {
  state: () => {
    return <User>{
      id: uuid.parse(undefined), // returns the default UUID defined in db.ts
      firstName: '',
      lastName: '',
    };
  },
  getters: {
    isRegistered: state => {
      return state.id !== uuid.parse(undefined);
    },
  },
  actions: {
    async fetchStoredUser() {
      const storedUserId = localStorage.getItem(localStorageKey) as User['id'] | null;

      if (storedUserId) {
        try {
          const storedUser = await db.users.get(storedUserId);
          if (storedUser) {
            this.$patch({
              id: storedUser.id,
              firstName: storedUser.firstName,
              lastName: storedUser.lastName,
            });
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

    login(user:User) {
      localStorage.setItem(localStorageKey, user.id);
      this.$patch({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      return this;
    },

    logout() {
      localStorage.setItem(localStorageKey, uuid.parse(undefined));
      this.$reset();
    }
  }
})