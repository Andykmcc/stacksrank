export async function useLogout() {
  const currentUser = useUsersStore();
  const currentStack = useStacksStore();
  
  currentUser.logout();
  currentStack.logout();

  await navigateTo('/');
}