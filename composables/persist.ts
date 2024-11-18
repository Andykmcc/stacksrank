export async function requestPersistance() {
  if (navigator.storage && navigator.storage.persist) {
    try {
      await navigator.storage.persist();
    } catch (error) {
      console.warn(`persistence denied`);
    }
  }
}