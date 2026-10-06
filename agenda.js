(()=>{
 'use strict';
 const dialog=document.querySelector('#agenda-dialog');
 if(!dialog)return;
 const frame=dialog.querySelector('[data-agenda-frame]');
 const url='https://calendly.com/agenda_salestrack/reuniao-com-andre-kachan';
 let opener;
 document.querySelectorAll('[data-agenda-open]').forEach(link=>{
  link.addEventListener('click',event=>{
   event.preventDefault();
   opener=link;
   document.querySelectorAll('dialog[open]').forEach(other=>other.close());
   dialog.showModal();
   document.documentElement.classList.add('agenda-is-open');
   if(!frame.hasAttribute('src'))frame.src=url;
  });
 });
 dialog.querySelector('[data-agenda-close]').addEventListener('click',()=>dialog.close());
 dialog.querySelector('[data-agenda-reload]').addEventListener('click',()=>{frame.src=url;});
 dialog.addEventListener('click',event=>{
  const rect=dialog.getBoundingClientRect();
  if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();
 });
 dialog.addEventListener('close',()=>{
  document.documentElement.classList.remove('agenda-is-open');
  if(opener?.checkVisibility())opener.focus({preventScroll:true});
  else document.querySelector('#menu-open')?.focus({preventScroll:true});
 });
})();
