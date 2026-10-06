import * as THREE from './assets/three.module.js';
const canvas=document.getElementById('scene');
if(canvas){
 try{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,0,10.5);
  scene.add(new THREE.HemisphereLight(0xf5f3ff,0x382e6e,3.8));
  const light=new THREE.DirectionalLight(0xffffff,5);light.position.set(-3,5,6);scene.add(light);
  const edge=new THREE.DirectionalLight(0x9980ff,3);edge.position.set(4,-1,-2);scene.add(edge);
  const warm=new THREE.PointLight(0xffc9a3,40);warm.position.set(-3,-2,4);scene.add(warm);
  const group=new THREE.Group();scene.add(group);
  const mat=new THREE.MeshPhysicalMaterial({color:0x9477ee,metalness:.3,roughness:.2,clearcoat:1,clearcoatRoughness:.15});
  const rings=[];
  for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.55-i*.08,.23,28,100),mat.clone());ring.material.color.setHex([0x5734d9,0x9975f4,0xc4b0fd][i]);ring.position.z=(i-1)*.53;group.add(ring);rings.push(ring);}
  const path=new THREE.EllipseCurve(0,0,2.7,2.7,0,Math.PI*2,false,0);const pts=path.getPoints(110).map(p=>new THREE.Vector3(p.x,p.y,0));const track=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xa997d8,transparent:true,opacity:.25}));track.rotation.x=.5;group.add(track);
  const pearl=new THREE.Mesh(new THREE.SphereGeometry(.20,24,24),new THREE.MeshPhysicalMaterial({color:0xff9856,metalness:.25,roughness:.18,clearcoat:1}));group.add(pearl);
  const small=new THREE.Mesh(new THREE.SphereGeometry(.085,16,16),new THREE.MeshStandardMaterial({color:0xffffff,metalness:.45,roughness:.22}));group.add(small);
  let paused=reduced.matches||document.body.classList.contains('paused'),visible=true,phase=0,targetX=0,targetY=0,style='aprender',disposed=false;
  group.rotation.set(.65,-.55,-.28);
  const resize=()=>{const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();draw();};
  function draw(){if(disposed)return;renderer.render(scene,camera)}
  const ro=new ResizeObserver(resize);ro.observe(canvas);
  new IntersectionObserver(e=>{visible=e[0].isIntersecting},{rootMargin:'80px'}).observe(canvas);
  window.addEventListener('salestrack-motion',e=>{paused=e.detail.paused;draw()});
  window.addEventListener('salestrack-path',e=>{style=e.detail;});
  window.addEventListener('salestrack-slide',e=>{style=e.detail%2?'fazer':'aprender';targetY=(e.detail-2)*.09;draw();});
  canvas.parentElement.addEventListener('pointermove',e=>{if(paused)return;const r=canvas.getBoundingClientRect();targetX=(e.clientY-r.top-r.height/2)/r.height*.22;targetY=(e.clientX-r.left-r.width/2)/r.width*.4});
  canvas.parentElement.addEventListener('pointerleave',()=>{targetX=0;targetY=0});
  let last=0;
  renderer.setAnimationLoop(now=>{if(!visible||paused||document.hidden||disposed)return;if(now-last<32)return;last=now;phase+=.007;group.rotation.x+=(.65+targetX-group.rotation.x)*.04;group.rotation.y+=(-.55+targetY+Math.sin(phase*.35)*.17-group.rotation.y)*.04;group.position.y=Math.sin(phase)*.07;rings.forEach((r,i)=>{r.rotation.z=phase*(i%2?.12:-.1);r.position.z+=( (i-1)*(style==='fazer'?.35:.63)-r.position.z)*.035;});pearl.position.set(Math.cos(phase)*2.7,Math.sin(phase)*2.4,Math.sin(phase)*1.3);small.position.set(Math.cos(phase+2.8)*2.7,Math.sin(phase+2.8)*2.4,Math.sin(phase+2.8)*1.3);draw();});
  pearl.position.set(2.45,-1,0);small.position.set(-2,1.7,.5);resize();document.body.classList.add('webgl-ready');
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.remove('webgl-ready');disposed=true;renderer.setAnimationLoop(null);});
  window.addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);ro.disconnect();renderer.dispose();});
 }catch(error){console.warn('Visual 3D indisponível; composição alternativa ativa.');}
}
