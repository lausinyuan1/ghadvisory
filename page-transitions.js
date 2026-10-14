// Navigation remains immediate; only the destination's arrival is animated.
(() => {
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const root = document.documentElement;
 const home = /(?:\/|\/index\.html)$/.test(location.pathname);
 const nativeTransitions = location.protocol !== 'file:' && 'CSSViewTransitionRule' in window;
 root.classList.add('page-arriving');
 if (home) root.classList.add('home-arrival');
 if (!nativeTransitions) root.classList.add('page-motion');
 let arrival;
 addEventListener('pageshow', event => {
  // Let anchor/history positions settle before enabling in-page smooth scrolling.
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('page-arriving')));
  if (!nativeTransitions && event.persisted && !motion.matches) {
   arrival = document.body.animate([{opacity:home ? .4 : .8},{opacity:1}],
    {duration:home ? 420 : 180,easing:'cubic-bezier(.22,1,.36,1)'});
  }
 });
 motion.addEventListener('change', () => { if (motion.matches) arrival?.cancel(); });
})();
