import { getHash, getRegistry, setHash, setRegistry } from "./storage";

export const fetchFactory = (params) => {
  async function fetchHash() {
    return fetch(params.hash)
      .then((response) => response.json())
      .then((data) => {
        return data.hash;
      });
  }

  async function fetchRegistry() {
    return fetch(params.registry)
      .then((response) => response.json())
      .then((data) => {
        setRegistry(data.registry);
        setHash(data.hash);
        return data.registry;
      });
  }

  async function fetchLeast() {
    return fetchHash().then((hash) => {
      if (getHash() === hash) {
        return new Promise((resolve) => resolve(getRegistry()));
      }

      return fetchRegistry();
    });
  }

  return {
    fetchHash: fetchHash,
    fetchRegistry: fetchRegistry,
    fetchLeast: fetchLeast,
  };
};
