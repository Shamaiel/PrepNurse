export function lsGet(key, defaultValue = null) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export function lsSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    return true;
  } catch (e) {
    return false;
  }
}

export function lsRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {}
}
