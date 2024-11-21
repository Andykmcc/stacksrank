import { db, type User } from "../db";
import { toRaw } from 'vue';

const unregisteredId = "00000000-0000-4000-9800-000000000000";

export const useUsersStore = defineStore('user', {
  state: () => {
    const storedUser = localStorage.getItem('stacksrank-currentUser');

    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch (error) {
        console.warn(`could not parse stored current user.`);
        localStorage.removeItem('stacksrank-currentUser');
      }
    }

    const newUser = <User>{
      id: unregisteredId,
      firstName: '',
      lastName: '',
    }
    localStorage.setItem('stacksrank-currentUser', JSON.stringify(newUser));
    return newUser;
  },
  getters: {
    registered: state => {
      return state.id !== unregisteredId;
    },
    unregisteredUserId: () => {
      return unregisteredId;
    }
  },
  actions: {
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
        localStorage.setItem('stacksrank-currentUser', JSON.stringify({
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
    async updateFromStore() {
      const storedUser = await db.users.get(this.id);
      if (!storedUser) return;
      this.firstName = storedUser.firstName;
      this.lastName = storedUser.lastName;
    },
    login(user:User) {
      localStorage.setItem('stacksrank-currentUser', JSON.stringify({
        id: user.id,
      }));
      this.$patch({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    },

    logout() {
      localStorage.removeItem('stacksrank-currentUser');
      this.$reset();
    }
  }
})