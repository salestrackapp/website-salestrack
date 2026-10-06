(() => {
  const q=(s)=>document.querySelector(s), qa=(s)=>[...document.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches;
  const motion=q('.motion-toggle');
  const applyMotion=()=>{document.body.classList.toggle('paused',paused);document.body.classList.toggle('js-motion',!paused);if(motion){motion.textContent=paused?'Ativar movimento':'Pausar movimento';motion.setAttribute('aria-pressed',String(paused));}window.dispatchEvent(new CustomEvent('salestrack-motion',{detail:{paused}}));};
  applyMotion();motion?.addEventListener('click',()=>{paused=!paused;applyMotion();});
  reduced.addEventListener('change',e=>{paused=e.matches;applyMotion();});
  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.06});qa('.reveal').forEach(e=>obs.observe(e));
  const progress=q('.reading-progress i');const updateProgress=()=>{if(progress){const total=document.documentElement.scrollHeight-innerHeight;progress.style.width=(total>0?scrollY/total*100:0)+'%'}};window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
  const wa=(text)=>'https://wa.me/5511989296817?text='+encodeURIComponent(text);
  qa('[data-wa]').forEach(a=>a.href=wa('Olá, André! Vim pelo site da Salestrack e tenho interesse em '+(location.pathname.includes('aprender')?'aprender a usar IA na prática':location.pathname.includes('fazer')?'contratar vocês para desenvolver uma solução':'conhecer como vocês podem me ajudar com IA')+'. Gostaria de conversar.'));
  const mode=q('#mode');qa('[data-mode]').forEach(a=>a.addEventListener('click',()=>{if(mode)mode.value=a.dataset.mode;window.dispatchEvent(new CustomEvent('salestrack-path',{detail:a.dataset.mode}));}));
  const topics={aprender:{kicker:'Aprendizado aplicado',title:'“Quero usar IA.\nPor onde começo?”',text:'Começamos com algo do seu dia a dia. Você aprende fazendo, com orientação para continuar depois.',example:'Preparar um texto, estudar um assunto ou organizar suas ideias.',mode:'aprender'},tempo:{kicker:'Menos trabalho repetitivo',title:'“Isso toma muito\ntempo da minha semana.”',text:'Vamos entender a tarefa e avaliar o que pode ser simplificado ou automatizado, com você ou por você.',example:'Organizar informações de planilhas ou preparar um relatório recorrente.',mode:'fazer'},negocio:{kicker:'Organização na prática',title:'“Quero enxergar melhor\no que está acontecendo.”',text:'Partimos do seu processo para organizar as informações e facilitar o acompanhamento do trabalho.',example:'Estruturar contatos, propostas, tarefas ou um painel de indicadores.',mode:'fazer'},ideia:{kicker:'Sua ideia, um primeiro passo',title:'“Tenho uma ideia.\nQuero colocar em prática.”',text:'Você conta o que imagina. A gente avalia possibilidades, define uma primeira entrega e combina como fazer.',example:'Criar uma página, um material ou uma ferramenta para uma necessidade específica.',mode:'fazer'}};
  let currentTopic='aprender';
  function selectTopic(key,focus=false){const t=topics[key];if(!t)return;currentTopic=key;qa('[data-topic]').forEach(b=>{const active=b.dataset.topic===key;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus()});q('#explore-panel').setAttribute('aria-labelledby','tab-'+key);q('#explore-kicker').textContent=t.kicker;q('#explore-title').textContent=t.title;q('#explore-title').style.whiteSpace='pre-line';q('#explore-text').textContent=t.text;q('#explore-example').textContent=t.example;window.dispatchEvent(new CustomEvent('salestrack-path',{detail:t.mode}));}
  const tabs=qa('[data-topic]');tabs.forEach((b,i)=>{b.addEventListener('click',()=>selectTopic(b.dataset.topic));b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();selectTopic(tabs[n].dataset.topic,true);});});
  q('#explore-cta')?.addEventListener('click',()=>{mode.value=topics[currentTopic].mode;const need=q('#need');if(!need.value)need.value=topics[currentTopic].title.replaceAll('“','').replaceAll('”','').replaceAll('\n',' ');});
  if(matchMedia('(pointer:fine)').matches)qa('[data-tilt]').forEach(card=>{card.addEventListener('pointermove',e=>{if(paused)return;const r=card.getBoundingClientRect();card.style.transform=`rotateX(${-(e.clientY-r.top-r.height/2)/r.height*5}deg) rotateY(${(e.clientX-r.left-r.width/2)/r.width*6}deg)`});card.addEventListener('pointerleave',()=>{card.style.transform=''});});
  const form=q('#lead-form');form?.addEventListener('submit',async e=>{
    e.preventDefault();
    const name=q('#name'),need=q('#need'),status=q('#form-status'),button=form.querySelector('[type="submit"]');
    name.setCustomValidity(name.value.trim()?'':'Informe seu nome.');
    need.setCustomValidity(need.value.trim().length>=10?'':'Conte sua necessidade em pelo menos 10 caracteres.');
    if(!form.reportValidity()||button.disabled)return;
    form.querySelector('[name="_url"]').value=location.origin+location.pathname;
    const payload=Object.fromEntries(new FormData(form));delete payload._next;
    button.disabled=true;form.setAttribute('aria-busy','true');status.textContent='Enviando seu pedido…';
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),30000);
    try{
      const response=await fetch('https://formsubmit.co/ajax/andre.kachan@salestrack.com.br',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
      const result=await response.json();
      if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Envio não confirmado');
      window.location.assign(new URL('obrigado.html',location.href).href);
    }catch(error){
      status.textContent=error.name==='AbortError'?'O envio demorou e não foi possível confirmar. Seus dados continuam aqui. Aguarde antes de tentar novamente ou fale com a gente pelo WhatsApp.':'Não foi possível confirmar o envio. Seus dados continuam aqui. Tente novamente ou fale com a gente pelo WhatsApp.';
      button.disabled=false;
    }finally{clearTimeout(timer);form.removeAttribute('aria-busy');}
  });
  qa('#name,#need').forEach(i=>i.addEventListener('input',()=>i.setCustomValidity('')));
  qa('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
  q('#privacy-open')?.addEventListener('click',()=>q('#privacy-dialog').showModal());
  const dialog=q('#chat-dialog'),log=q('#chat-log'),options=q('#chat-options'),inputForm=q('#chat-form'),input=q('#chat-answer');let chatMode='';
  function bubble(text,user=false){const b=document.createElement('p');b.className='chat-bubble'+(user?' user':'');b.textContent=text;log.append(b);log.scrollTop=log.scrollHeight;}
  function addOption(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);options.append(b);}
  function startChat(){if(!dialog)return;log.replaceChildren();options.replaceChildren();inputForm.hidden=true;input.value='';chatMode='';bubble('Oi! Posso ajudar você a organizar seu pedido. O que faz mais sentido agora?');[['Quero aprender','aprender'],['Quero que façam por mim','fazer'],['Ainda não sei','entender']].forEach(([text,value])=>addOption(text,()=>{chatMode=value;bubble(text,true);options.replaceChildren();bubble(value==='aprender'?'O que você gostaria de aprender a fazer com IA? Pode ser algo do trabalho ou do seu dia a dia.':value==='fazer'?'O que você gostaria de resolver ou colocar em prática? Conte um exemplo.':'Qual atividade você gostaria de entender melhor, simplificar ou fazer com mais facilidade?');inputForm.hidden=false;input.focus();}));}
  qa('.chat-open').forEach(b=>b.addEventListener('click',()=>{if(!log.childElementCount)startChat();dialog.showModal();}));
  q('#chat-reset')?.addEventListener('click',startChat);
  inputForm?.addEventListener('submit',e=>{e.preventDefault();const answer=input.value.trim();if(!answer)return;bubble(answer,true);inputForm.hidden=true;bubble('Entendi. Você pode levar esse pedido para o André ou completar o formulário. Escopo, horas e valor serão combinados antes de contratar.');options.replaceChildren();const a=document.createElement('a');a.textContent='Conversar no WhatsApp ↗';a.href=wa(`Olá, André! Vim pela conversa guiada do site da Salestrack.\n\n${chatMode==='aprender'?'Quero aprender':chatMode==='fazer'?'Quero que façam por mim':'Quero entender como começar'}.\n\n${answer}`);a.target='_blank';a.rel='noopener noreferrer';options.append(a);addOption('Completar formulário',()=>{mode.value=chatMode;q('#need').value=answer;dialog.close();q('#conversa').scrollIntoView({behavior:paused?'instant':'smooth'});q('#name').focus({preventScroll:true});});});
})();
// Preserve the visitor's choices when coming from the commercial presentation.
(() => { const p=new URLSearchParams(location.search); const mode=document.querySelector('#mode'),need=document.querySelector('#need'); if(mode&&['aprender','fazer'].includes(p.get('modo')))mode.value=p.get('modo'); if(need&&p.get('interesse'))need.value=p.get('interesse').slice(0,2000); })();
