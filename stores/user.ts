import { db, type User } from "../db";

export const useUsersStore = defineStore('user', {
  state: () => {
    const storedUserId = localStorage.getItem('stacksrank-currentUserId');
    if (storedUserId) {
      return <User>{
        id: storedUserId
      }
    } else {
      const newUserId = self.crypto.randomUUID();
      localStorage.setItem('stacksrank-currentUserId', newUserId);
      return <User>{
        id: newUserId
      };
    }
  },
})