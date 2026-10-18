// Static-site contact forms prepare an email; they never claim a message was sent.
document.querySelectorAll('.contact-message-form').forEach(form=>{
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const data=new FormData(form);
  const body=[`Name: ${data.get('name')}`,`Email: ${data.get('email')}`,'','Message:',data.get('message')].join('\r\n');
  form.querySelector('.contact-form-status').textContent='Please send the draft from your email app. If it does not open, email hr@gh-advisory.com directly. Your entries remain here.';
  location.href=`mailto:hr@gh-advisory.com?subject=${encodeURIComponent('GH Advisory website enquiry')}&body=${encodeURIComponent(body)}`;
 });
});
