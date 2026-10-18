/* Owner-supplied earned-rank art. Presentation only: no storage, scoring or award writes. */
(function(root){
 'use strict';
 var names=['Debutante','Eficiente','Constante','Diligente','Admirable','Excelente','Increíble','Brillante','Eminente','Maestro/a'];
 var files=['1. debutante.png','2. eficiente.png','3. constante.png','4. diligente.png','5. admirable.png','6. excelente.png','7. increible.png','8. brillante.png','9. eminente.png','10. maestro.png'];
 var modes=['palabreo-clasico','palabreo-trenza','palabreo-cuarteto','racimo','sudoku-clasico','sudoku-mini','flechas-clasico','flechas-cascada'];
 var placements=[[0.9472318339100346,33.08564013840828,43.50519031141869],[0.9530026109660574,29.94386422976504,48.050913838120096],[0.9295415959252971,44.177419354838776,64.6273344651953],[0.9335038363171355,41.69309462915601,59.89641943734023],[0.9240506329113924,47.158227848101205,47.158227848101205],[0.9287531806615776,45.13613231552165,64.63994910941472],[0.9496964440589766,31.5403295750217,51.00910667823075],[0.9350982066609735,41.16097352690008,61.73313407344153],[0.9217171717171717,48.62247474747471,68.439393939394],[0.9375,39.65625,54.1875]];
 function placement(index){if(!Number.isInteger(index)||index<0||index>=placements.length)return null;var p=placements[index];return Object.freeze({scale:p[0],translateX:p[1],translateY:p[2],canvas:1254,sealHeight:1095,centerX:627,centerY:627,baseline:1174.5});}
 function select(o){
  if(!o||o.eligible!==true||!modes.includes(o.mode)||!Number.isInteger(o.rankIndex)||o.rankIndex<0||o.rankIndex>=names.length)return null;
  return Object.freeze({mode:o.mode,rankIndex:o.rankIndex,rankName:names[o.rankIndex],filename:files[o.rankIndex]});
 }
 function luminance(rgb){var a=rgb.slice(0,3).map(function(n){n/=255;return n<=0.04045?n/12.92:Math.pow((n+0.055)/1.055,2.4);});return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];}
 function contrast(a,b){var x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
 function opaque(a){return Array.isArray(a)&&a.length===4&&a.every(function(n){return Number.isInteger(n)&&n>=0&&n<=255;})&&a[3]===255;}
 function chooseInk(accent,bg,deep){
  if(!opaque(accent)||!opaque(bg))return null;
  if(contrast(accent,bg)>=4.5)return accent.slice();
  if(opaque(deep)&&contrast(deep,bg)>=4.5)return deep.slice();
  var target=contrast([0,0,0],bg)>=contrast([255,255,255],bg)?0:255;
  for(var step=1;step<=50;step++){var k=1-step/50,c=accent.slice(0,3).map(function(n){return Math.round(n*k+target*(1-k));});c.push(255);if(contrast(c,bg)>=4.5)return c;}
  return null;
 }
 if(typeof module!=='undefined'&&module.exports){module.exports=Object.freeze({select:select,placement:placement,chooseInk:chooseInk,contrast:contrast,names:Object.freeze(names.slice()),files:Object.freeze(files.slice()),modes:Object.freeze(modes.slice())});return;}
 var doc=root.document,base=new URL('.',doc.currentScript.src),N=1254,controllers=new WeakMap(),masks=new Map(),probe;
 function direct(host){return Array.from(host.children).filter(function(x){return x.classList.contains('cg-rank-sticker');});}
 function remove(fig){var c=controllers.get(fig);if(c)c.destroy();else fig.remove();}
 function clear(scope,keepHost){var s=scope&&scope.querySelectorAll?scope:doc,keep=typeof keepHost==='string'?doc.querySelector(keepHost):keepHost;Array.from(s.querySelectorAll('.cg-rank-sticker')).forEach(function(fig){if(!keep||fig.parentNode!==keep)remove(fig);});}
 function color(value){
  value=(value||'').trim();if(!value)return null;
  if(!probe)probe=doc.createElement('canvas').getContext('2d',{willReadFrequently:true});if(!probe)return null;
  probe.fillStyle='#010203';probe.fillStyle=value;var a=probe.fillStyle;probe.fillStyle='#040506';probe.fillStyle=value;if(a!==probe.fillStyle)return null;
  probe.clearRect(0,0,1,1);probe.fillRect(0,0,1,1);var p=probe.getImageData(0,0,1,1).data;return p[3]?[p[0],p[1],p[2],p[3]]:null;
 }
 function buildMask(img,src){
  if(masks.has(src))return masks.get(src);
  var c=doc.createElement('canvas');c.width=c.height=N;var x=c.getContext('2d',{willReadFrequently:true});if(!x)throw Error('Sticker canvas unavailable');
  x.drawImage(img,0,0,N,N);var d=x.getImageData(0,0,N,N).data,m=new Uint8ClampedArray(N*N),ink=0;
  for(var i=0,p=0;i<m.length;i++,p+=4){var chroma=d[p]-Math.max(d[p+1],d[p+2]);var strength=chroma<=40?0:chroma>=170?1:(chroma-40)/130;m[i]=Math.round(strength*d[p+3]);if(m[i])ink++;}
  if(!ink)throw Error('Supplied rank art has no visible red ink');
  if(masks.size>=2)masks.delete(masks.keys().next().value);masks.set(src,m);return m;
 }
 function Controller(fig,canvas,img,host,onLayout,src,chosen){
  var full=doc.createElement('canvas');full.width=full.height=N;var fullctx=full.getContext('2d'),position=placement(chosen.rankIndex);
  var dead=false,mask=null,last='',themeObserver=null,removalObserver=null,pending=false,ctx=canvas.getContext('2d'),self=this;
  function layout(){if(typeof onLayout==='function')try{onLayout();}catch(e){/* decorative only */}}
  this.destroy=function(removeFigure){if(dead)return;dead=true;img.onload=img.onerror=null;if(themeObserver)themeObserver.disconnect();if(removalObserver)removalObserver.disconnect();controllers.delete(fig);if(removeFigure!==false)fig.remove();};
  function fail(){if(dead)return;self.destroy(false);if(ctx)ctx.clearRect(0,0,N,N);fig.dataset.ready='error';delete fig.dataset.ink;delete fig.dataset.inkContrast;delete fig.dataset.inkSource;delete fig.dataset.placementScale;fig.removeAttribute('aria-busy');fig.removeAttribute('role');fig.removeAttribute('aria-label');fig.setAttribute('aria-hidden','true');layout();}
  this.refresh=function(){
   if(dead)return;if(!fig.isConnected){self.destroy();return;}
   var style=root.getComputedStyle(fig),accent=color(style.getPropertyValue('--accent')),deep=color(style.getPropertyValue('--accent-deep')),bg=null;
   for(var ancestor=host;ancestor&&ancestor.nodeType===1;ancestor=ancestor.parentElement){var painted=color(root.getComputedStyle(ancestor).backgroundColor);if(painted&&painted[3]>0&&!opaque(painted)){fail();return;}if(opaque(painted)){bg=painted;break;}}
   var rgba=chooseInk(accent,bg,deep);if(!rgba){fail();return;}var key=rgba.join(',');if(!mask||key===last)return;
   last=key;var im=ctx.createImageData(N,N),out=im.data;
   for(var i=0,p=0;i<mask.length;i++,p+=4){out[p]=rgba[0];out[p+1]=rgba[1];out[p+2]=rgba[2];out[p+3]=Math.round(mask[i]*rgba[3]/255);}
   fullctx.putImageData(im,0,0);ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,N,N);ctx.setTransform(position.scale,0,0,position.scale,position.translateX,position.translateY);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(full,0,0);ctx.setTransform(1,0,0,1,0,0);fig.dataset.placementScale=String(position.scale);fig.dataset.ink='rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+','+(rgba[3]/255)+')';fig.dataset.inkContrast=contrast(rgba,bg).toFixed(3);fig.dataset.inkSource=rgba.slice(0,3).join(',')===accent.slice(0,3).join(',')?'accent':opaque(deep)&&rgba.slice(0,3).join(',')===deep.slice(0,3).join(',')?'native-deep':'contrast-tint';
  };
  function schedule(){if(pending||dead)return;pending=true;Promise.resolve().then(function(){pending=false;self.refresh();});}
  if(root.MutationObserver){
   themeObserver=new MutationObserver(schedule);for(var el=host;el&&el.nodeType===1;el=el.parentElement)themeObserver.observe(el,{attributes:true});
   removalObserver=new MutationObserver(function(){if(!fig.isConnected)self.destroy();});removalObserver.observe(doc.documentElement,{childList:true,subtree:true});
  }
  img.onload=function(){
   img.onload=img.onerror=null;if(dead)return;if(!fig.isConnected){self.destroy();return;}if(!ctx||!fullctx){fail();return;}
   try{mask=buildMask(img,src);self.refresh();if(dead)return;fig.dataset.ready='1';fig.removeAttribute('aria-busy');layout();}catch(e){fail();}
  };
  img.onerror=fail;
 }
 function render(o){
  o=o||{};var host=typeof o.host==='string'?doc.querySelector(o.host):o.host;if(!host||host.nodeType!==1)return null;
  var chosen=select(o),previous=direct(host);if(!chosen){previous.forEach(remove);return null;}
  if(previous.length===1&&previous[0].dataset.mode===chosen.mode&&Number(previous[0].dataset.rankIndex)===chosen.rankIndex){var old=controllers.get(previous[0]);if(old){old.refresh();return chosen;}}
  var fig=previous[0]||doc.createElement('figure'),reused=!!previous[0];previous.slice(1).forEach(remove);var prior=controllers.get(fig);if(prior)prior.destroy(false);fig.replaceChildren();fig.className='cg-rank-sticker';fig.hidden=false;fig.dataset.reveal=reused?'static':'enter';fig.setAttribute('aria-busy','true');fig.removeAttribute('aria-hidden');fig.setAttribute('role','img');fig.setAttribute('aria-label','Rango '+chosen.rankName);fig.dataset.mode=chosen.mode;fig.dataset.rankIndex=String(chosen.rankIndex);fig.dataset.rank=chosen.rankName;fig.dataset.ready='0';
  var canvas=doc.createElement('canvas');canvas.className='cg-rank-canvas';canvas.width=canvas.height=N;
  var img=doc.createElement('img');img.className='cg-rank-source';img.hidden=true;img.alt='';img.decoding='async';fig.appendChild(canvas);fig.appendChild(img);
  var ref=null;if(typeof o.before==='string')try{ref=host.querySelector(o.before);}catch(e){/* no placement hint */}
  if(ref&&ref.parentNode===host)host.insertBefore(fig,ref);else host.appendChild(fig);
  if(root.getComputedStyle(fig).getPropertyValue('--cg-rank-ready').trim()!=='1'){fig.remove();return null;}
  var src=new URL(encodeURIComponent(chosen.filename),base).href;controllers.set(fig,new Controller(fig,canvas,img,host,o.onLayout,src,chosen));if(typeof o.onLayout==='function')try{o.onLayout();}catch(e){/* decorative layout */}img.src=src;return chosen;
 }
 root.CGRankStickers=Object.freeze({select:select,render:render,clear:clear});
})(typeof window==='undefined'?globalThis:window);
