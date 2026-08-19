const STORAGE_KEY = "chronos:evento-drafts";

const readDrafts = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const getEventoDraft = (id) => readDrafts()[String(id)] || {};

export const saveEventoDraft = (id, data) => {
  if (!id) return;
  const drafts = readDrafts();
  drafts[String(id)] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
};

export const removeEventoDraft = (id) => {
  const drafts = readDrafts();
  delete drafts[String(id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
};
