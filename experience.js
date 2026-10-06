(() => {
 const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let stopped=reduce.matches||document.body.classList.contains('paused');
 const menu=q('#menu-dialog');q('#menu-open')?.addEventListener('click',()=>menu.showModal());qa('[data-menu-close]').forEach(a=>a.addEventListener('click',()=>menu.close()));
 // Make the animation preference available on mobile as well.
 if(menu){const btn=document.createElement('button');btn.type='button';btn.className='button secondary';btn.style.color='white';const sync=()=>{btn.textContent=stopped?'Ativar movimento':'Pausar movimento';btn.setAttribute('aria-pressed',String(stopped))};sync();btn.addEventListener('click',()=>q('.motion-toggle').click());btn.hidden=true;menu.querySelector('nav').append(btn);window.addEventListener('salestrack-motion',e=>{stopped=e.detail.paused;sync()});}
 window.addEventListener('salestrack-motion',e=>{stopped=e.detail.paused;if(stopped)qa('[data-parallax]').forEach(el=>el.style.transform='');else tick();});
 const sceneObserver=new IntersectionObserver(entries=>entries.forEach(e=>{e.target.classList.toggle('scene-in',e.isIntersecting);e.target.classList.toggle('scene-out',!e.isIntersecting)}),{threshold:.08});qa('.depth-section').forEach(el=>sceneObserver.observe(el));
 const dock=q('.next-dock'),contact=q('#conversa');let inContact=false;
 if(contact)new IntersectionObserver(es=>{inContact=es[0].isIntersecting;updateDock()},{threshold:.08}).observe(contact);
 function updateDock(){dock?.classList.toggle('show',scrollY>450&&!inContact)}
 let ticking=false;const layers=qa('[data-parallax]');
 function tick(){ticking=false;updateDock();if(stopped)return;layers.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)el.style.transform=`translate3d(0,${Math.max(-80,Math.min(80,-r.top*Number(el.dataset.parallax)))}px,0) scale(1.025)`});}
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:true});tick();
 qa('a[href]').forEach(a=>a.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download'))return;const url=new URL(a.href,location.href);if(url.origin!==location.origin||url.pathname===location.pathname||!url.pathname.endsWith('.html'))return;if(stopped||document.startViewTransition)return;e.preventDefault();document.body.classList.add('page-leaving');setTimeout(()=>location.assign(url.href),240);}));
 addEventListener('pageshow',()=>document.body.classList.remove('page-leaving'));
 const page=document.body.dataset.page;if(q('#mode')&&!new URLSearchParams(location.search).has('modo')){if(page==='aprender.html')q('#mode').value='aprender';if(page==='fazer.html')q('#mode').value='fazer';}
 const form=q('#prompt-form');
 form?.addEventListener('submit',e=>{e.preventDefault();const goal=q('#prompt-goal'),context=q('#prompt-context');goal.setCustomValidity(goal.value.trim()?'':'Conte o que você quer fazer.');context.setCustomValidity(context.value.trim()?'':'Conte um pouco do contexto.');if(!form.reportValidity())return;q('#prompt-output').textContent=`Quero ${goal.value.trim()}.\n\nContexto: ${context.value.trim()}.\n\nApresente a resposta como: ${q('#prompt-format').value.toLowerCase()}.\n\nUse linguagem simples. Não invente informações, preços ou resultados. Se faltar algo importante, faça perguntas antes de concluir. Destaque o que precisa da minha revisão.`;q('#prompt-result').hidden=false;q('#prompt-status').textContent='Texto organizado nesta página. Nenhum dado foi enviado a uma IA.';q('#prompt-result').scrollIntoView({behavior:stopped?'instant':'smooth',block:'nearest'});});
 qa('#prompt-goal,#prompt-context').forEach(el=>el.addEventListener('input',()=>el.setCustomValidity('')));
 q('#prompt-copy')?.addEventListener('click',async()=>{const output=q('#prompt-output');try{await navigator.clipboard.writeText(output.textContent);q('#prompt-status').textContent='Texto copiado. Revise antes de usar na ferramenta de sua escolha.';}catch{const r=document.createRange();r.selectNodeContents(output);const s=window.getSelection();s.removeAllRanges();s.addRange(r);q('#prompt-status').textContent='Texto selecionado. Use a opção Copiar do seu dispositivo.';}});
 q('#prompt-help')?.addEventListener('click',()=>{q('#mode').value='aprender';q('#need').value=`Quero ajuda para aplicar IA nesta necessidade: ${q('#prompt-goal').value.trim()}. Contexto: ${q('#prompt-context').value.trim()}.`.slice(0,2000);});
})();
