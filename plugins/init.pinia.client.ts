export default defineNuxtPlugin(async () => {
  const usersStore = useUsersStore();
  await useAsyncData('user', async () => usersStore.fetchStoredUser());
  const stacksStore = useStacksStore();
  await useAsyncData('stack', async () => stacksStore.updateStackFromStorage(usersStore.id));
});