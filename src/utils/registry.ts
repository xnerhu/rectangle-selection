import store from '~/store';

export const getRegistryItems = () => {
  const registry = store.currentRegistry;

  return [...registry?.map.values()];
};
