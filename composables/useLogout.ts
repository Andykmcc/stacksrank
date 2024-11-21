export function useLogout() {
  const currentUser = useUsersStore();
  currentUser.logout();

  const currentStack = useStacksStore();
  currentStack.logout();
}