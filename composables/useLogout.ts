export function useLogout() {
  const currentUser = useUsersStore();
  currentUser.logout();

  reloadNuxtApp({
    path: '/',
  });
}