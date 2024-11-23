import { db, type User } from "../db";
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
    unregisteredUserId: () => {
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

      const newUser = <User>{
        id: unregisteredId,
        firstName: '',
        lastName: '',
        defaultStackId: unregisteredId,
      }
      localStorage.setItem(localStorageKey, JSON.stringify(newUser.id));
      await db.users.put(newUser);
      this.id = newUser.id;
      this.firstName = newUser.firstName;
      this.lastName = newUser.lastName;
      this.defaultStackId = newUser.defaultStackId;
    },
    async createUser(userFormData:User) {
      // create the users unique ID
      const newUserId = self.crypto.randomUUID();
      // save new users to DB
      try {
        await db.users.add({...toRaw(userFormData), ...{id: newUserId}});
      } catch (error) {
        console.error(`could not save new used to DB. ${error}`);
        throw error;
      }
      
      try {
        // update the "current user" ref in localstorage
        localStorage.setItem(localStorageKey, JSON.stringify({
          id: newUserId,
        }));
      } catch (error) {
        console.error(`could not update localstorage with current user. ${error}`);
        throw error;
      }
      
      try {
        // update the pinia store with new user data
        this.$patch({
          id: newUserId,
          firstName: userFormData.firstName,
          lastName: userFormData.lastName,
        });
      } catch (error) {
        console.error(`could not reset UserStore, ${error}`);
        throw error
      }
    },
    login(user:User) {
      localStorage.setItem(localStorageKey, user.id);
      this.$patch({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        defaultStackId: user.defaultStackId,
      });
    },

    logout() {
      localStorage.removeItem(localStorageKey);
      this.$reset();
    }
  }
})