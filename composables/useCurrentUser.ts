import { type User} from "../db";

async function createNewUser(): Promise<User> {
  const newUser = {
    id: self.crypto.randomUUID(),
  };
  return newUser;
}

async function getUser(id: User["id"]): Promise<User> {
  return createNewUser();
}

export function useAsyncCurrentUser() {
  return useAsyncData('currentAsyncUser', async () => {
    const currentUserKey = await db.shortcuts.get('_currentUserId');
    if (currentUserKey === undefined) {
      return createNewUser();
    }
    return getUser(currentUserKey.value);
  }, {
    server: false,
    lazy: true,
  });
}