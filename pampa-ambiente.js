/* Pampa Juega · hinchada de fondo + bombo (ambiente liviano, sin archivos).
   Incluir con: <script src="../pampa-ambiente.js"></script>
   Pone un botón flotante 🥁 abajo a la izquierda. Arranca con el primer toque
   (las políticas del navegador no dejan sonar audio sin un gesto) y se silencia
   con el botón. Usa su propio AudioContext: no pisa los sonidos del juego. */
(function(){
  if (window.__pampaAmbiente) return; window.__pampaAmbiente = true;
  var actx=null, crowd=null, on=false, started=false;
  function ctx(){ if(!actx){ try{ actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return actx; }
  function start(){ var c=ctx(); if(!c||crowd) return; try{
    var len=2*c.sampleRate, buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0);
    for(var i=0;i<len;i++) d[i]=Math.random()*2-1;
    var src=c.createBufferSource(); src.buffer=buf; src.loop=true;
    var bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=430; bp.Q.value=0.7;
    var lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=900;
    var g=c.createGain(); g.gain.value=0.0001;
    src.connect(bp); bp.connect(lp); lp.connect(g); g.connect(c.destination);
    var lfo=c.createOscillator(), lg=c.createGain(); lfo.frequency.value=0.13; lg.gain.value=0.022; lfo.connect(lg); lg.connect(g.gain); lfo.start();
    src.start(); g.gain.setTargetAtTime(0.05, c.currentTime, 1.6); crowd={src:src,g:g,lfo:lfo};
  }catch(e){} }
  function stop(){ if(!crowd) return; var n=crowd; crowd=null; try{ n.g.gain.setTargetAtTime(0.0001, ctx().currentTime, 0.4); setTimeout(function(){ try{ n.src.stop(); n.lfo.stop(); }catch(e){} }, 700); }catch(e){} }
  function bombo(){ var c=ctx(); if(!c||!on) return; try{ var o=c.createOscillator(), g=c.createGain(); o.type='sine'; o.frequency.setValueAtTime(150,c.currentTime); o.frequency.exponentialRampToValueAtTime(46,c.currentTime+0.18); g.gain.setValueAtTime(0.0001,c.currentTime); g.gain.exponentialRampToValueAtTime(0.45,c.currentTime+0.012); g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+0.32); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime+0.34); }catch(e){} }
  window.__pampaBombo = bombo;

  var css=document.createElement('style');
  css.textContent='.pa-fab{position:fixed;left:12px;bottom:12px;z-index:9998;width:44px;height:44px;border-radius:50%;border:2px solid #f4ecd8;background:linear-gradient(135deg,#75AADB,#4d8fc7);color:#04212e;font-size:1.15rem;cursor:pointer;box-shadow:0 5px 14px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center}.pa-fab.off{filter:grayscale(.7);opacity:.8}.pa-fab .p{position:absolute;inset:-2px;border-radius:50%;border:2px solid #75AADB;animation:paP 1.7s ease-out infinite;pointer-events:none}.pa-fab.on .p{display:none}@keyframes paP{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.5);opacity:0}}';
  document.head.appendChild(css);
  var btn=document.createElement('button'); btn.className='pa-fab off'; btn.title='Hinchada de fondo'; btn.setAttribute('aria-label','Hinchada de fondo'); btn.innerHTML='<span class="p"></span><span class="i">🔇</span>';
  function add(){ if(document.body) document.body.appendChild(btn); }
  if(document.body) add(); else document.addEventListener('DOMContentLoaded', add);
  function setOn(v){ on=v; btn.classList.toggle('on',v); btn.classList.toggle('off',!v); var i=btn.querySelector('.i'); if(i) i.textContent=v?'🥁':'🔇'; if(v) start(); else stop(); }
  btn.addEventListener('click', function(e){ e.stopPropagation(); started=true; setOn(!on); if(on) setTimeout(bombo,120); });
  // arranca en el primer toque de la pantalla (no en el propio botón)
  function kick(e){ if(e && e.target && e.target.closest && e.target.closest('.pa-fab')) return; if(!started){ started=true; setOn(true); setTimeout(bombo,140); } window.removeEventListener('pointerdown',kick,true); window.removeEventListener('keydown',kick,true); }
  window.addEventListener('pointerdown',kick,true); window.addEventListener('keydown',kick,true);
})();
