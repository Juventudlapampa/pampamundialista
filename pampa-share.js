/* Pampa Juega · helper compartido para Story 9:16 + Web Share
   Uso:  pampaStory(nodo, 'MI CARNET DE HINCHA', 'historia-carnet')
         pampaShare(nodo, 'texto para compartir')
   Requiere html2canvas ya cargado en la página. */
(function(){
  const SITE = 'juventudlapampa.github.io/pampa-juega';
  const CUENTA = '@pampajuega';

  function capture(node){
    const w = node.offsetWidth, h = node.offsetHeight;
    const orig = node.getAttribute('style') || '';
    node.style.cssText = orig + `;width:${w}px!important;height:${h}px!important;max-width:${w}px!important;max-height:${h}px!important;overflow:hidden!important;box-sizing:border-box!important;`;
    return html2canvas(node, { backgroundColor:null, scale:3, useCORS:true, allowTaint:true, logging:false, width:w, height:h,
      windowWidth:document.documentElement.clientWidth, windowHeight:document.documentElement.clientHeight,
      onclone:(doc)=>{ /* re-forzar dims en clones con mismo id si existe */ }
    }).then(c=>{ node.setAttribute('style', orig); return c; });
  }

  function composeStory(card, subtitle){
    const SW=1080, SH=1920, st=document.createElement('canvas'); st.width=SW; st.height=SH;
    const g=st.getContext('2d');
    const grad=g.createLinearGradient(0,0,SW,SH); grad.addColorStop(0,'#081b10'); grad.addColorStop(1,'#0d3b26');
    g.fillStyle=grad; g.fillRect(0,0,SW,SH);
    g.fillStyle='rgba(212,168,46,0.10)'; g.beginPath(); g.arc(170,250,300,0,7); g.fill();
    g.fillStyle='rgba(74,222,128,0.08)'; g.beginPath(); g.arc(910,1700,360,0,7); g.fill();
    g.textAlign='center';
    g.fillStyle='#d4a82e'; g.font='bold 50px Arial'; g.fillText('PAMPA JUEGA', SW/2, 150);
    g.fillStyle='rgba(244,236,216,0.85)'; g.font='27px Arial'; g.fillText(subtitle||'MUNDIAL 2026', SW/2, 200);
    // card centrada, ancho máx 760, respetando ratio
    const maxW=760, maxH=1180;
    let cw=maxW, ch=cw*card.height/card.width;
    if(ch>maxH){ ch=maxH; cw=ch*card.width/card.height; }
    const cx=(SW-cw)/2, cy=290;
    g.save(); g.shadowColor='rgba(0,0,0,0.55)'; g.shadowBlur=40; g.shadowOffsetY=16;
    g.drawImage(card, cx, cy, cw, ch); g.restore();
    const py=cy+ch+80;
    g.fillStyle='#f4cd60'; g.font='bold 36px Arial'; g.fillText('Hacé la tuya gratis 👇', SW/2, py);
    g.fillStyle='rgba(244,236,216,0.92)'; g.font='28px Arial'; g.fillText(SITE, SW/2, py+52);
    g.fillStyle='#4ade80'; g.font='bold 30px Arial'; g.fillText(CUENTA+' · #DesafioPampaJuega', SW/2, py+110);
    return st;
  }

  window.pampaStory = function(node, subtitle, filename){
    return capture(node).then(card=>{
      const story = composeStory(card, subtitle);
      const link=document.createElement('a'); link.download=(filename||'historia-pampa-juega')+'.png';
      link.href=story.toDataURL('image/png'); link.click();
    }).catch(e=>alert('Error: '+e.message));
  };

  window.pampaShare = function(node, text){
    return capture(node).then(card=>{
      card.toBlob(blob=>{
        const file=new File([blob],'pampa-juega.png',{type:'image/png'});
        if(navigator.canShare && navigator.canShare({files:[file]})){ navigator.share({files:[file], text, title:'Pampa Juega'}).catch(()=>{}); }
        else if(navigator.share){ navigator.share({text, title:'Pampa Juega'}).catch(()=>{}); }
        else if(navigator.clipboard){ navigator.clipboard.writeText(text).then(()=>alert('¡Texto copiado! Descargá la imagen y subila etiquetando a '+CUENTA),()=>{}); }
        else alert('Descargá la imagen y subila etiquetando a '+CUENTA);
      });
    });
  };
})();
