/**
 * Mimi - Storage helpers (localStorage)
 * Lightweight settings & last-state persistence
 */
const MimiStorage = (() => {
  const PREFIX = 'mimi_';

  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {}
  }

  function getLastSection() {
    return get('lastSection', 'home');
  }

  function setLastSection(section) {
    set('lastSection', section);
  }

  function getFavorites() {
    return get('favorites', []);
  }

  function toggleFavorite(id) {
    const favs = getFavorites();
    const idx = favs.indexOf(id);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push(id);
    set('favorites', favs);
    return favs;
  }

  return {
    get,
    set,
    remove,
    getLastSection,
    setLastSection,
    getFavorites,
    toggleFavorite
  };
})();
