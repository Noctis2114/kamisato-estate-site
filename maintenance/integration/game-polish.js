/* Presentation only. Never changes game state, timers, cards, odds or storage. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (root.dataset.estatePolish) return;
  root.dataset.estatePolish = '1';
  root.dataset.estateInput = 'pointer';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const gameSelector = '.pavilion-game,.tea-room,.tea-game,.chess-game,.konpira-game,.matcha-game,.goban';
  const cards = '.poker-card,.bj-card,.bac-card,.tc-card,.cw-card,.pg-card,.vp-card,.gd-card,.sol-card';
  const active = new Map();
  const cardFaces = new WeakMap();
  function allowed(el) {
    return !reduced.matches && !document.hidden && !root.classList.contains('is-quiet') &&
      !el.closest('[data-still=true],[data-paused=true],[data-fx=still],[data-fxg=still],.is-still,.is-quiet,.is-frozen,[hidden],[inert]');
  }
  function settle(el) { active.get(el)?.cancel(); active.delete(el); }
  function cancelAll() { for (const animation of active.values()) animation.cancel(); active.clear(); }
  function animate(el, frames, duration = 180, delay = 0) {
    if (!el?.isConnected || !el.animate || !allowed(el)) return;
    settle(el);
    if (active.size >= 32) settle(active.keys().next().value);
    const animation = el.animate(frames, {duration, delay, easing: 'cubic-bezier(.2,.75,.25,1)'});
    active.set(el, animation);
    animation.finished.then(() => { if (active.get(el) === animation) active.delete(el); }, () => {});
  }
  function game(el) { return el?.closest?.(gameSelector); }
  function face(el) { return el.getAttribute('aria-label') || el.querySelector('img')?.getAttribute('alt') || ''; }
  function deal(el, order) {
    if (!game(el) || cardFaces.has(el)) return;
    cardFaces.set(el, face(el));
    // Existing authored dealing / flipping wins over this shared fallback.
    if (getComputedStyle(el).animationName !== 'none' || el.getAnimations?.().length) return;
    const transform = getComputedStyle(el).transform;
    const base = transform === 'none' ? '' : transform;
    animate(el, [{transform: `${base} translateY(-24px) rotate(-4deg)`, opacity:.25},
      {transform: base || 'none', opacity:1}], 300, Math.min(order, 5) * 35);
  }
  document.addEventListener('pointerdown', event => {
    root.dataset.estateInput = 'pointer';
    const target = event.composedPath().find(el => el?.matches?.('button,[role=button]'));
    if (!target || !game(target) || target.disabled || target.getAttribute('aria-disabled') === 'true') return;
    const transform = getComputedStyle(target).transform;
    const base = transform === 'none' ? '' : transform;
    animate(target, [{transform:base || 'none'}, {transform:`${base} scale(.985)`}, {transform:base || 'none'}], 140);
  }, true);
  document.addEventListener('keydown', event => {
    // Game arrows/space must not turn a passive heading into a selected box.
    if (event.key === 'Tab') root.dataset.estateInput = 'keyboard';
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAll(); });
  reduced.addEventListener?.('change', () => { if (reduced.matches) cancelAll(); });
  const observer = new MutationObserver(records => {
    const arrivals = new Set();
    for (const record of records) {
      const el = record.target;
      if (record.type === 'attributes') {
        if (record.attributeName === 'data-paused' && el.getAttribute('data-paused') === 'true') {
          for (const target of active.keys()) if (el.contains(target)) settle(target);
        }
        if (!game(el)) continue;
        if (record.attributeName === 'aria-pressed' && el.getAttribute('aria-pressed') === 'true') {
          animate(el, [{opacity:.72},{opacity:1}], 160);
        }
        if (record.attributeName === 'aria-label' && el.matches?.(cards)) {
          const before = cardFaces.get(el), after = face(el);
          cardFaces.set(el, after);
          if (before && before !== after && !el.getAnimations?.().length) {
            animate(el, [{opacity:.35},{opacity:1}], 220);
          }
        }
      } else {
        for (const node of record.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches(cards)) arrivals.add(node);
          node.querySelectorAll(cards).forEach(card => arrivals.add(card));
          if (game(node) && node.matches('[role=status],.game-result,.bj-result,.poker-notice,.tc-notice,.cw-notice,.pg-notice')) {
            animate(node, [{opacity:.45},{opacity:1}], 220);
          }
        }
      }
    }
    let order = 0;
    for (const card of arrivals) deal(card, order++);
    for (const target of active.keys()) if (!target.isConnected) settle(target);
  });
  observer.observe(document.body, {subtree:true,childList:true,attributes:true,
    attributeFilter:['aria-pressed','aria-label','data-paused']});
  document.querySelectorAll(cards).forEach((card, order) => deal(card, order));
})();
