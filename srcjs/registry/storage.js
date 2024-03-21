const HASH = "BLOCKR.HASH";
const REGISTRY = "BLOCKR.REGISTRY";

export const setRegistry = (registry) => {
  if (registry === undefined) throw new Error("Registry is undefined");

  localStorage.setItem(REGISTRY, JSON.stringify(registry));
};

export const setHash = (hash) => {
  if (hash === undefined) throw new Error("Hash is undefined");

  localStorage.setItem(HASH, hash);
};

export const getRegistry = () => {
  return JSON.parse(localStorage.getItem(REGISTRY));
};

export const getHash = () => {
  return localStorage.getItem(HASH);
};
