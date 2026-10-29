// Mobile-only pinned service scenes. Native scroll drives each reveal and hand-off.
(() => {
 const section=document.querySelector('#services');
 if(!section)return;
 const grid=section.querySelector('.service-grid');
 const cards=[...grid.querySelectorAll('.service-card')];
 const phone=matchMedia('(max-width:760px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const track=document.createElement('div');track.className='service-scenes-track';
 const original=cards.map(card=>[...card.childNodes]);
 let mounted=false,enabled=false,frame=0;
 const clamp=n=>Math.max(0,Math.min(1,n));
 const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
 function render(){
  frame=0;if(!enabled)return;
  const bounds=track.getBoundingClientRect();
  const distance=track.offsetHeight-grid.offsetHeight;
  const position=clamp(-bounds.top/Math.max(1,distance))*cards.length;
  cards.forEach((card,i)=>{
   const phase=card.contains(document.activeElement)? .78:position-i;
   const entry=ease(phase/.08);
   const exit=i===cards.length-1?0:ease((phase-.94)/.06);
   const expand=ease((phase-.18)/.26);
   const intro=entry*(1-ease((phase-.44)/.10));
   const detail=ease((phase-.54)/.10);
   const travel=ease((phase-.66)/.22);
   const width=grid.clientWidth,height=grid.clientHeight;
   const small=Math.min(width*.64,320,height*.38);
   const photoWidth=small+(width-32-small)*expand;
   const photoHeight=small+(height-116-small)*expand;
   const photoTop=(height*.52-small/2)*(1-expand)+94*expand;
   const props={
    '--scene-opacity':entry*(1-exit),'--scene-rise':`${-exit*35}px`,
    '--photo-width':`${photoWidth}px`,'--photo-height':`${photoHeight}px`,'--photo-top':`${photoTop}px`,
    '--intro-light':`${expand*100}%`,'--intro-opacity':intro,'--intro-rise':`${(1-entry)*30}px`,
    '--intro-description-top':`${height*.52+small/2-4}px`,
    '--detail-opacity':detail,'--detail-top':`${Math.min(height*.70,height-card.querySelector('.service-scene-details').offsetHeight-40)*(1-travel)+height*.22*travel}px`
   };
   Object.entries(props).forEach(([key,value])=>card.style.setProperty(key,value));
   const photo=card.querySelector('.service-photo');
   // Each service now has its own full-frame photo; preserve aspect ratio at every stage.
   photo.style.backgroundSize='cover';
   photo.style.backgroundPosition='center';
   card.style.pointerEvents=entry*(1-exit)>.5?'auto':'none';
   const cue=grid.querySelector(`[data-scene="${i}"]`);
   cue.style.opacity=intro;
   cue.style.setProperty('--intro-light',`${expand*100}%`);
   cue.style.top=`${height*.52+small/2+card.querySelector('.service-scene-intro').offsetHeight+32}px`;
   cue.style.visibility=intro>.05?'visible':'hidden';
   cue.style.pointerEvents=intro>.5?'auto':'none';
  });
 }
 function queue(){if(enabled&&!frame)frame=requestAnimationFrame(render)}
 function sync(){
  const mobile=phone.matches;
  if(mobile&&!mounted){
   grid.before(track);track.append(grid);
   cards.forEach((card,index)=>{
    const visual=document.createElement('div');visual.className='service-scene-visual';
    const photo=card.querySelector('.service-photo'),title=card.querySelector('h3');
    title.before(visual);visual.append(photo,title);
    const image=photo.querySelector('img');
    photo.style.backgroundImage=`url("${image.getAttribute('src')}")`;
    photo.style.backgroundPosition='center';
    const intro=card.querySelector('p:not(.eyebrow)').cloneNode(true);
    intro.className='service-scene-intro';intro.setAttribute('aria-hidden','true');card.append(intro);
    const label=card.querySelector('.eyebrow').cloneNode(true);label.className='service-scene-label';label.setAttribute('aria-hidden','true');card.append(label);
    const cue=document.createElement('button');cue.type='button';cue.className='service-scroll-cue';cue.dataset.scene=index;
    cue.setAttribute('aria-label',`Continue to ${title.textContent.trim()} details`);
    cue.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3v17M5 13l7 7 7-7"/></svg>';
    cue.addEventListener('click',()=>{const top=track.getBoundingClientRect().top+scrollY;window.scrollTo({top:top+(index+.67)/cards.length*(track.offsetHeight-grid.offsetHeight),behavior:reduced.matches?'instant':'smooth'})});
    grid.append(cue);
    const details=document.createElement('div');details.className='service-scene-details';
    details.append(card.querySelector('.eyebrow'),card.querySelector('p:not(.eyebrow):not(.service-scene-intro)'),card.querySelector('.card-link'));card.append(details);
    const detailTitle=title.cloneNode(true);detailTitle.className='service-detail-title';detailTitle.setAttribute('aria-hidden','true');details.querySelector('.eyebrow').after(detailTitle);
   });mounted=true;
  }else if(!mobile&&mounted){
   cards.forEach((card,i)=>{card.querySelector('.service-photo').removeAttribute('style');card.replaceChildren(...original[i])});
   grid.querySelectorAll('.service-scroll-cue').forEach(cue=>cue.remove());
   track.before(grid);track.remove();mounted=false;
  }
  enabled=mobile&&!reduced.matches;
  section.classList.toggle('service-cinema',mobile);
  section.classList.toggle('service-cinema-motion',enabled);
  cards.forEach(card=>{card.style.removeProperty('pointer-events');['--scene-opacity','--scene-rise','--photo-width','--photo-height','--photo-top','--intro-opacity','--intro-rise','--intro-description-top','--detail-opacity','--detail-top'].forEach(p=>card.style.removeProperty(p))});
  if(enabled)render();else{cancelAnimationFrame(frame);frame=0}
 }
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});
 addEventListener('pageshow',queue);addEventListener('load',queue);
 if(document.fonts)document.fonts.ready.then(queue);
 section.addEventListener('focusin',event=>{
  if(!enabled)return;
  const i=cards.findIndex(card=>card.contains(event.target));
  if(i>=0){const top=track.getBoundingClientRect().top+scrollY;window.scrollTo({top:top+(i+.78)/cards.length*(track.offsetHeight-grid.offsetHeight),behavior:'instant'});render()}
 });
 section.addEventListener('focusout',queue);
 phone.addEventListener('change',sync);reduced.addEventListener('change',sync);sync();
})();
