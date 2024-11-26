export async function useLogout() {
  const currentUser = useUsersStore();
  const currentStacks = useStacksStore();
  
  currentUser.logout();
  currentStacks.logout();

  await navigateTo('/');
}