export const getData = (storageKey) => {
  const saved = localStorage.getItem(storageKey);
  const initialValue = JSON.parse(saved);
  return initialValue || "";
};
