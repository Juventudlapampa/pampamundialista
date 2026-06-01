/* Pampa Juega · firma institucional — Subsecretaría de Juventud · La Pampa.
   Incluir con: <script src="../pampa-marca.js"></script>  (en la raíz: "pampa-marca.js")
   Reproduce el sistema del manual de marca: wordmark JUVENTUDES letra por letra
   con los 10 colores oficiales (Archivo Black) + línea institucional.
   Inyecta un pie de marca al final del <body> (flujo normal, no tapa la UI del
   juego) y expone window.PampaMarca.wordmark(opts) por si una página quiere
   colocar el logo en su propio header (lo usa el index en el hero). */
(function(){
  if (window.__pampaMarca) return; window.__pampaMarca = true;

  // Colores oficiales J-U-V-E-N-T-U-D-E-S (manual de marca Subsecretaría de Juventud)
  var COLS = ['#9B3DAA','#2B3A8F','#00968A','#5CB83A','#F5C400','#F58220','#E03A2F','#E8317A','#5CB83A','#2BAADC'];
  var WORD = 'JUVENTUDES';

  // Base = carpeta donde vive este script (la raíz del sitio). Así el logo oficial
  // resuelve bien desde cualquier subcarpeta (juegos/, generadores/...) y en GitHub Pages.
  var SELF = document.currentScript;
  var BASE = (SELF && SELF.src) ? SELF.src.replace(/[^/]*$/, '') : '';
  var LOGO = BASE + 'assets/logo-subse-blanco.png';
  var LOGO_ALT = 'Subsecretaría de Juventud · Ministerio de Desarrollo Social y Derechos Humanos · La Pampa';

  // Tipografía del wordmark (Archivo Black) si la página no la cargó
  function ensureFont(){
    if(document.querySelector('link[data-pm-font]')) return;
    try{
      var pc=document.createElement('link'); pc.rel='preconnect'; pc.href='https://fonts.gstatic.com'; pc.crossOrigin='';
      document.head.appendChild(pc);
      var l=document.createElement('link'); l.rel='stylesheet'; l.setAttribute('data-pm-font','1');
      l.href='https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap';
      document.head.appendChild(l);
    }catch(e){}
  }

  // Devuelve el HTML del wordmark JUVENTUDES coloreado letra por letra.
  // opts: { size:'1.4rem', gap:'.01em' }
  function wordmark(opts){
    opts = opts || {};
    var size = opts.size || '1.35rem';
    var html = '';
    for(var i=0;i<WORD.length;i++){
      html += '<span style="color:'+COLS[i]+'">'+WORD.charAt(i)+'</span>';
    }
    return '<span class="pm-word" style="font-size:'+size+'" aria-label="JUVENTUDES">'+html+'</span>';
  }

  ensureFont();

  var css=document.createElement('style');
  css.textContent =
    '.pm-word{font-family:"Archivo Black",sans-serif;font-weight:400;letter-spacing:.005em;line-height:1;white-space:nowrap;display:inline-block}'+
    '.pm-foot{position:relative;z-index:5;margin-top:2.2rem;padding:1.25rem 1rem calc(1.4rem + env(safe-area-inset-bottom,0px));text-align:center;background:#0e0e12;color:#cfcfd6;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}'+
    '.pm-foot .pm-rule{position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,'+COLS.join(',')+')}'+
    '.pm-foot .pm-sig{max-width:680px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:.7rem}'+
    '.pm-foot .pm-word{font-size:1.4rem}'+
    '.pm-foot .pm-logo{height:48px;width:auto;max-width:94%;object-fit:contain;opacity:.96}'+
    '.pm-foot .pm-line{font-size:.72rem;letter-spacing:.04em;color:#9a9aa4;line-height:1.5}'+
    '.pm-foot .pm-line b{color:#e7e7ee;font-weight:600}'+
    '@media(max-width:480px){.pm-foot .pm-word{font-size:1.15rem}.pm-foot .pm-logo{height:38px}.pm-foot .pm-line{font-size:.66rem}}';
  document.head.appendChild(css);

  function build(){
    if(document.querySelector('.pm-foot')) return;
    var f=document.createElement('footer');
    f.className='pm-foot';
    f.innerHTML =
      '<div class="pm-rule"></div>'+
      '<div class="pm-sig">'+
        wordmark({size:'1.4rem'})+
        '<img class="pm-logo" src="'+LOGO+'" alt="'+LOGO_ALT+'" loading="lazy">'+
      '</div>';
    document.body.appendChild(f);
  }
  if(document.body) build(); else document.addEventListener('DOMContentLoaded', build);

  window.PampaMarca = { wordmark: wordmark, colors: COLS };
})();
