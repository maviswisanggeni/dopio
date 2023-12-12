import Vue from 'vue';

export function add(items, payload) {
  items.unshift(payload);
  return [...items];
}

export function findAndUpdate(items, payload) {
  const index = items.findIndex(item => item.id == payload.id);
  if (index < 0) return index;
  Vue.set(items, index, payload);
  return index;
}

export function findAndDelete(items, payload) {
  const index = items.findIndex(item => item.id == payload.id);
  if (index < 0) return index;
  items.splice(index, 1);
  return index;
}

export function chunk(items, size) {
  const res = [];
  for (var i = 0; i < items.length; i += size) res.push(items.slice(i, i + size));
  return res;
}
