document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);menu.textContent=open?'Fechar ✕':'Menu ☰';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.nav-group[open]').forEach(x=>x.open=false);if(menu){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.textContent='Menu ☰';}closeSupport();}});
document.addEventListener('click',e=>{document.querySelectorAll('.nav-group[open]').forEach(x=>{if(!x.contains(e.target))x.open=false;});});
const support=document.querySelector('.support-panel'),supportToggle=document.querySelector('.support-toggle');
function closeSupport(){if(support){support.hidden=true;supportToggle.setAttribute('aria-expanded','false');}}
supportToggle?.addEventListener('click',()=>{const open=support.hidden;support.hidden=!open;supportToggle.setAttribute('aria-expanded',String(open));});
document.addEventListener('click',e=>{if(!e.target.closest('.support'))closeSupport();});
const tabs=[...document.querySelectorAll('[role="tab"]')];
function setTab(tab,focus=false){tabs.forEach(t=>{let selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});if(focus)tab.focus();}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>setTab(tab));tab.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();setTab(tabs[n],true);});});
const filters=document.querySelectorAll('[data-filter]');filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('[data-category]').forEach(card=>{const show=button.dataset.filter==='todos'||card.dataset.category===button.dataset.filter;card.hidden=!show;if(show)count++;});const counter=document.querySelector('.download-count');if(counter)counter.textContent=count+' materiais disponíveis';}));
const form=document.querySelector('#contact-capture');
if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pending');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pending');observer.observe(el);}});}

const supportRoot=document.querySelector('.support');function revealSupport(){if(supportRoot)supportRoot.hidden=!form&&window.scrollY<window.innerHeight*.9;}window.addEventListener('scroll',revealSupport,{passive:true});revealSupport();

// Keep the commercial entry available across the existing site.
{const nav=document.querySelector('#site-nav');if(nav&&!nav.querySelector('a[href="/#prospeccao-vendas"]')){const link=document.createElement('a');link.href='/#prospeccao-vendas';link.textContent='Vendas B2B';nav.prepend(link);}}
