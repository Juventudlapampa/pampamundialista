# Mundial 2026 · Suite de 16 herramientas

Suite completa de herramientas HTML standalone para cuenta de Instagram dedicada al Mundial 2026. Todo funciona offline, mobile-first, sin login, sin servidor.

**Novedades v4:**
- **Fixture completo unificado** (09): la fase de grupos y las eliminatorias ahora viven en una sola herramienta con tabs. Cuando completás los grupos, las llaves se arman solas con los 32 clasificados. Penales si empatan. Campeón al final.
- Fix de bugs en Plantel FUT (modal que se rompía al click rápido).
- Mejor perspectiva en Tiros Libres (arco y pelota más grandes, halo pulsante en la pelota).

## Cómo usar

Abrí `index.html` en cualquier navegador. Es el hub que linkea a las 14 herramientas. Cada una es un archivo HTML independiente que se puede abrir solo, compartir solo, o usar offline.

Para que tu equipo (Nacho, Tincho) pueda probar y compartir las herramientas: copiá toda la carpeta a un Drive compartido o súbila a un hosting estático tipo Netlify, GitHub Pages o el dominio que ya tienen.

## Estructura

```
mundial2026/
├── index.html                          ← Hub navegación
├── generadores/
│   ├── 01-figurita.html                Figurita estilo Panini
│   ├── 02-armar-11.html                Armá tu 11 ideal
│   ├── 03-carnet.html                  Carnet del hincha FIFA
│   ├── 04-rpg.html                     Perfil RPG por selección
│   └── 13-figurita-promo.html          ★ NUEVO · Figurita de la promo
├── juegos/
│   ├── 05-simulador.html               Simulador táctico
│   ├── 06-quiz.html                    Quiz · 120+ preguntas
│   ├── 07-bingo.html                   Bingo del partido
│   ├── 08-trivia.html                  Trivia relámpago · 130+ V/F
│   ├── 12-penal-arcade.html            Penal Arcade (con Panenka y muerte súbita)
│   ├── 14-que-seleccion-sos.html       Test de personalidad
│   ├── 15-tiros-libres.html            🔥 NUEVO · Tiros Libres Arcade (Canvas)
│   ├── 16-simulador-partido.html       🔥 NUEVO · Simulador con stats
│   └── 17-plantel-fut.html             🔥 NUEVO · Plantel FUT-Style
└── herramientas/
    ├── 09-fixture.html                 ★ NUEVO · Torneo completo (grupos + eliminatorias)
    └── 11-comparador.html              Comparador histórico
```

## Las 14 herramientas

### Generadores visuales (5)

**01 · Figurita Mundialista** — Subís foto, asignás país, número, posición y stats. Card estilo álbum lista para descargar como PNG.

**02 · Armá tu 11 Ideal** — Cancha SVG con 5 formaciones tácticas y un pool de 46 jugadores reales del Mundial. Drag & drop. Exportás como imagen.

**03 · Carnet Mundialista** — Credencial FIFA del hincha. Foto, nombre, país, ciudad, ID único. Para que cada uno tenga su carnet.

**04 · Perfil RPG** — 25 selecciones con su ficha mítica completa: clase, atributos, habilidad especial, debilidad fatal, leyenda. Versión literaria, no estadística.

**13 · Figurita de la Promo** *(nuevo)* — En vez de stats inventados como en la 01, acá cargás cualidades reales del personaje: "mejor chamuyero", "llega tarde a todo", frase típica, "más probable que se case primero". Yearbook al palo.

### Juegos HTML (6)

**05 · Simulador Táctico** — Elegís selección, rival, formación y mentalidad. La IA simula 90 minutos con marcador, eventos y narrativa.

**06 · Quiz Mundialista** — 15 preguntas extraídas aleatoriamente de un banco de **120+** sobre historia de los mundiales, Argentina, Brasil, Europa, jugadores, récords y Mundial 2026. Ranking persistente con localStorage.

**07 · Bingo del Partido** — Tarjeta 5×5 random con eventos típicos. Tildás mientras mirás. Línea o bingo completo.

**08 · Trivia Relámpago** — 20 preguntas V/F extraídas aleatoriamente de un banco de **130+**, con countdown de 10 segundos, sonidos generados, multiplicador por racha y shake en errores.

**12 · Penal Arcade** *(versión arcade total)* — Definición 5 vs 5 con relato narrado, **modo Panenka oculto** (centro + power muy bajo = +75 bonus), **muerte súbita** si empatan, power bar más rápida en súbita, atajadas con tap reactivo. Bonus por golazos de ángulo. Ranking persistente.

**14 · ¿Qué Selección Sos Vos?** *(nuevo)* — Test de personalidad estilo Buzzfeed. 8 preguntas, sistema de scoring por ejes (creatividad, disciplina, garra, líder, analítico, épico, pragmático…). Te asigna una de 25 selecciones con ficha completa: clase, superpoder, kryptonita, leyenda.

### 🔥 Arcade Pro (3 nuevos)

**15 · Tiros Libres Arcade** — Juego en **Canvas 2.5D con físicas reales** (gravedad + efecto Magnus para curva). Arrastrás desde la pelota para apuntar, soltás para patear, en el aire le metés curva con los botones izquierda/derecha. Muro de defensores que salta (cada nivel sube más alto), arquero con IA predictiva que mejora por nivel. **10 niveles** con distancia creciente del arco (18m → 28m). Sistema de estrellas (★, ★★ o ★★★ según calidad del gol). Ranking persistente.

**16 · Simulador de Partido con Stats** — Elegís 2 de **25 selecciones cargadas con stats reales** (ataque, mediocampo, defensa, arquero, moral). Simulación minuto a minuto con log de eventos en vivo: tiros, atajadas, tiros libres, penales, tarjetas, expulsiones. La **posesión** se calcula dinámicamente según mediocampo. Cambiás tu táctica (defensivo/equilibrado/ofensivo) en cualquier momento y eso modifica los stats efectivos. **La IA del rival también adapta** la táctica según el marcador. Controles de pausa y velocidad ×1/×2/×4.

**17 · Plantel FUT-Style** — **55 cartas estilo FIFA Ultimate Team** con OVR + 6 stats (PAC/SHO/PAS/DRI/DEF/PHY). **5 tiers visuales**: bronce, plata, oro, especial, icon. Drag-and-pick para armar tu 11 en formación 4-3-3. **Química automática** por nacionalidad y liga compartida (líneas de colores entre jugadores conectados). OVR del equipo se calcula con boost por química. Filtros por posición, búsqueda. Descargás tu plantel como imagen para compartir.

### Herramientas interactivas (2)

**09 · Fixture Completo** — 12 grupos × 4 equipos = 48 selecciones del formato nuevo. Cargás resultados, la tabla se ordena sola. Calcula clasificados a 16avos.

**10 · Bracket Eliminatorio** — Cuadro de 32 equipos desde 16avos a final. Cada match con opción de penales. Visualización del avance.

**11 · Comparador Histórico** — Elegís dos selecciones y compara: títulos mundiales, finales, partidos jugados, goles, jugador histórico. Lado a lado.

## Stack técnico

- HTML5 + CSS3 + Vanilla JS
- Sin frameworks, sin build, sin npm
- Tipografías Google Fonts (cargadas desde CDN)
- Persistencia con localStorage
- Descarga de imágenes con html2canvas (CDN)
- Web Audio API para sonidos en juegos arcade

## Identidad visual

Paleta unificada:
- Verde cancha `#0d3b26`
- Dorado `#d4a82e` y `#f4cd60`
- Crema `#f4ecd8`
- Negro `#0a0a0a`
- Rojo de acento `#dc2626`

Tipografías:
- **Anton** para display
- **DM Sans** para cuerpo
- **JetBrains Mono** para datos
- **Cinzel** para piezas RPG/místicas

## Sin apuestas

Ninguna herramienta tiene apuestas con dinero real ni links a casas de apuestas. Los pronósticos son sin dinero, estilo PRODE/quiniela tradicional.
