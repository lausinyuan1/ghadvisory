(() => {
 const controls=document.querySelector('.course-controls');
 if(!controls)return;
 const input=document.querySelector('#course-search'),buttons=[...document.querySelectorAll('[data-category]')],cards=[...document.querySelectorAll('.course-card')],count=document.querySelector('.course-count'),empty=document.querySelector('.course-empty');
 const normal=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const records=cards.map(card=>({card,categories:JSON.parse(card.dataset.categories),search:normal(card.dataset.search)}));
 let category='All courses',timer;
 function staggerCards(){
  const grid=document.querySelector('.course-grid');
  const columns=getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
  cards.filter(card=>!card.hidden).forEach((card,index)=>{
   card.style.setProperty('--card-reveal-delay',`${(index%Math.max(columns,1))*180}ms`);
  });
 }
 addEventListener('resize',staggerCards,{passive:true});
 function apply(updateURL=true){
  const terms=normal(input.value.trim()).split(/\s+/).filter(Boolean);let visible=0;
  records.forEach(r=>{const match=(category==='All courses'||r.categories.includes(category))&&terms.every(t=>r.search.includes(t));r.card.hidden=!match;if(match)visible++;});
  staggerCards();
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
  count.textContent=`${visible} ${visible===1?'course':'courses'}${category==='All courses'?'':' in '+category}`;empty.hidden=visible!==0;
  if(updateURL){const url=new URL(location.href);input.value.trim()?url.searchParams.set('q',input.value.trim()):url.searchParams.delete('q');category==='All courses'?url.searchParams.delete('category'):url.searchParams.set('category',category);try{history.replaceState(null,'',url);}catch{}}
 }
 function restore(){const params=new URLSearchParams(location.search);input.value=params.get('q')||'';category=buttons.some(b=>b.dataset.category===params.get('category'))?params.get('category'):'All courses';apply(false);}
 buttons.forEach(b=>b.addEventListener('click',()=>{clearTimeout(timer);category=b.dataset.category;apply();}));
 input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(apply,120);});
 document.querySelectorAll('.course-clear').forEach(b=>b.addEventListener('click',()=>{clearTimeout(timer);category='All courses';input.value='';apply();input.focus();}));
 addEventListener('pageshow',restore);addEventListener('popstate',restore);controls.hidden=false;restore();
})();
