(() => {
 const phone=matchMedia('(max-width:760px)');
 function desktop(){if(!phone.matches)location.replace('index.html#contact')}
 desktop();phone.addEventListener('change',desktop);
 const form=document.querySelector('#enquiry-form');
 if(!form)return;
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const data=new FormData(form);
  const body=[`Full Name: ${data.get('name')}`,`Email Address: ${data.get('email')}`,`Phone Number: ${data.get('phone')||'Not provided'}`,`Company Name: ${data.get('company')||'Not provided'}`,`Service Interested In: ${data.get('service')}`,'','Message:',data.get('message')].join('\r\n');
  const url=`mailto:hr@gh-advisory.com?subject=${encodeURIComponent('Website enquiry - '+data.get('service'))}&body=${encodeURIComponent(body)}`;
  document.querySelector('#enquiry-status').textContent='Your email draft is ready. Please send it from your email app. If it does not open, email hr@gh-advisory.com directly; your entries remain here.';
  location.href=url;
 });
})();
