export const useUsersStore = defineStore('user', {
  state: () => ({id: self.crypto.randomUUID()}),
})