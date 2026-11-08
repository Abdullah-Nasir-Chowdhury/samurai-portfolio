import { useCallback, useEffect, useSyncExternalStore } from 'react';

// One chibi toast on screen at a time, none while a modal (the omikuji) is open.
// Toasts ask for a turn with request(); the one whose turn it is shows, the rest wait.
//   request(id, { front, ttlMs }) — front jumps the queue; ttlMs drops it if it waited too long
//   release(id)                   — the toast closed, so the next one can go after a short gap
//   block() / unblock()           — while blocked nothing shows; a toast that was up is put back first in line

const GAP_MS = 700;
let active = null;
let queue = [];
let blocks = 0;
let gapUntil = 0;
let timer = 0;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

function pump() {
  clearTimeout(timer);
  if (active || blocks > 0) return;
  const now = Date.now();
  queue = queue.filter((q) => !q.expires || q.expires > now);
  if (!queue.length) return;
  if (now < gapUntil) { timer = setTimeout(pump, gapUntil - now); return; }
  active = queue.shift().id;
  emit();
}

export function request(id, { front = false, ttlMs = 0 } = {}) {
  if (active === id || queue.some((q) => q.id === id)) return;
  const item = { id, expires: ttlMs ? Date.now() + ttlMs : 0 };
  if (front) queue.unshift(item); else queue.push(item);
  pump();
}

export function release(id) {
  queue = queue.filter((q) => q.id !== id);
  if (active !== id) return;
  active = null;
  gapUntil = Date.now() + GAP_MS;
  emit();
  pump();
}

export function block() {
  blocks += 1;
  if (active) { queue.unshift({ id: active, expires: 0 }); active = null; emit(); }
}

export function unblock() {
  blocks = Math.max(0, blocks - 1);
  gapUntil = Date.now() + GAP_MS;
  pump();
}

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
const snapshot = () => active;

// [isMyTurn, ask, done] for one toast
export function useToastTurn(id) {
  const current = useSyncExternalStore(subscribe, snapshot, snapshot);
  const ask = useCallback((opts) => request(id, opts), [id]);
  const done = useCallback(() => release(id), [id]);
  return [current === id, ask, done];
}

// Holds every toast back while `on` is true (e.g. while a modal is open)
export function useToastBlock(on) {
  useEffect(() => {
    if (!on) return;
    block();
    return unblock;
  }, [on]);
}
