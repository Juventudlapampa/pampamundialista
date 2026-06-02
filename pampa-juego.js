/* Pampa Mundialista · META-JUEGO (sin servidor, todo en localStorage)
   Capas: 2) Localidad pampeana · 3) Pasaporte RPG (sellos + XP + niveles + títulos + logros)
          4) Desafío del Día (determinístico por fecha) + racha.
   Incluir con: <script src="../pampa-juego.js"></script>  (en la raíz: "pampa-juego.js")
   Expone window.PampaJuego con API para que las herramientas sumen sellos/logros.
*/
(function(){
  if (window.__pampaJuego) return; window.__pampaJuego = true;

  // ===== Cuenta de redes (definida): @pampamundialista =====
  var CUENTA = (window.CUENTA || '@pampamundialista');
  var SITE = 'juventudlapampa.github.io/pampamundialista';

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
  var LOCS = ['25 de Mayo','Adolfo Van Praet','Agustoni','Algarrobo del Águila','Alpachiri','Alta Italia',
    'Anguil','Arata','Ataliva Roca','Bernardo Larroudé','Bernasconi','Caleufú','Carro Quemado','Catriló',
    'Ceballos','Chacharramendi','Colonia Barón','Conhelo','Coronel Hilario Lagos','Cuchillo-Có','Doblas',
    'Eduardo Castex','Embajador Martini','Falucho','General Acha','General Pico','Gobernador Duval','Guatraché',
    'Ingeniero Luiggi','Intendente Alvear','Jacinto Arauz','La Adela','La Humada','La Maruja','La Reforma',
    'Limay Mahuida','Lonquimay','Luan Toro','Macachín','Maisonnave','Mariano Miró','Mauricio Mayer','Metileo',
    'Miguel Riglos','Monte Nievas','Naicó','Parera','Pichi Huinca','Puelches','Puelén','Quehué','Quemú Quemú',
    'Rancul','Realicó','Rolón','Santa Isabel','Santa Rosa','Sarah','Speluzzi','Telén','Toay',
    'Tomás M. de Anchorena','Trenel','Uriburu','Vértiz','Victorica','Villa Mirasol','Winifreda'];

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
  if(typeof S.vip!=='boolean') S.vip=false; if(!S.vipNum) S.vipNum=''; if(typeof S.vipWelcome!=='boolean') S.vipWelcome=false;
  try{ if(S.vip) document.documentElement.classList.add('pj-vip'); }catch(e){}

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
    if(!S.done[id]){ S.done[id]=1; var base=10*(dobleHoy?2:1)*(S.vip?2:1); S.xp+=base; save(S);
      tone([600,820,1000],0.12,0.12);
      toast((TOOL_ICON[id]||'⚽')+' Sello: <b>'+(TOOL_NAME[id]||id)+'</b>'+(dobleHoy?' ·2x':'')+(S.vip?' ·OFICIAL x2':'')+' +'+base+'XP');
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
        (titulo?'<div class="pj-p-title">«'+titulo+'»</div>':'')+
        (S.vip?'<div class="pj-p-title" style="color:#f4cd60">⭐ Jugador Oficial</div>':'')+'</div>'+
      '<div class="pj-xpbar"><div class="pj-xpfill" style="width:'+pct+'%"></div></div>'+
      '<div class="pj-xptxt">'+S.xp+' XP'+(nx?(' · faltan '+(nx[0]-S.xp)+' para '+nx[1]):' · ¡máximo nivel!')+'</div>'+
      '<div class="pj-p-lab">SELLOS ('+arr.length+'/'+TOOLS.length+')</div>'+
      '<div class="pj-grid">'+grid+'</div>'+
      '<div class="pj-p-lab">LOGROS</div><div class="pj-badges">'+logrosHtml+'</div>'+
      '<div class="pj-p-lab">COLECCIÓN PAMPEANA ('+crOn+'/'+CROMOS.length+')</div><div class="pj-cromos">'+crHtml+'</div>'+
      '<button class="pj-btn" id="pj-pass-dl">📥 DESCARGAR MI PASAPORTE</button>'+
      '<div style="font-size:.72rem;opacity:.82;text-align:center;margin:.35rem 0 .2rem">Bajalo como imagen y <b>subilo al formulario de inscripción</b> para entrar a los sorteos. 🎟️</div>'+
      '<button class="pj-btn" id="pj-pass-grupo" style="background:linear-gradient(135deg,#d4a82e,#f4cd60);color:#04212e">⚽ ARMAR MI EQUIPO</button>'+
      '<button class="pj-btn ghost" id="pj-pass-loc">Cambiar mi localidad</button>'+
      '</div>';
    document.body.appendChild(bd);
    bd.querySelector('#pj-pass-x').onclick=function(){ bd.remove(); };
    bd.querySelector('#pj-pass-loc').onclick=function(){ bd.remove(); askLoc(true); };
    bd.querySelector('#pj-pass-dl').onclick=function(){ downloadPass(bd.querySelector('.pj-pass')); };
    bd.querySelector('#pj-pass-grupo').onclick=function(){ bd.remove(); pasaporteGrupal(); };
  }
  // ===== Juicy compartido: confeti + golazo (Capa 5) =====
  function confetti(n){ n=n||44; var cols=['#75AADB','#ffffff','#d4a82e','#4ade80','#f4cd60'];
    for(var i=0;i<n;i++){ var p=document.createElement('div'); p.className='pj-confeti';
      p.style.left=(Math.random()*100)+'vw'; p.style.background=cols[i%cols.length];
      p.style.animationDuration=(1.6+Math.random()*1.2)+'s'; p.style.animationDelay=(Math.random()*0.35)+'s';
      document.body.appendChild(p); (function(el){ setTimeout(function(){ el.remove(); }, 3200); })(p); } }
  function golazo(){ tone([392,523,659,784,1047],0.22,0.16); try{ if(navigator.vibrate) navigator.vibrate([30,40,60]); }catch(e){} }

  // ===== Compartir viral (texto propio por herramienta) =====
  // opts: { texto:'gancho', modo:'wsp'|'share' }. Cierra siempre con el link + #PampaMundialista.
  function compartir(opts){
    opts = opts || {};
    var texto = (opts.texto || '¡Jugá en Pampa Mundialista!');
    var full = texto + ' ⚽ ' + SITE + ' #PampaMundialista';
    try { golazo(); confetti(20); } catch(e) {}
    if (opts.modo === 'wsp') {
      // Desafío directo: abre WhatsApp con el texto pre-cargado (en La Pampa manda el grupo del curso)
      window.open('https://wa.me/?text=' + encodeURIComponent(full), '_blank');
      return;
    }
    // Mostrarse: menú nativo -> portapapeles -> prompt
    if (navigator.share) { navigator.share({ title: 'Pampa Mundialista', text: full }).catch(function(){}); }
    else if (navigator.clipboard) { navigator.clipboard.writeText(full).then(function(){ toast('¡Texto copiado! Pegalo en tu historia o en el grupo 📲'); }, function(){ try { prompt('Copiá tu texto:', full); } catch(e){} }); }
    else { try { prompt('Copiá tu texto:', full); } catch(e){} }
  }

  // ===== Tarjeta Joven = Modo Jugador Oficial (sin servidor; valida solo el FORMATO, local) =====
  function applyVip(){ try{ document.documentElement.classList.toggle('pj-vip', !!S.vip); }catch(e){} }
  function tieneTarjeta(){ return !!S.vip; }
  function activarTarjeta(num){
    var clean=(num||'').replace(/[^0-9]/g,'');
    // Debe tener exactamente 5 dígitos
    if(!/^[0-9]{5}$/.test(clean)) return {ok:false, msg:'Revisá el número: la Tarjeta Joven tiene 5 dígitos.'};
    var v=parseInt(clean,10);
    // Descartar números obviamente falsos aunque cumplan el formato (5 iguales, o secuencias)
    var fake = /^(\d)\1{4}$/.test(clean) || ['12345','54321','23456','34567','45678','56789','01234','98765'].indexOf(clean)>=0;
    // Rango válido del padrón (NO se le muestra el tope al usuario)
    if(fake || v<1 || v>27500) return {ok:false, msg:'Ese número no nos figura. Revisá tu Tarjeta Joven 🤔'};
    var first=!S.vipWelcome;
    S.vip=true; S.vipNum=clean; if(first) S.vipWelcome=true; save(S); applyVip();
    if(first){ addXP(30); unlock('jugador-oficial','Jugador Oficial ⭐'); }
    refreshIndex(); try{ confetti(46); }catch(e){}
    toast('⭐ ¡Listo, crack! Sos <b>Jugador Oficial</b> de Pampa Mundialista. Duplicás tus chances en el sorteo y tu figurita ahora tiene el dorado.', true);
    return {ok:true};
  }
  function tarjetaWidget(el){
    if(!el) return;
    function render(){
      if(S.vip){
        el.innerHTML='<div class="pj-vip-on"><div class="pj-vip-t">⭐ MODO JUGADOR OFICIAL ACTIVO</div>'+
          '<div class="pj-vip-d">Tus cartas tienen el dorado y <b>duplicás tus chances en el sorteo</b>. Ya estás en la lista para los premios.</div>'+
          (S.vipNum?'<div class="pj-vip-n">Tarjeta •••• '+S.vipNum.slice(-4)+'</div>':'')+'</div>';
      } else {
        el.innerHTML='<div class="pj-tjw"><div class="pj-tjw-t">🎟️ Validá tu Tarjeta Joven</div>'+
          '<div class="pj-tjw-s">Activá el <b>Modo Jugador Oficial</b>: dorado en tus cartas y <b>duplicás tus chances en el sorteo</b> de premios.</div>'+
          '<input class="pj-inp" id="pj-tjw-num" inputmode="numeric" autocomplete="off" placeholder="Número de tu Tarjeta Joven">'+
          '<button class="pj-btn" id="pj-tjw-ok">ACTIVAR MODO JUGADOR OFICIAL</button>'+
          '<div class="pj-tjw-err" id="pj-tjw-err" role="alert"></div>'+
          '<div class="pj-tjw-legal">Solo validamos que el número tenga <b>forma válida</b>; <b>no se envía a ningún lado</b> (no hay servidor). El número se verifica de verdad recién cuando reclamás un premio.</div>'+
          '<a class="pj-tjw-link" href="https://tarjetajoven.lapampa.gob.ar" target="_blank" rel="noopener">¿No la tenés? Sacala gratis en 3 minutos 👇</a></div>';
      }
      var ok=el.querySelector('#pj-tjw-ok');
      if(ok) ok.onclick=function(){ var inp=el.querySelector('#pj-tjw-num'); var r=activarTarjeta(inp?inp.value:''); if(!r.ok){ var e=el.querySelector('#pj-tjw-err'); if(e) e.textContent=r.msg; } else { render(); } };
    }
    el.__pjRender=render; render();
  }

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
    var lv=levelOf(S.xp).name, L=S.loc||'mi pueblo';
    var cap='Voy '+lv+' en Pampa Mundialista, sumando para '+L+' 🔥 '+CUENTA;
    // 9:16 listo para historias (pampa-share compone el formato vertical)
    if(typeof window.pampaStory==='function'){
      window.pampaStory(node, 'MI PASAPORTE · '+L.toUpperCase(), 'mi-pasaporte-pampa');
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(cap).then(function(){ toast('📸 ¡Bajaste tu pasaporte 9:16! Texto copiado: pegalo en tu historia 🔥'); }, function(){ toast('📸 ¡Bajaste tu pasaporte! Subilo a tu historia 🔥'); }); }
      else toast('📸 ¡Bajaste tu pasaporte! Subilo a tu historia 🔥');
      return;
    }
    if(typeof html2canvas!=='undefined'){
      html2canvas(node,{backgroundColor:'#0a0f0a',scale:2}).then(function(c){ var a=document.createElement('a'); a.download='mi-pasaporte-pampa.png'; a.href=c.toDataURL('image/png'); a.click(); }).catch(function(){ toast('No se pudo bajar; probá una captura 📲'); });
      return;
    }
    toast('Sacá una captura de pantalla para compartirlo 📲');
  }

  // ===== Pasaporte GRUPAL (aula, club, etc.) — todo local, sin servidor =====
  var EQ_ROLES=['Capitán','Titular 2','Titular 3','Titular 4','Titular 5','Suplente 1','Suplente 2','Suplente 3'];
  var EQ_COLS=['#75AADB','#d4a82e','#4ade80','#dc2626','#2563eb','#e8317a','#00968a'];
  function eqColor(nombre){ var h=0,s=String(nombre||'Pampa'); for(var i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return EQ_COLS[h%EQ_COLS.length]; }
  function eqInic(nombre){ var p=String(nombre||'').trim().split(/\s+/).filter(Boolean); return ((p[0]||'P')[0]+((p[1]||'')[0]||'')).toUpperCase(); }

  // ===== Armar / inscribir el EQUIPO de futbol 5 (capitan + 4 + hasta 3 suplentes) =====
  function pasaporteGrupal(){
    var saved={}; try{ saved=JSON.parse(localStorage.getItem('pampa-equipo')||'{}'); }catch(e){ saved={}; }
    var J=saved.jugadores||[];
    function locSel(id,val){ return '<select class="pj-sel" id="'+id+'" style="margin:0">'+'<option value="">— Localidad —</option>'+LOCS.map(function(l){return '<option'+(l===val?' selected':'')+'>'+l+'</option>';}).join('')+'</select>'; }
    var rowsHtml='';
    for(var i=0;i<8;i++){
      var j=J[i]||{}; var titular=i<5;
      var defLoc=(i===0?(j.loc||S.loc):j.loc)||'';
      rowsHtml+='<div style="border:1px solid rgba(244,236,216,.15);border-radius:10px;padding:.5rem .6rem;margin-bottom:.5rem;background:'+(titular?'rgba(212,168,46,.06)':'rgba(255,255,255,.02)')+'">'+
        '<div style="font-family:\'Anton\',sans-serif;font-size:.75rem;letter-spacing:.06em;color:'+(i===0?'#f4cd60':(titular?'#d4a82e':'#75AADB'))+';margin-bottom:.35rem">'+(i===0?'🅒 CAPITÁN':(titular?('⚽ '+EQ_ROLES[i]):('🔁 '+EQ_ROLES[i]+' (opcional)')))+'</div>'+
        '<input class="pj-inp" id="eq-n-'+i+'" style="margin-bottom:.35rem" maxlength="32" placeholder="Nombre y apellido" value="'+esc(j.n||'').replace(/"/g,'&quot;')+'">'+
        '<div style="display:flex;gap:.4rem">'+
          '<input class="pj-inp" id="eq-num-'+i+'" style="margin:0;flex:1" inputmode="numeric" maxlength="12" placeholder="N° Tarjeta Joven" value="'+esc(j.num||'')+'">'+
          '<div style="flex:1">'+locSel('eq-loc-'+i,defLoc)+'</div>'+
        '</div></div>';
    }
    var bd=document.createElement('div'); bd.className='pj-modal-bd';
    bd.innerHTML='<div class="pj-modal"><button class="pj-x" id="eq-x">✕</button>'+
      '<div class="pj-m-tit">⚽ Mi Equipo</div>'+
      '<div class="pj-m-sub">Armá tu <b>fútbol cinco</b>: vos de capitán + 4 titulares, y hasta 3 suplentes. Para los premios, cada integrante necesita <b>14–30 años</b> y <b>Tarjeta Joven</b>.</div>'+
      '<input class="pj-inp" id="eq-nombre" maxlength="36" placeholder="Nombre del equipo (ej: Los Pibes del Caldén)" value="'+esc(saved.nombre||'').replace(/"/g,'&quot;')+'">'+
      rowsHtml+
      '<div style="font-family:\'Anton\',sans-serif;font-size:.75rem;letter-spacing:.06em;color:#4ade80;margin:.4rem 0 .35rem">📞 CONTACTO DEL CAPITÁN (solo del capitán)</div>'+
      '<input class="pj-inp" id="eq-cel" inputmode="tel" maxlength="22" placeholder="Celular del capitán" value="'+esc(saved.cel||'')+'">'+
      '<input class="pj-inp" id="eq-mail" inputmode="email" maxlength="50" placeholder="Mail del capitán" value="'+esc(saved.mail||'')+'">'+
      '<div class="pj-tjw-legal" style="font-size:.72rem;opacity:.82;margin:.2rem 0 .6rem">El cel y el mail son <b>solo para que Juventud se comunique por el concurso</b>. Los números de Tarjeta <b>se validan al entregar los premios</b>. Acá no se manda nada: queda en tu celu.</div>'+
      '<button class="pj-btn" id="eq-priv">📥 DESCARGAR FICHA PRIVADA (para el concurso)</button>'+
      '<div style="font-size:.72rem;opacity:.82;text-align:center;margin:.35rem 0 .2rem">Esta es la que <b>subís al formulario grupal</b> (con números y contacto). No la publiques.</div>'+
      '<button class="pj-btn" id="eq-pub" style="background:linear-gradient(135deg,#4ade80,#22c55e)">📸 DESCARGAR IMAGEN PÚBLICA (para redes)</button>'+
      '<div style="font-size:.72rem;opacity:.82;text-align:center;margin:.35rem 0 .2rem">Sin números ni contacto: para subir a tus redes y etiquetar a '+CUENTA+'.</div>'+
      '<button class="pj-btn ghost" id="eq-cancel">Cerrar</button></div>';
    document.body.appendChild(bd);
    function collect(){
      var nombre=(bd.querySelector('#eq-nombre').value||'').trim();
      var jug=[];
      for(var i=0;i<8;i++){ var n=(bd.querySelector('#eq-n-'+i).value||'').trim(); if(!n) continue;
        jug.push({rol:EQ_ROLES[i], n:n, num:(bd.querySelector('#eq-num-'+i).value||'').replace(/[^0-9]/g,''), loc:bd.querySelector('#eq-loc-'+i).value||'', titular:i<5}); }
      var data={nombre:nombre, jugadores:jug, cel:(bd.querySelector('#eq-cel').value||'').trim(), mail:(bd.querySelector('#eq-mail').value||'').trim()};
      try{ localStorage.setItem('pampa-equipo', JSON.stringify(data)); }catch(e){}
      return data;
    }
    bd.querySelector('#eq-x').onclick=bd.querySelector('#eq-cancel').onclick=function(){ collect(); bd.remove(); };
    bd.querySelector('#eq-priv').onclick=function(){ var d=collect(); if(!d.nombre){ toast('Ponele un nombre al equipo 🏷️'); return; } if(!d.jugadores.length){ toast('Cargá al menos al capitán'); return; } renderEquipoPrivado(d); bd.remove(); };
    bd.querySelector('#eq-pub').onclick=function(){ var d=collect(); if(!d.nombre){ toast('Ponele un nombre al equipo 🏷️'); return; } if(!d.jugadores.length){ toast('Cargá al menos al capitán'); return; } renderEquipoPublico(d); bd.remove(); };
  }

  function teamCanvas(card, filename, bg, okMsg){
    document.body.appendChild(card);
    var done=function(){ card.remove(); };
    if(typeof html2canvas!=='undefined'){
      html2canvas(card,{backgroundColor:bg,scale:2,useCORS:true}).then(function(c){
        var a=document.createElement('a'); a.download=filename; a.href=c.toDataURL('image/png'); a.click(); done(); if(okMsg) toast(okMsg);
      }).catch(function(){ done(); toast('No se pudo generar; probá una captura 📲'); });
    } else { done(); toast('Sacá una captura de pantalla 📲'); }
  }

  // FICHA PRIVADA: nombre, integrantes con N° y localidad, contacto del capitán. NO publicar.
  function renderEquipoPrivado(d){
    var rows=d.jugadores.map(function(x){ return '<tr><td style="padding:.3rem .4rem;color:'+(x.titular?'#d4a82e':'#75AADB')+';font-size:.7rem;white-space:nowrap">'+esc(x.rol)+'</td><td style="padding:.3rem .4rem">'+esc(x.n)+'</td><td style="padding:.3rem .4rem;font-family:monospace;color:#4ade80">'+(x.num?esc(x.num):'—')+'</td><td style="padding:.3rem .4rem;font-size:.82rem;opacity:.9">'+(esc(x.loc)||'—')+'</td></tr>'; }).join('');
    var card=document.createElement('div');
    card.style.cssText='position:fixed;left:-9999px;top:0;width:440px;background:linear-gradient(160deg,#0d3b26,#081b10);border:3px solid #d4a82e;border-radius:16px;padding:1.3rem;color:#f4ecd8;font-family:system-ui,sans-serif;box-sizing:border-box';
    card.innerHTML='<div style="text-align:center;font-family:\'Anton\',sans-serif;color:#dc2626;font-size:.72rem;letter-spacing:.18em">PAMPA MUNDIALISTA · FICHA PRIVADA DEL EQUIPO</div>'+
      '<div style="text-align:center;font-family:\'Anton\',sans-serif;font-size:1.7rem;line-height:1.05;margin:.3rem 0 .5rem">'+esc(d.nombre)+'</div>'+
      '<table style="width:100%;border-collapse:collapse;font-size:.9rem"><thead><tr style="color:#d4a82e;font-size:.6rem;letter-spacing:.1em;text-align:left"><th style="padding:.2rem .4rem">ROL</th><th style="padding:.2rem .4rem">NOMBRE</th><th style="padding:.2rem .4rem">N° TARJETA</th><th style="padding:.2rem .4rem">LOCALIDAD</th></tr></thead><tbody>'+rows+'</tbody></table>'+
      '<div style="margin:.7rem 0;padding:.6rem .7rem;background:rgba(0,0,0,.3);border-radius:8px;font-size:.85rem">📞 <b>Contacto del capitán:</b> '+(esc(d.cel)||'—')+' · '+(esc(d.mail)||'—')+'</div>'+
      '<div style="font-size:.66rem;line-height:1.45;color:rgba(244,236,216,.75)">🔒 <b>Ficha privada:</b> presentala por el canal privado del concurso. <b>No la publiques en redes</b> (tiene números de Tarjeta y datos de contacto). El cel y el mail son solo para que Juventud se comunique por el concurso. Los números se validan al entregar los premios.</div>';
    teamCanvas(card,'equipo-'+(d.nombre.toLowerCase().replace(/[^a-z0-9]+/g,'-')||'pampa')+'-PRIVADA.png','#081b10','📄 Ficha privada lista. Presentala por el canal privado del concurso (no la publiques).');
  }

  // IMAGEN PÚBLICA: escudo, nombre, cantidad y localidades. SIN números ni contacto.
  function renderEquipoPublico(d){
    var col=eqColor(d.nombre), ini=eqInic(d.nombre);
    var locs=[]; d.jugadores.forEach(function(x){ if(x.loc && locs.indexOf(x.loc)<0) locs.push(x.loc); });
    var card=document.createElement('div');
    card.style.cssText='position:fixed;left:-9999px;top:0;width:420px;background:linear-gradient(160deg,#0d3b26,#081b10);border:3px solid '+col+';border-radius:16px;padding:1.5rem 1.3rem;color:#f4ecd8;font-family:system-ui,sans-serif;box-sizing:border-box;text-align:center';
    card.innerHTML='<div style="font-family:\'Anton\',sans-serif;color:#d4a82e;font-size:.72rem;letter-spacing:.2em">PAMPA MUNDIALISTA · MI EQUIPO</div>'+
      '<div style="width:108px;height:108px;margin:.7rem auto .5rem;border-radius:24px;background:'+col+';display:flex;align-items:center;justify-content:center;font-family:\'Anton\',sans-serif;font-size:3rem;color:#06140c;border:3px solid rgba(255,255,255,.35);box-shadow:0 6px 18px rgba(0,0,0,.5)">'+esc(ini)+'</div>'+
      '<div style="font-family:\'Anton\',sans-serif;font-size:2rem;line-height:1.05;margin:.2rem 0">'+esc(d.nombre)+'</div>'+
      '<div style="font-size:1rem;margin:.3rem 0 .2rem">👥 '+d.jugadores.length+' jugador'+(d.jugadores.length!==1?'es':'')+'</div>'+
      (locs.length?('<div style="font-size:.9rem;opacity:.92;line-height:1.4">📍 De '+locs.length+' localidad'+(locs.length!==1?'es':'')+' de La Pampa:<br><b>'+locs.map(esc).join(' · ')+'</b></div>'):'')+
      '<div style="margin-top:1rem;font-size:.66rem;font-family:monospace;letter-spacing:.1em;color:rgba(244,236,216,.75)">'+CUENTA+' · #PampaMundialista<br>juventudlapampa.github.io/pampamundialista</div>';
    teamCanvas(card,'equipo-'+(d.nombre.toLowerCase().replace(/[^a-z0-9]+/g,'-')||'pampa')+'.png','#081b10','📸 ¡Imagen del equipo lista! Subila y etiquetá a '+CUENTA);
    var cap='Armamos «'+d.nombre+'» para Pampa Mundialista ⚽🔥 '+CUENTA+' #PampaMundialista';
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(cap).then(function(){},function(){}); }
  }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

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
    '@keyframes pjfall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(105vh) rotate(540deg);opacity:.9}}'+
    'html.pj-vip .pj-foilable{animation:pjFoil 2.6s ease-in-out infinite!important;border-radius:inherit}'+
    '@keyframes pjFoil{0%,100%{box-shadow:0 0 0 3px #d4a82e,0 0 14px rgba(212,168,46,.45)}50%{box-shadow:0 0 0 3px #f4cd60,0 0 28px rgba(212,168,46,.8)}}'+
    '.pj-tjw-t{font-family:"Anton",sans-serif;font-size:1.15rem;color:#f4cd60;letter-spacing:.03em}'+
    '.pj-tjw-s{font-size:.84rem;opacity:.9;margin:.25rem 0 .6rem;line-height:1.45}'+
    '.pj-tjw-err{color:#f87171;font-size:.78rem;min-height:1rem;margin-top:.3rem}'+
    '.pj-tjw-legal{font-size:.72rem;opacity:.72;line-height:1.45;margin-top:.5rem}'+
    '.pj-tjw-link{display:inline-block;margin-top:.6rem;color:#75AADB;font-weight:700;text-decoration:none}'+
    '.pj-vip-on{border:2px solid #d4a82e;border-radius:12px;padding:.8rem;background:linear-gradient(135deg,rgba(212,168,46,.16),rgba(244,205,96,.05))}'+
    '.pj-vip-t{font-family:"Anton",sans-serif;color:#f4cd60;letter-spacing:.04em}'+
    '.pj-vip-d{font-size:.82rem;opacity:.92;margin-top:.3rem;line-height:1.45}'+
    '.pj-vip-n{font-family:"JetBrains Mono",monospace;font-size:.7rem;opacity:.7;margin-top:.4rem}';
  document.head.appendChild(css);

  // ===== arranque =====
  var CUR=null;
  (function detect(){ var m=location.pathname.match(/([^\/]+)\.html?$/); if(m){ CUR=TOOL_BY_FILE[m[1]]||null; } })();

  function boot(){
    applyVip();
    var tjEl=document.getElementById('pj-tarjeta'); if(tjEl) tarjetaWidget(tjEl);
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
    openPasaporte:openPasaporte, pasaporteGrupal:pasaporteGrupal, desafioHoy:desafioHoy, marcarDesafio:marcarDesafio,
    confetti:confetti, golazo:golazo, compartir:compartir, SITE:SITE,
    tieneTarjeta:tieneTarjeta, activarTarjeta:activarTarjeta, tarjetaWidget:tarjetaWidget,
    levelName:function(){return levelOf(S.xp).name;}, xp:function(){return S.xp;}, titulo:tituloActual, TOOLS:TOOLS, CUENTA:CUENTA
  };
})();
