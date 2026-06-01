# Pampa Juega · Mundial 2026

Suite de juegos y generadores web de la **Subsecretaría de Juventudes de La Pampa** para vivir el Mundial 2026. Todo es HTML/CSS/JS vanilla, **sin build, sin login, sin servidor**: cada pieza es un archivo `.html` independiente que se puede abrir solo, compartir solo o usar offline. Mobile-first.

🔗 **En vivo:** https://juventudlapampa.github.io/pampa-juega/

## Cómo usar

Abrí `index.html` en cualquier navegador. Es el hub que linkea a las 20 actividades, lleva el "pasaporte de sellos" (localStorage) y explica el **Desafío Pampa Juega** y la **Tarjeta Joven**.

Para publicar: es un sitio estático. Hoy se sirve con **GitHub Pages** desde la rama `main`.

## Estructura

```
pampa-juega/
├── index.html                          ← Hub / pasaporte / Desafío
├── pampa-share.js                      ← Helper compartido (Story 9:16 + Web Share)
├── favicon.svg · og-image.png
├── generadores/
│   ├── 01-figurita.html                Figurita estilo Panini con tu foto
│   ├── 02-armar-11.html                Armá tu 11 (Argentina o ideal del mundo)
│   ├── 03-carnet.html                  Carnet de hincha
│   ├── 13-figurita-promo.html          Figurita de la promo / del curso
│   └── 19-fut5-aula.html               El fútbol 5 del aula (5 alumnos + profe DT)
├── herramientas/
│   ├── 09-fixture.html                 Fixture completo (grupos + eliminatorias)
│   └── 24-predictor.html               Predictor del campeón
└── juegos/
    ├── 07-bingo.html                   Cartón mundialista
    ├── 08-trivia.html                  Trivia relámpago (V/F, banco 150+)
    ├── 14-que-seleccion-sos.html       ¿Qué selección sos? (test, 24 selecciones)
    ├── 15-tiros-libres.html            Tiros libres (canvas, curva)
    ├── 16-simulador-partido.html       Simulador con stats (15 jugadores x equipo)
    ├── 18-torneo-penales.html          Torneo de penales (bracket de 8)
    ├── 20-carrera-futbolista.html      Tu carrera (dado de la vida, 12 finales)
    ├── 21-sala-escape.html             Sala de escape (5 acertijos)
    ├── 23-memorice.html                Memo mundial (banderas, 3 niveles)
    ├── 25-picado.html                  El picado (simulador 5v5, decisiones)
    ├── 26-juego-limpio.html            Juego Limpio · ESI (11 situaciones)
    ├── 27-crear-crack.html             Creá tu Crack (avatar + 2 minijuegos)
    └── 28-gambeta-leo.html             Gambeteá como Leo (decisiones + mano a mano)
```

## Agrupación en el hub

- **Creá tu Crack:** crear-crack, figurita, carnet, armar-11.
- **Desafío FUT:** penales, tiros libres, picado, gambeta-leo, carrera.
- **Ponete a Prueba:** trivia, qué-selección, sala-escape, memorice.
- **Tu Pronóstico:** predictor, fixture, bingo/cartón.
- **Para tu Grupo:** fut5-aula, figurita-promo, simulador, juego-limpio (ESI).

## Datos del Mundial

El **fixture** y el **predictor** usan el sorteo **oficial** del 5/12/2025 (12 grupos de 4 = 48 selecciones, con los ganadores de los repechajes de marzo 2026 ya incorporados). Ambas herramientas comparten los mismos grupos. Primera ronda eliminatoria = 16avos (Round of 32).

## Stack técnico

- HTML5 + CSS3 + Vanilla JS. Sin frameworks, sin npm.
- Tipografías Google Fonts (CDN): **Anton**, **DM Sans**, **JetBrains Mono**.
- Persistencia con `localStorage`.
- Descarga/compartir de imágenes con **html2canvas** (CDN) + `pampa-share.js`.
- Web Audio API para sonidos en los juegos arcade.

## Identidad visual

- Verde cancha `#0d3b26` · Dorado `#d4a82e` / `#f4cd60` · Crema `#f4ecd8` · Fondo `#050d08` · Rojo acento `#dc2626`.

## Criterios de contenido

- **Sin apuestas** ni dinero real. Los pronósticos son sin plata, estilo PRODE.
- **Mirada ESI** y lenguaje inclusivo. Sin apología de alcohol ni contenido inapropiado para 14+.
- No tiene relación oficial con la FIFA: es contenido cultural y de participación juvenil de La Pampa.
