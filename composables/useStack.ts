import { type Stack, type User} from "../db";
import { type Ref } from 'vue';

let stack:Stack;

export async function useStack(user:User) {
  return useLazyAsyncData<Stack|null>('stack', 
    async () => {
      if (user === null || user === null) return null;

      if (stack) {
        return stack;
      }

      stack = {
        id: self.crypto.randomUUID(),
        user_id: user.id,
        name: 'Read',
        items: []
      }
      return stack
    }, 
    { 
      server: false,
    }
  );
}