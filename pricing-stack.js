// Native sticky pricing cards on phones, with a small scroll-driven depth change.
(() => {
 const section=document.querySelector('.pricing');
 const grid=section?.querySelector('.price-grid');
 if(!grid)return;
 const cards=[...grid.querySelectorAll('.price-card')];
 const phone=matchMedia('(max-width:760px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,active=false;
 const clamp=n=>Math.max(0,Math.min(1,n));
 function render(){
  frame=0;if(!active)return;
  const rects=cards.map(card=>card.getBoundingClientRect());
  cards.forEach((card,i)=>{
   const next=rects[i+1];
   const top=parseFloat(card.style.getPropertyValue('--price-stack-top'))||0;
   const progress=next?clamp((innerHeight-next.top)/Math.max(1,innerHeight-top-20)):0;
   card.style.setProperty('--price-stack-scale',reduced.matches?1:1-.025*progress);
  });
 }
 function queue(){if(active&&!frame)frame=requestAnimationFrame(render)}
 function sync(){
  active=phone.matches;
  section.classList.toggle('pricing-stack',active);
  if(!active){cancelAnimationFrame(frame);frame=0;cards.forEach(card=>['--price-stack-top','--price-stack-scale','--price-stack-order'].forEach(p=>card.style.removeProperty(p)));return}
  const header=document.querySelector('.site-header');
  const tallest=Math.max(...cards.map(card=>card.offsetHeight));
  // Let tall cards scroll far enough upward for their buttons to remain reachable.
  const top=Math.min((header?.offsetHeight||78)+12,innerHeight-tallest-24-(cards.length-1)*20);
  cards.forEach((card,i)=>{
   card.style.setProperty('--price-stack-top',`${top+i*20}px`);
   card.style.setProperty('--price-stack-order',i+1);
  });render();
 }
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',sync,{passive:true});
 addEventListener('pageshow',sync);addEventListener('load',sync);
 phone.addEventListener('change',sync);reduced.addEventListener('change',sync);
 if(document.fonts)document.fonts.ready.then(sync);
 if('ResizeObserver' in window){const observer=new ResizeObserver(sync);cards.forEach(card=>observer.observe(card))}
 sync();
})();
