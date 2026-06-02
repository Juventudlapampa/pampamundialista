/* Pampa Juega · META-JUEGO (sin servidor, todo en localStorage)
   Capas: 2) Localidad pampeana · 3) Pasaporte RPG (sellos + XP + niveles + títulos + logros)
          4) Desafío del Día (determinístico por fecha) + racha.
   Incluir con: <script src="../pampa-juego.js"></script>  (en la raíz: "pampa-juego.js")
   Expone window.PampaJuego con API para que las herramientas sumen sellos/logros.
*/
(function(){
  if (window.__pampaJuego) return; window.__pampaJuego = true;

  // ===== Cuenta de redes: EDITABLE, todavía sin definir =====
  var CUENTA = (window.CUENTA || '@juventud_lapampa');

  // ===== Herramientas (id = el data-id del index, para que el contador cuadre) =====
  var TOOLS = [
    ['crack','Creá tu Crack','🎽'], ['figu','Figurita','🃏'], ['carnet','Carnet de Hincha','🪪'],
    ['once','Armá tu 11','📋'], ['penales','Torneo de Penales','🥅'], ['tiros','Tiros Libres','⚽'],
    ['picado','El Picado','🏟️'], ['gambeta','Gambeteá','🪄'], ['carrera','Tu Carrera','🎲'],
    ['trivia','Trivia','🧠'], ['quesel','¿Qué Selección Sos?','🔮'], ['escape','Sala de Escape','🔓'],
    ['memo','Memorice','🎴'], ['predictor','Predictor','📊'], ['fixture','Fixture','🗓️'],
    ['carton','Bingo','🔢'], ['aula','FUT5 del Aula','📸'], ['promo','Figurita Real','⭐'],
    ['simu','Simulador','🎮'], ['esi','Juego Limpio','💚']
  ];
  var TOOL_BY_FILE = {
    '27-crear-crack':'crack','01-figurita':'figu','03-carnet':'carnet','02-armar-11':'once',
    '18-torneo-penales':'penales','15-tiros-libres':'tiros','25-picado':'picado','28-gambeta-leo':'gambeta',
    '20-carrera-futbolista':'carrera','08-trivia':'trivia','14-que-seleccion-sos':'quesel','21-sala-escape':'escape',
    '23-memorice':'memo','24-predictor':'predictor','09-fixture':'fixture','07-bingo':'carton',
    '19-fut5-aula':'aula','13-figurita-promo':'promo','16-simulador-partido':'simu','26-juego-limpio':'esi'
  };
  var TOOL_NAME = {}; var TOOL_ICON = {};
  TOOLS.forEach(function(t){ TOOL_NAME[t[0]]=t[1]; TOOL_ICON[t[0]]=t[2]; });

  // ===== Localidades de La Pampa =====
  var LOCS = ['Santa Rosa','General Pico','Toay','General Acha','Realicó','Eduardo Castex','Victorica',
    'Macachín','Intendente Alvear','Ingeniero Luiggi','Catriló','Quemú Quemú','Guatraché','Jacinto Arauz',
    'Santa Isabel','25 de Mayo','Colonia Barón','Winifreda','Anguil','Bernasconi','Alpachiri','Telén',
    'La Adela','Doblas','Miguel Riglos','Rancul','Trenel','Caleufú','Parera','Embajador Martini'];

  // ===== Niveles (XP) =====
  var LEVELS = [
    [0,'Pibe de Inferiores'],[50,'Titular'],[120,'Capitán'],[220,'Referente'],[350,'Crack Pampeano'],[500,'Leyenda']
  ];
  // ===== Desafíos del día (se elige uno por fecha, determinístico) =====
  var DESAFIOS = [
    {t:'Trivia relámpago', d:'Meté 6 respuestas seguidas en la Trivia.', go:'juegos/08-trivia.html'},
    {t:'Tanda perfecta', d:'Ganá una tanda en el Torneo de Penales.', go:'juegos/18-torneo-penales.html'},
    {t:'Caño del día', d:'Clavá 5 caños en Gambeteá, como en el potrero de tu pueblo.', go:'juegos/28-gambeta-leo.html'},
    {t:'Armá tu equipo', d:'Creá tu Crack y bajá la figurita.', go:'juegos/27-crear-crack.html'},
    {t:'Ojo de relator', d:'Hacé tu Predicción del Mundial.', go:'herramientas/24-predictor.html'},
    {t:'Pizarrón fino', d:'Armá tu 11 ideal y descargalo.', go:'generadores/02-armar-11.html'},
    {t:'Memoria de hincha', d:'Ganá un Memorice en difícil.', go:'juegos/23-memorice.html'},
    {t:'Pim pam pum', d:'Embocá 5 tiros libres seguidos.', go:'juegos/15-tiros-libres.html'},
    {t:'Escapista', d:'Salí de la Sala de Escape antes que suene el pitazo.', go:'juegos/21-sala-escape.html'},
    {t:'Carrera al éxito', d:'Llegá a la Selección en Tu Carrera.', go:'juegos/20-carrera-futbolista.html'},
    {t:'¿Quién sos?', d:'Descubrí qué selección sos y compartila.', go:'juegos/14-que-seleccion-sos.html'},
    {t:'Picadito', d:'Meté un gol en El Picado.', go:'juegos/25-picado.html'},
    {t:'Carnet al día', d:'Armá tu Carnet de Hincha con tu pueblo.', go:'generadores/03-carnet.html'},
    {t:'Simulá el clásico', d:'Jugá un partido en el Simulador.', go:'juegos/16-simulador-partido.html'}
  ];
  var DOBLE = [5,6]; // viernes(5)/sábado(6) = doble sello ("Finde de la Gambeta")

  // ===== Coleccionables pampeanos (Capa 6): se desbloquean juntando sellos. Nada de personas vivas. =====
  var CROMOS = [
    {n:'El Potrero', e:'⚽', r:'común', need:1},
    {n:'El Caldén', e:'🌳', r:'común', need:2},
    {n:'El Mate', e:'🧉', r:'común', need:4},
    {n:'La Martineta', e:'🐦', r:'rara', need:6},
    {n:'El Viento Pampero', e:'💨', r:'rara', need:8},
    {n:'La Jarilla', e:'🌾', r:'rara', need:10},
    {n:'El Zorro Gris', e:'🦊', r:'épica', need:12},
    {n:'Laguna Don Tomás', e:'🏞️', r:'épica', need:14},
    {n:'El Águila Mora', e:'🦅', r:'épica', need:16},
    {n:'El Caldenal', e:'🌵', r:'legendaria', need:18},
    {n:'La Estrella Pampeana', e:'⭐', r:'legendaria', need:20}
  ];
  var RAR_COL = {'común':'#9ec9ed','rara':'#4ade80','épica':'#d4a82e','legendaria':'#e8317a'};
  function cromosState(){ var n=sellosArr().length; return CROMOS.map(function(c){ return {c:c, on:n>=c.need}; }); }

  // ===== rutas relativas (según profundidad de la página) =====
  var SELF = document.currentScript;
  var BASE = (SELF && SELF.src) ? SELF.src.replace(/[^/]*$/, '') : '';

  // ===== Estado =====
  var KEY='pampa-juego-v1', SEALKEY='pampa-juega-sellos';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ return {}; } }
  function save(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }
  function sellosArr(){ try{ return JSON.parse(localStorage.getItem(SEALKEY)||'[]'); }catch(e){ return []; } }
  function setSellos(a){ try{ localStorage.setItem(SEALKEY, JSON.stringify(a)); }catch(e){} }
  var S = load();
  if(!S.done) S.done={}; if(!S.logros) S.logros={}; if(typeof S.xp!=='number') S.xp=0;
  if(!S.loc) S.loc='';
  if(!S.dia) S.dia={date:'',racha:0,done:{}};

  function levelOf(xp){ var n=LEVELS[0][1], i=0; for(var k=0;k<LEVELS.length;k++){ if(xp>=LEVELS[k][0]){ n=LEVELS[k][1]; i=k; } } return {name:n, idx:i}; }
  function nextLevel(xp){ for(var k=0;k<LEVELS.length;k++){ if(xp<LEVELS[k][0]) return LEVELS[k]; } return null; }

  // ===== Sonido corto (Web Audio, liviano) =====
  var actx=null;
  function tone(freqs,dur,vol){ try{ if(!actx) actx=new (window.AudioContext||window.webkitAudioContext)();
    freqs.forEach(function(f,i){ var o=actx.createOscillator(),g=actx.createGain(); o.type='triangle'; o.frequency.value=f;
      var t0=actx.currentTime+i*0.07; g.gain.setValueAtTime(vol||0.12,t0); g.gain.exponentialRampToValueAtTime(0.001,t0+(dur||0.16));
      o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0+(dur||0.16)); }); }catch(e){} }

  // ===== Toast =====
  function toast(html, big){
    var t=document.createElement('div'); t.className='pj-toast'+(big?' big':'');
    t.innerHTML=html; document.body.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('on'); });
    setTimeout(function(){ t.classList.remove('on'); setTimeout(function(){ t.remove(); }, 350); }, big?2600:1900);
  }

  // ===== API: sumar XP / sello / logro =====
  function addXP(n){ var before=levelOf(S.xp).idx; S.xp+=(n||0); save(S); var after=levelOf(S.xp).idx;
    if(after>before){ tone([523,659,880,1047],0.18,0.14); confetti(); toast('⬆️ ¡Subiste a <b>'+LEVELS[after][1]+'</b>!', true); }
    refreshIndex(); }
  function unlock(id,label){ if(S.logros[id]) return false; S.logros[id]={t:label||id, d:Date.now()}; save(S);
    tone([700,1000,1300],0.14,0.13); toast('🏅 Logro: <b>'+(label||id)+'</b>'); refreshIndex(); return true; }
  function sello(id, bonusXP){ id=id||CUR; if(!id) return;
    var arr=sellosArr(); var nuevo=false;
    if(arr.indexOf(id)<0){ arr.push(id); setSellos(arr); nuevo=true; }
    if(nuevo){ var cnt=arr.length; CROMOS.forEach(function(c){ if(c.need===cnt){ setTimeout(function(){ tone([700,1000,1300],0.14,0.12); confetti(28); toast('🎴 ¡Cromo nuevo! <b>'+c.e+' '+c.n+'</b> · '+c.r); }, 1400); } }); }
    var dobleHoy = DOBLE.indexOf(new Date(stamp()).getDay())>=0;
    if(!S.done[id]){ S.done[id]=1; var base=10*(dobleHoy?2:1); S.xp+=base; save(S);
      tone([600,820,1000],0.12,0.12);
      toast((TOOL_ICON[id]||'⚽')+' Sello: <b>'+(TOOL_NAME[id]||id)+'</b>'+(dobleHoy?' ·2x':'')+' +'+(10*(dobleHoy?2:1))+'XP');
    }
    if(bonusXP) addXP(bonusXP);
    var done=Object.keys(S.done).length;
    if(done>=1) unlock('primer','Primer sello en el pasaporte');
    if(done>=10) unlock('diez','10 herramientas jugadas');
    if(done>=TOOLS.length) unlock('lleno','¡Pasaporte completo!');
    refreshIndex();
  }

  // ===== fecha (sin Date.now en hot-path de scripts de workflow; acá es página normal) =====
  function stamp(){ return Date.now(); }
  function hoyStr(){ var d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function seedFromDate(s){ var h=0; for(var i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))>>>0; } return h; }
  function desafioHoy(){ var s=hoyStr(); var idx=seedFromDate(s)%DESAFIOS.length; var dd=DESAFIOS[idx];
    var dobleHoy=DOBLE.indexOf(new Date().getDay())>=0;
    return {fecha:s, reto:dd, doble:dobleHoy, hecho: !!(S.dia.done&&S.dia.done[s]), racha:S.dia.racha||0}; }
  function marcarDesafio(){ var s=hoyStr(); if(!S.dia.done) S.dia.done={};
    if(S.dia.done[s]) return;
    // racha: si el último fue ayer, +1; si no, reset a 1
    var ayer=new Date(); ayer.setDate(ayer.getDate()-1);
    var ay=ayer.getFullYear()+'-'+String(ayer.getMonth()+1).padStart(2,'0')+'-'+String(ayer.getDate()).padStart(2,'0');
    S.dia.racha = (S.dia.date===ay)? (S.dia.racha||0)+1 : 1;
    S.dia.date=s; S.dia.done[s]=1; save(S);
    addXP(15); tone([523,659,784,1047,1319],0.16,0.14);
    toast('🔥 ¡Desafío del Día listo! +15XP · Racha '+S.dia.racha, true);
    if(S.dia.racha>=3) unlock('fuego','Fuego Pampeano (3 días seguidos)');
    refreshIndex();
  }

  // ===== Localidad (Capa 2) =====
  function setLoc(v){ S.loc=v||''; save(S); refreshIndex(); if(!CUR) setTimeout(onboard, 400); }
  function loc(){ return S.loc||''; }
  function askLoc(force){
    if(S.loc && !force) return;
    var bd=document.createElement('div'); bd.className='pj-modal-bd';
    var opts='<option value="">— Elegí tu localidad —</option>'+LOCS.map(function(l){return '<option'+(l===S.loc?' selected':'')+'>'+l+'</option>';}).join('')+'<option value="__otra">Otra localidad…</option>';
    bd.innerHTML='<div class="pj-modal">'+
      '<div class="pj-m-tit">¿DE QUÉ LOCALIDAD SOS?</div>'+
      '<div class="pj-m-sub">Tu localidad va en tu figurita, tu crack y tu pasaporte. ¡Banca a los tuyos!</div>'+
      '<select class="pj-sel" id="pj-loc-sel">'+opts+'</select>'+
      '<input class="pj-inp" id="pj-loc-otra" placeholder="Escribí tu localidad" style="display:none">'+
      '<button class="pj-btn" id="pj-loc-ok">DALE, LISTO</button>'+
      (force?'<button class="pj-btn ghost" id="pj-loc-x">Cerrar</button>':'')+
      '</div>';
    document.body.appendChild(bd);
    var sel=bd.querySelector('#pj-loc-sel'), otra=bd.querySelector('#pj-loc-otra');
    sel.onchange=function(){ otra.style.display = sel.value==='__otra'?'block':'none'; };
    bd.querySelector('#pj-loc-ok').onclick=function(){
      var v = sel.value==='__otra' ? (otra.value.trim()) : sel.value;
      if(!v){ sel.focus(); return; }
      setLoc(v); bd.remove(); toast('🇦🇷 ¡Vamos '+v+'!');
    };
    var x=bd.querySelector('#pj-loc-x'); if(x) x.onclick=function(){ bd.remove(); };
  }

  // ===== Mi Pasaporte (overlay) =====
  function openPasaporte(){
    var arr=sellosArr(); var lv=levelOf(S.xp); var nx=nextLevel(S.xp);
    var pct = nx ? Math.round(((S.xp - LEVELS[lv.idx][0]) / (nx[0]-LEVELS[lv.idx][0]))*100) : 100;
    var grid=TOOLS.map(function(t){ var on=arr.indexOf(t[0])>=0; return '<div class="pj-cell'+(on?' on':'')+'" title="'+t[1]+'">'+t[2]+'</div>'; }).join('');
    var logros=Object.keys(S.logros);
    var logrosHtml = logros.length ? logros.map(function(k){return '<span class="pj-badge">🏅 '+S.logros[k].t+'</span>';}).join('') : '<span class="pj-dim">Todavía no desbloqueaste logros. ¡A jugar!</span>';
    var cr=cromosState(); var crOn=cr.filter(function(x){return x.on;}).length;
    var crHtml=cr.map(function(x){ return '<div class="pj-cromo'+(x.on?' on':'')+'" title="'+x.c.n+' · '+x.c.r+'" style="border-color:'+(x.on?RAR_COL[x.c.r]:'rgba(244,236,216,.12)')+'"><span class="pj-cr-e">'+(x.on?x.c.e:'❓')+'</span><span class="pj-cr-n">'+(x.on?x.c.n:'???')+'</span></div>'; }).join('');
    var titulo = tituloActual();
    var bd=document.createElement('div'); bd.className='pj-modal-bd';
    bd.innerHTML='<div class="pj-modal pj-pass">'+
      '<button class="pj-x" id="pj-pass-x">✕</button>'+
      '<div class="pj-p-head"><div class="pj-p-lvl">'+lv.name+'</div>'+
        '<div class="pj-p-loc">'+(S.loc?('📍 '+S.loc):'📍 elegí tu localidad')+'</div>'+
        (titulo?'<div class="pj-p-title">«'+titulo+'»</div>':'')+'</div>'+
      '<div class="pj-xpbar"><div class="pj-xpfill" style="width:'+pct+'%"></div></div>'+
      '<div class="pj-xptxt">'+S.xp+' XP'+(nx?(' · faltan '+(nx[0]-S.xp)+' para '+nx[1]):' · ¡máximo nivel!')+'</div>'+
      '<div class="pj-p-lab">SELLOS ('+arr.length+'/'+TOOLS.length+')</div>'+
      '<div class="pj-grid">'+grid+'</div>'+
      '<div class="pj-p-lab">LOGROS</div><div class="pj-badges">'+logrosHtml+'</div>'+
      '<div class="pj-p-lab">COLECCIÓN PAMPEANA ('+crOn+'/'+CROMOS.length+')</div><div class="pj-cromos">'+crHtml+'</div>'+
      '<button class="pj-btn" id="pj-pass-dl">📸 BAJAR MI PASAPORTE</button>'+
      '<button class="pj-btn ghost" id="pj-pass-loc">Cambiar mi localidad</button>'+
      '</div>';
    document.body.appendChild(bd);
    bd.querySelector('#pj-pass-x').onclick=function(){ bd.remove(); };
    bd.querySelector('#pj-pass-loc').onclick=function(){ bd.remove(); askLoc(true); };
    bd.querySelector('#pj-pass-dl').onclick=function(){ downloadPass(bd.querySelector('.pj-pass')); };
  }
  // ===== Juicy compartido: confeti + golazo (Capa 5) =====
  function confetti(n){ n=n||44; var cols=['#75AADB','#ffffff','#d4a82e','#4ade80','#f4cd60'];
    for(var i=0;i<n;i++){ var p=document.createElement('div'); p.className='pj-confeti';
      p.style.left=(Math.random()*100)+'vw'; p.style.background=cols[i%cols.length];
      p.style.animationDuration=(1.6+Math.random()*1.2)+'s'; p.style.animationDelay=(Math.random()*0.35)+'s';
      document.body.appendChild(p); (function(el){ setTimeout(function(){ el.remove(); }, 3200); })(p); } }
  function golazo(){ tone([392,523,659,784,1047],0.22,0.16); try{ if(navigator.vibrate) navigator.vibrate([30,40,60]); }catch(e){} }

  // ===== Onboarding mínimo (Capa 5): 3 primeras cosas para hacer, una sola vez =====
  function onboard(){
    if(S.onboard) return; S.onboard=1; save(S);
    var bd=document.createElement('div'); bd.className='pj-modal-bd';
    bd.innerHTML='<div class="pj-modal"><div class="pj-m-tit">¡BIENVENIDO/A!</div>'+
      '<div class="pj-m-sub">Tres cosas para arrancar y llenar tu pasaporte:</div>'+
      '<div class="pj-steps">'+
        '<div class="pj-step"><b>1</b> Creá tu Crack y bajá tu figurita 🎽</div>'+
        '<div class="pj-step"><b>2</b> Hacé el Desafío del Día 🔥</div>'+
        '<div class="pj-step"><b>3</b> Sumá sellos jugando y subí de nivel 🎟️</div>'+
      '</div><button class="pj-btn" id="pj-onb-ok">¡DALE, A JUGAR!</button></div>';
    document.body.appendChild(bd);
    bd.querySelector('#pj-onb-ok').onclick=function(){ bd.remove(); };
  }

  function tituloActual(){
    var lv=levelOf(S.xp).idx, L=S.loc||'La Pampa';
    if(lv>=5) return 'Leyenda de '+L;
    if(lv>=4) return 'El Crack de '+L;
    if(lv>=3) return 'Referente de '+L;
    if(lv>=2) return 'Capitán de '+L;
    if(lv>=1) return 'Titular de '+L;
    return '';
  }
  function downloadPass(node){
    if(typeof html2canvas==='undefined'){ toast('Sacá una captura de pantalla para compartirlo 📲'); return; }
    html2canvas(node,{backgroundColor:'#0a0f0a',scale:2}).then(function(c){
      var a=document.createElement('a'); a.download='mi-pasaporte-pampa-juega.png'; a.href=c.toDataURL('image/png'); a.click();
    }).catch(function(){ toast('No se pudo bajar; probá una captura 📲'); });
  }

  // ===== refrescar contadores del index si existen =====
  function refreshIndex(){
    var n=document.getElementById('pj-xp'); if(n) n.textContent=S.xp+' XP · '+levelOf(S.xp).name;
    if(typeof window.renderSellos==='function'){ try{ window.renderSellos(); }catch(e){} }
  }

  // ===== CSS =====
  var css=document.createElement('style');
  css.textContent=
    '.pj-toast{position:fixed;left:50%;bottom:18px;transform:translate(-50%,20px);z-index:99999;background:#0d2a18;border:2px solid #4ade80;color:#f4ecd8;font-family:system-ui,sans-serif;font-size:.86rem;padding:.6rem .9rem;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.6);opacity:0;transition:.3s;max-width:90vw;text-align:center}'+
    '.pj-toast.on{opacity:1;transform:translate(-50%,0)}'+
    '.pj-toast.big{border-color:#f4cd60;background:#2a1f06;font-size:1rem}'+
    '.pj-toast b{color:#f4cd60}'+
    '.pj-modal-bd{position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:1rem;overflow:auto}'+
    '.pj-modal{background:#0f160f;border:2px solid #d4a82e;border-radius:16px;padding:1.3rem;max-width:420px;width:100%;color:#f4ecd8;font-family:system-ui,sans-serif;box-shadow:0 16px 50px rgba(0,0,0,.8);position:relative;max-height:92vh;overflow:auto}'+
    '.pj-m-tit{font-family:"Anton",sans-serif;font-size:1.5rem;letter-spacing:.04em;color:#f4cd60;text-align:center}'+
    '.pj-m-sub{font-size:.82rem;opacity:.85;text-align:center;margin:.4rem 0 .9rem;line-height:1.4}'+
    '.pj-sel,.pj-inp{width:100%;background:rgba(0,0,0,.5);border:2px solid rgba(244,236,216,.3);color:#f4ecd8;padding:.7rem;border-radius:8px;font-family:inherit;font-size:1rem;margin-bottom:.6rem}'+
    '.pj-btn{width:100%;background:linear-gradient(135deg,#75AADB,#4d8fc7);color:#04212e;border:none;padding:.85rem;border-radius:10px;font-family:"Anton",sans-serif;letter-spacing:.08em;font-size:1.05rem;cursor:pointer;text-transform:uppercase;margin-top:.3rem}'+
    '.pj-btn.ghost{background:transparent;border:1px solid rgba(244,236,216,.35);color:#f4ecd8;font-size:.9rem}'+
    '.pj-x{position:absolute;top:8px;right:12px;background:none;border:none;color:#f4ecd8;font-size:1.2rem;cursor:pointer;opacity:.7}'+
    '.pj-p-head{text-align:center;margin-bottom:.6rem}'+
    '.pj-p-lvl{font-family:"Anton",sans-serif;font-size:1.6rem;color:#f4cd60;line-height:1}'+
    '.pj-p-loc{font-size:.8rem;opacity:.85;margin-top:.2rem}'+
    '.pj-p-title{font-size:.85rem;color:#4ade80;margin-top:.2rem;font-style:italic}'+
    '.pj-xpbar{height:12px;background:rgba(0,0,0,.5);border-radius:6px;overflow:hidden;border:1px solid rgba(212,168,46,.4)}'+
    '.pj-xpfill{height:100%;background:linear-gradient(90deg,#4ade80,#d4a82e);transition:width .5s}'+
    '.pj-xptxt{font-size:.7rem;font-family:"JetBrains Mono",monospace;opacity:.8;text-align:center;margin:.35rem 0 .6rem}'+
    '.pj-p-lab{font-family:"JetBrains Mono",monospace;font-size:.6rem;letter-spacing:.18em;color:#d4a82e;text-transform:uppercase;margin:.6rem 0 .35rem}'+
    '.pj-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:.4rem}'+
    '.pj-cell{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:1.2rem;background:rgba(0,0,0,.45);border:1px solid rgba(244,236,216,.12);border-radius:8px;filter:grayscale(1);opacity:.4;transform:rotate(-2deg)}'+
    '.pj-cell.on{filter:none;opacity:1;border-color:#4ade80;background:rgba(74,222,128,.12);transform:rotate(1.5deg)}'+
    '.pj-badges{display:flex;flex-wrap:wrap;gap:.35rem}'+
    '.pj-badge{font-size:.72rem;background:rgba(212,168,46,.15);border:1px solid rgba(212,168,46,.5);color:#f4cd60;border-radius:20px;padding:.2rem .55rem}'+
    '.pj-dim{font-size:.78rem;opacity:.6}'+
    '.pj-cromos{display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem}'+
    '.pj-cromo{display:flex;flex-direction:column;align-items:center;gap:2px;padding:.4rem .2rem;border:2px solid;border-radius:10px;background:rgba(0,0,0,.4);opacity:.45;filter:grayscale(1)}'+
    '.pj-cromo.on{opacity:1;filter:none;background:rgba(255,255,255,.04)}'+
    '.pj-cr-e{font-size:1.3rem;line-height:1}'+
    '.pj-cr-n{font-size:.5rem;font-family:"JetBrains Mono",monospace;text-align:center;line-height:1.1;opacity:.9}'+
    '.pj-steps{display:flex;flex-direction:column;gap:.45rem;margin:.3rem 0 .9rem}'+
    '.pj-step{display:flex;align-items:center;gap:.6rem;background:rgba(0,0,0,.4);border:1px solid rgba(244,236,216,.15);border-radius:10px;padding:.55rem .7rem;font-size:.88rem}'+
    '.pj-step b{flex:none;width:1.5rem;height:1.5rem;display:flex;align-items:center;justify-content:center;background:#75AADB;color:#04212e;border-radius:50%;font-family:"Anton",sans-serif}'+
    '.pj-confeti{position:fixed;top:-16px;width:9px;height:14px;border-radius:2px;z-index:99997;pointer-events:none;animation:pjfall linear forwards}'+
    '@keyframes pjfall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(105vh) rotate(540deg);opacity:.9}}';
  document.head.appendChild(css);

  // ===== arranque =====
  var CUR=null;
  (function detect(){ var m=location.pathname.match(/([^\/]+)\.html?$/); if(m){ CUR=TOOL_BY_FILE[m[1]]||null; } })();

  function boot(){
    // Capa 2: pedir localidad la 1ª vez
    askLoc(false);
    // Capa 5: onboarding en el home (si ya tiene localidad y no lo vio)
    if(!CUR && S.loc) setTimeout(onboard, 500);
    // Capa 3: marcar sello de la herramienta actual (confiable: con visitarla alcanza)
    if(CUR) setTimeout(function(){ sello(CUR); }, 600);
    refreshIndex();
  }
  if(document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);

  window.PampaJuego = {
    sello:sello, addXP:addXP, unlock:unlock, loc:loc, setLoc:setLoc, askLoc:function(){askLoc(true);},
    openPasaporte:openPasaporte, desafioHoy:desafioHoy, marcarDesafio:marcarDesafio,
    confetti:confetti, golazo:golazo,
    levelName:function(){return levelOf(S.xp).name;}, xp:function(){return S.xp;}, titulo:tituloActual, TOOLS:TOOLS, CUENTA:CUENTA
  };
})();
