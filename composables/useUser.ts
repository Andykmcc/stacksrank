import { type User} from "../db";
import { type Ref } from 'vue';

let user:User

export async function useUser() {
  return useLazyAsyncData('user', 
    async () => {
      if (user) {
        return user;
      }
      user = {id: self.crypto.randomUUID()};
      return user;
    }, 
    { 
      server: false,
    }
  );
}