/* Wind-chime interaction only. No theme, routing or fullscreen ownership. */
(() => {
  'use strict';
  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const garden = target.closest('.windchime-garden.is-display');
    if (!garden || garden.dataset.ayaka === 'windchime-preview') return;
    if (target.closest('button,a,input,select,textarea,[role="dialog"]:not(.windchime-garden)')) return;
    // Use the room's own reveal action so its keyboard focus is restored too.
    garden.querySelector('.windchime-reveal')?.click();
  });
})();
