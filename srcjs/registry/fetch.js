import { getHash, getRegistry, setHash, setRegistry } from "./storage";
// this is so we only ping the hash once per session
// this should be switched off soon when we have a reactive registry
let pinged_hash = false;

export const fetchFactory = (params) => {
  async function fetchHash() {
    if (pinged_hash) {
      return new Promise((resolve) => resolve(getHash()));
    }

    return fetch(params.hash)
      .then((response) => response.json())
      .then((data) => {
        pinged_hash = true;
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
