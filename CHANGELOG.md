# Changelog — Pampa Juega

Registro de cambios del sitio. En vivo: https://juventudlapampa.github.io/pampa-juega/

## 2026-06-01

Jornada grande: auditoría completa + rediseño "menos IA, más cancha argentina". 8 commits (`5fc2d7f` → `5cfd989`).

### Datos del Mundial 2026
- **Fixture** y **Predictor**: cargado el **sorteo oficial real** (12 grupos, con los repechajes de marzo ya resueltos). Ambas herramientas ahora coinciden.
- Fix del Predictor: tocar un equipo ya rankeado borraba a él y a todos los de abajo → ahora solo lo quita a él.

### Gambeteá como Leo (rehecho)
- De "guitar hero" a juego de **decisiones**: leer la postura del rival, esquivar al hueco, sombrero/caño.
- **Arco horizontal** en perspectiva y **mano a mano estilo Supercampeones** (apuntar + tipo de tiro + carga de pierna).
- Jugador y rivales **corriendo** (piernas animadas); rivales que se acercan y se plantan para leerlos.
- Fix del **cuelgue al chocar**: el rival "robado" usaba `#9aa` (hex de 3 dígitos) y `shade()` generaba un color inválido → `addColorStop` lanzaba excepción y congelaba el canvas. Color válido + `shade()` robusto.

### Sala de Escape
- Acertar ya **no cuenta como error** (contador renombrado a "Errores"); sonidos de "selección" (sin buzzer) + ambiente de hinchada.
- Escena **panorámica explorable** (mirar a los costados), texturas por sala y transición de "caminar".
- Niveles **Fácil/Difícil** y **pistas visibles dentro de la sala**.

### Creá tu Crack
- Selector **¿Cómo te identificás?** (Mujer / Varón / Prefiero no decir): el avatar (pelo, silueta) y los apodos se adaptan.
- **+5 peinados** (Melena, Ondas, Coletas, Rodete, Bob) y **+3 accesorios** (Aros, Flor, Gorrito); todas las opciones disponibles para cualquier género.
- Fix bug "siempre ¡NUEVO RÉCORD!"; se permite zoom (accesibilidad).
- Limpieza de apodos poco inclusivos.

### Género y lenguaje (ESI)
- **Carrera de Futbolista**: género correcto (M/F/X) en finales y opciones (fix "DINA vive tranquilo").
- **Juego Limpio (ESI)**: pregunta el género; situaciones inclusivas (no asumen varón); resultado según género. Unificado a 11 situaciones.
- Sin apología de alcohol ("AGUANTA MÁS BIRRA" → "TIENE MÁS AGUANTE"); lenguaje inclusivo corregido.

### Hub y look (menos IA, más cancha)
- Fondo plano con **grano/textura** (tipo papel de figurita) en lugar del degradé "default de IA".
- Fuera **azul y violeta**: paleta a **celeste Selección, dorado y amarillo relato**.
- **Íconos propios** SVG en las 5 secciones y en las 20 tarjetas (adiós emojis).
- Asimetría tipo álbum, **voz relator/hincha** en títulos, secciones y juegos.
- **Banderines**, marquesina de **banderas**, **cuenta regresiva** al pitazo inicial, **papelitos** celestes y blancos.
- Datos de jugadores actualizados; bandera de Inglaterra corregida; jugadores de países no clasificados reemplazados.

### Sonido
- **Hinchada de fondo + bombo** en el hub y en los 12 juegos (`pampa-ambiente.js`, con botón para silenciar). Cada juego conserva sus propios efectos.

### Transversal
- README reactualizado, links "← Volver a Pampa Juega", limpieza de código muerto.
- Regla fija de contenido: **nunca** el meme "La Pampa no existe"; La Pampa siempre con orgullo.
- JS validado en los 21 archivos y verificación en navegador en cada tanda.
