const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
let menuAnimation=null;
const menuMotion=matchMedia('(prefers-reduced-motion: reduce)');
function setMenu(open){
 const mobile=matchMedia('(max-width:760px)').matches;
 const showing=nav.classList.contains('is-open');
 const computed=getComputedStyle(nav);
 const start={height:showing?`${nav.getBoundingClientRect().height}px`:'0px',opacity:showing?computed.opacity:'0',paddingTop:showing?computed.paddingTop:'0px',paddingBottom:showing?computed.paddingBottom:'0px'};
 if(menuAnimation){menuAnimation.onfinish=null;menuAnimation.cancel();menuAnimation=null;}
 menu.setAttribute('aria-expanded',String(open));nav.inert=mobile&&!open;
 if(!mobile||menuMotion.matches){nav.classList.toggle('is-open',mobile&&open);return;}
 nav.classList.add('is-open');
 const natural=getComputedStyle(nav);
 const end=open?{height:`${nav.getBoundingClientRect().height}px`,opacity:'1',paddingTop:natural.paddingTop,paddingBottom:natural.paddingBottom}:{height:'0px',opacity:'0',paddingTop:'0px',paddingBottom:'0px'};
 const animation=nav.animate([start,end],{duration:420,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
 menuAnimation=animation;
 animation.onfinish=()=>{if(menuAnimation!==animation)return;nav.classList.toggle('is-open',open);menuAnimation=null;animation.cancel();};
}
function closeMenu(){setMenu(false);}
nav.inert=matchMedia('(max-width:760px)').matches;
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
menuMotion.addEventListener('change',()=>{if(menuMotion.matches)setMenu(menu.getAttribute('aria-expanded')==='true');});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
window.matchMedia('(min-width: 761px)').addEventListener('change',()=>closeMenu());
const prices={20:[799,899],30:[899,999],40:[999,1099],50:[1199,1399],60:[1399,1599],70:[1599,1799]};
const size=document.querySelector('#headcount');
if(size){const update=()=>{const [a,b]=prices[size.value];document.querySelector('#price-a').textContent=a.toLocaleString('en-MY');document.querySelector('#price-b').textContent=b.toLocaleString('en-MY');document.querySelectorAll('[data-plan]').forEach(link=>{link.href='mailto:hr@gh-advisory.com?subject='+encodeURIComponent(link.dataset.plan+' enquiry — up to '+size.value+' employees');});};size.addEventListener('change',update);update();}
document.querySelector('#year').textContent=new Date().getFullYear();

const carousel=document.querySelector('.hero-carousel');
if(carousel){
 const slides=[...carousel.querySelectorAll('.hero-slide')];
 const play=carousel.querySelector('.carousel-play');
 const indicators=[...carousel.querySelectorAll('.carousel-indicator')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0, paused=reduced.matches, hovering=false, visible=true, timer, startX=null, startY=null;
 function schedule(){clearInterval(timer);if(!paused&&!hovering&&visible&&!document.hidden)timer=setInterval(()=>show(current+1),6500);}
 function show(index){current=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{slide.hidden=i!==current;slide.classList.toggle('is-active',i===current);});indicators.forEach((button,i)=>{button.classList.toggle('active',i===current);button.setAttribute('aria-pressed',String(i===current));});schedule();}
 function setPaused(value){paused=value;play.textContent=paused?'Play slideshow':'Pause slideshow';play.setAttribute('aria-label',paused?'Start automatic rotation':'Pause automatic rotation');carousel.querySelector('.carousel-slides').setAttribute('aria-live',paused?'polite':'off');schedule();}
 indicators.forEach((button,i)=>button.addEventListener('click',()=>{setPaused(true);show(i);}));
 play.addEventListener('click',()=>setPaused(!paused));
 carousel.addEventListener('mouseenter',()=>{hovering=true;schedule();});
 carousel.addEventListener('mouseleave',()=>{hovering=false;schedule();});
 carousel.addEventListener('focusin',e=>{if(e.target!==play)setPaused(true);});
 carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setPaused(true);show(current+(e.key==='ArrowRight'?1:-1));if(indicators.includes(document.activeElement))indicators[current].focus();}});
 carousel.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;startY=e.changedTouches[0].clientY;},{passive:true});
 carousel.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)){setPaused(true);show(current+(dx<0?1:-1));}startX=null;},{passive:true});
 document.addEventListener('visibilitychange',schedule);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.15}).observe(carousel);
 reduced.addEventListener('change',e=>{if(e.matches)setPaused(true);});
 setPaused(paused);
}

// Animate measured heights so both expansion and collapse remain fluid.
const animatedPanels=[...document.querySelectorAll('details')];
const accordionMotion=matchMedia('(prefers-reduced-motion: reduce)');
const accordionStates=new Map();
animatedPanels.forEach((panel,index)=>{
 const summary=panel.querySelector('summary');
 const content=document.createElement('div');
 content.className=panel.closest('.faq-list')?'faq-panel-content':panel.closest('.industry-options')?'industry-panel-content':'expandable-content';content.id=`accordion-content-${index}`;
 while(summary.nextSibling)content.append(summary.nextSibling);
 panel.append(content);
 // Native exclusive groups close immediately; the enhanced controller animates closing.
 panel.removeAttribute('name');
 summary.setAttribute('aria-controls',content.id);
 summary.setAttribute('aria-expanded',String(panel.open));
 accordionStates.set(panel,{expanded:panel.open,animation:null,summary,content});
 panel.classList.toggle('is-expanded',panel.open);
 content.inert=!panel.open;
 summary.addEventListener('click',event=>{
  event.preventDefault();
  const expand=!accordionStates.get(panel).expanded;
  if(expand&&panel.closest('.industry-options'))animatedPanels.forEach(other=>{if(other!==panel&&other.parentElement===panel.parentElement&&accordionStates.get(other).expanded)animatePanel(other,false);});
  animatePanel(panel,expand);
 });
});
function finishPanel(panel,state){
 state.animation=null;panel.open=state.expanded;panel.style.height='';panel.style.overflow='';
}
function animatePanel(panel,expanded){
 const state=accordionStates.get(panel);
 const start=panel.getBoundingClientRect().height;
 if(state.animation){state.animation.onfinish=null;state.animation.cancel();state.animation=null;}
 state.expanded=expanded;
 state.summary.setAttribute('aria-expanded',String(expanded));
 state.content.inert=!expanded;
 panel.classList.toggle('is-expanded',expanded);
 if(accordionMotion.matches){finishPanel(panel,state);return;}
 panel.style.height='';panel.open=true;
 const box=getComputedStyle(panel);
 const border=['borderTopWidth','borderBottomWidth','paddingTop','paddingBottom'].reduce((sum,key)=>sum+(parseFloat(box[key])||0),0);
 const end=expanded?panel.getBoundingClientRect().height:state.summary.getBoundingClientRect().height+border;
 panel.style.height=`${start}px`;panel.style.overflow='hidden';
 const animation=panel.animate([{height:`${start}px`},{height:`${end}px`}],{
  duration:420,easing:'cubic-bezier(0.4, 0, 0.2, 1)',fill:'forwards'
 });
 state.animation=animation;
 animation.onfinish=()=>{
  if(state.animation!==animation)return;
  finishPanel(panel,state);animation.cancel();
 };
}
function settleAnimatedPanels(){
 accordionStates.forEach((state,panel)=>{
  if(state.animation){state.animation.onfinish=null;state.animation.cancel();finishPanel(panel,state);}
 });
}
window.addEventListener('resize',settleAnimatedPanels);
accordionMotion.addEventListener('change',()=>{if(accordionMotion.matches)settleAnimatedPanels();});

// A one-time, restrained spring accent. Text is always visible without JavaScript.
const timelineDate=document.querySelector('.timeline-date');
if(timelineDate){
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let entrance=null;
 const observer=new IntersectionObserver(entries=>{
  if(!entries.some(entry=>entry.isIntersecting))return;
  observer.disconnect();
  if(motion.matches)return;
  entrance=timelineDate.animate([
   {transform:'translateY(12px) scale(.96)',offset:0},
   {transform:'translateY(-3px) scale(1.025)',offset:.55},
   {transform:'translateY(1px) scale(.996)',offset:.8},
   {transform:'translateY(0) scale(1)',offset:1}
  ],{duration:780,easing:'cubic-bezier(.35,0,.2,1)'});
 },{threshold:.7});
 observer.observe(timelineDate);
 motion.addEventListener('change',event=>{if(event.matches&&entrance)entrance.cancel();});
}

// Enhanced team-size select: animated listbox with native-select fallback.
if(size){
 const host=document.createElement('div');host.className='team-select';
 const label=document.querySelector('label[for="headcount"]');label.id='team-size-label';label.htmlFor='team-size-trigger';
 const trigger=document.createElement('button');trigger.type='button';trigger.id='team-size-trigger';trigger.className='team-select-trigger';
 trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','team-size-options');trigger.setAttribute('aria-labelledby','team-size-label team-size-value');
 trigger.innerHTML='<span id="team-size-value"></span><svg aria-hidden="true" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"/></svg>';
 const popup=document.createElement('div');popup.className='team-select-popup';popup.inert=true;
 const clip=document.createElement('div');clip.className='team-select-clip';
 const list=document.createElement('div');list.id='team-size-options';list.className='team-select-options';list.setAttribute('role','listbox');list.setAttribute('aria-labelledby','team-size-label');
 const options=[...size.options];let open=false,active=size.selectedIndex;
 const rows=options.map((option,i)=>{const row=document.createElement('div');row.id=`team-option-${i}`;row.className='team-select-option';row.setAttribute('role','option');row.textContent=option.textContent;row.addEventListener('pointerdown',e=>e.preventDefault());row.addEventListener('click',()=>choose(i));list.append(row);return row;});
 clip.append(list);popup.append(clip);host.append(trigger,popup);size.after(host);size.hidden=true;
 function render(){trigger.querySelector('#team-size-value').textContent=options[size.selectedIndex].textContent;rows.forEach((row,i)=>{row.setAttribute('aria-selected',String(i===size.selectedIndex));row.classList.toggle('is-active',i===active);});}
 function highlight(i){active=Math.max(0,Math.min(rows.length-1,i));render();trigger.setAttribute('aria-activedescendant',rows[active].id);const row=rows[active];if(row.offsetTop<list.scrollTop)list.scrollTop=row.offsetTop;else if(row.offsetTop+row.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=row.offsetTop+row.offsetHeight-list.clientHeight;}
 function toggle(value){open=value;host.classList.toggle('is-open',open);trigger.setAttribute('aria-expanded',String(open));popup.inert=!open;if(open){active=size.selectedIndex;highlight(active);}else trigger.removeAttribute('aria-activedescendant');}
 function choose(i){size.value=options[i].value;active=i;size.dispatchEvent(new Event('change',{bubbles:true}));toggle(false);trigger.focus({preventScroll:true});}
 trigger.addEventListener('click',()=>toggle(!open));
 trigger.addEventListener('keydown',e=>{
  if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();if(!open){toggle(true);if(e.key==='Home')highlight(0);if(e.key==='End')highlight(rows.length-1);}else highlight(e.key==='Home'?0:e.key==='End'?rows.length-1:active+(e.key==='ArrowDown'?1:-1));}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();if(open)choose(active);else toggle(true);}
  else if(e.key==='Escape'){e.preventDefault();toggle(false);}
  else if(e.key==='Tab')toggle(false);
  else if(/^[2-7]$/.test(e.key)){e.preventDefault();if(!open)toggle(true);highlight(Number(e.key)-2);}
 });
 document.addEventListener('pointerdown',e=>{if(!host.contains(e.target))toggle(false);});
 trigger.addEventListener('blur',()=>toggle(false));
 size.addEventListener('change',()=>{active=size.selectedIndex;render();});
 render();
}

// Repeatable viewport reveals: reverse softly as text leaves the lower edge on upward scroll.
if ('IntersectionObserver' in window) {
 const revealMotion = matchMedia('(prefers-reduced-motion: reduce)');
 const candidates = [...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main summary, main .text-link, main .button, main .card-link, .contact h2, .contact p, .contact .button, .contact-label, .contact-details>a')].filter(element => !element.closest('.hero-carousel, .hero-slide, .industry-panel-content, .faq-panel-content, .expandable-content, .team-select, [hidden]'));
 const candidateSet = new Set(candidates);
 const targets = candidates.filter(element => {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) if (candidateSet.has(parent)) return false;
  return true;
 });
 let observer;
 const show = element => element.classList.add('is-revealed');
 function startReveals() {
  observer?.disconnect();
  if (revealMotion.matches) { targets.forEach(show); return; }
  observer = new IntersectionObserver(entries => {
   entries.forEach(({target, isIntersecting, boundingClientRect}) => {
    // Retain text above the viewport so scrolling back to it remains readable.
    // The lower viewport boundary reverses the entrance without hiding a whole section.
    const visible = isIntersecting || boundingClientRect.top < 0 || target.contains(document.activeElement);
    target.classList.toggle('is-revealed', visible);
   });
  }, {threshold: 0, rootMargin: '0px 0px -64px 0px'});
  targets.forEach(element => {
   element.classList.add('scroll-reveal');
   const rect = element.getBoundingClientRect();
   element.classList.toggle('is-revealed', rect.top < innerHeight - 64);
   observer.observe(element);
  });
 }
 document.addEventListener('focusin', event => {
  targets.forEach(element => { if (element.contains(event.target)) show(element); });
 });
 revealMotion.addEventListener('change', startReveals);
 window.addEventListener('beforeprint', () => { observer?.disconnect(); targets.forEach(show); });
 window.addEventListener('afterprint', startReveals);
 startReveals();
}
