# 🧠 Memoria — Juego de Cartas

Un juego de memoria (memory match) hecho con HTML, CSS y JavaScript puro, sin dependencias.

## Cómo jugar

Abre [`index.html`](index.html) en tu navegador y empieza a jugar. No requiere instalación ni servidor.

- Voltea dos cartas por turno para encontrar las parejas.
- El temporizador arranca con tu primer clic.
- Elige un **tema** (animales, frutas, espacio o caras) y una **dificultad** (4×4, 4×6 o 6×6).
- Tu mejor tiempo por tema y dificultad se guarda en el navegador (`localStorage`).

## Estructura del proyecto

| Archivo       | Descripción                                  |
| ------------- | --------------------------------------------- |
| `index.html`  | Estructura de la página y el tablero de juego |
| `style.css`   | Estilos, animaciones y modo claro/oscuro       |
| `script.js`   | Lógica del juego (mezcla de cartas, turnos, temporizador, mejores puntajes) |

## Características

- 4 temas de emojis distintos
- 3 niveles de dificultad
- Contador de tiempo e intentos
- Mejor puntaje guardado localmente por tema y dificultad
- Soporte para modo claro y oscuro según las preferencias del sistema
- Diseño responsive
