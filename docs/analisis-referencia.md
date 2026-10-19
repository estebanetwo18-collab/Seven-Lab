# Análisis del video de referencia

Archivo: `assets/eloqwnt_showreel_2025_q2_1080p.mp4`

## Datos técnicos (ffprobe)

| Dato | Valor |
|---|---|
| Duración | 23,98 s |
| Resolución | 1920 × 1080 |
| Cuadros por segundo | 60 |
| Video | H.264, ~1,5 Mb/s |
| Audio | AAC, ~190 kb/s (música) |

## Cómo lo medí

```bash
# Cortes de escena (umbral 0,25)
ffmpeg -i ref.mp4 -vf "select='gt(scene,0.25)',showinfo" -vsync vfr cuts/%03d.jpg
# Hojas de contacto cada 0,25 s (4×6), tramos 0–6, 6–12, 12–18 y 18–24 s
ffmpeg -ss 0 -t 6 -i ref.mp4 -vf "fps=4,scale=480:-1,drawtext=…,tile=4x6" -frames:v 1 sheet_0.jpg
```

Además saqué cuadros a tamaño completo (1,0 s, 4,5 s, 10,0 s y 12,8 s) y medí
con Python/PIL el alto y ancho de los textos.

**Cortes detectados (s):** 5,70 · 6,03 · 6,52 · 7,02 · 7,52 · 8,05 · 10,87 ·
13,95 · 15,23 · 15,75 · 16,32 · 16,92 · 17,52 · 18,10 · 19,10 · 22,43.
Las transiciones de texto (0–5 s, 8–10 s, 11–13 s) no son cortes: son
fundidos con desenfoque, por eso no aparecen en la lista.

## Lo que se ve, plano por plano (medido)

| Tramo | Qué pasa | Medición |
|---|---|---|
| 0–3,1 s | Negro con 2 bandas diagonales de brillo muy tenue que se desplazan. "Hi, we're Eloqwnt" → "Your Strategic Creative Partner". | Texto de frase ≈ 36–40 px de cuerpo (la frase mide ≈ 430 px de ancho). Cada palabra tarda ≈ 0,5 s en pasar de gris a blanco; escalonado ≈ 0,12 s (más lento que los 60–90 ms del brief). La última palabra (la marca) se queda gris más tiempo. Salida: fundido + blur en ≈ 0,25 s. |
| 3,1–4,0 s | "We're experts in" y una línea de 1–2 px que se dibuja desde el centro **a la altura del texto** y llega casi a todo el ancho. | Línea: 3,4 → 3,75 s (≈ 0,35–0,4 s, expo-out). El texto desaparece cuando la línea termina. |
| 4,0–5,7 s | La línea se abre en una franja blanca (letterbox). Frase palabra por palabra en oscuro, partiendo de celeste-gris. | Franja: de ~2 px a ~220 px en ≈ 0,25 s; luego sigue creciendo a ~260 px. Corte a foto en 5,70 s (no se abre a pantalla completa: corta). |
| 5,7–8,05 s | Montaje: mockups (parada de bus, cajas, tarjetas apiladas, tarjetas con parallax, teléfono con UI). | Cortes cada ≈ 0,5 s (5,70 / 6,03 / 6,52 / 7,02 / 7,52). Cada plano tiene micro-movimiento (zoom/paneo leve). |
| 8,05–9,75 s | Negro, "Purpose-driven design that moves…" → "people and business". | Mismo revelado por palabra. |
| 9,75–10,87 s | Lista gigante de servicios, blanca, alineada a la izquierda (x ≈ 83 px), que sube como rodillo. | Cuerpo ≈ 150 px, paso entre líneas ≈ 205 px. Velocidad ≈ 4 líneas/s. Líneas que entran y salen con blur. |
| 10,87–12,5 s | Blanco: "From startups" → fondo celeste muy claro (#E8F4FB aprox.) "to industry leaders" con ~12 miniaturas rotadas flotando alrededor. | Rotaciones de −20° a 20°; entran desde fuera de cuadro con overshoot leve. |
| 12,5–13,95 s | Blanco, "We turn bold ideas into" → "unforgettable experiences." | Cuerpo ≈ 56 px. |
| 13,95–17,5 s | Segundo montaje: tarjeta con foto que gira/zoom, bloque verde con texto grande, trazos de gradiente sobre negro, cursor que hace clic en un check (el check se dibuja), grilla de piezas de marca. | Planos de 0,5–0,6 s. Clic: escala 1 → 0,9 → 1 en ≈ 0,2 s. |
| 17,5–18,1 s | Muro de decenas de miniaturas que se aleja. | Escala ≈ 1,3 → 1 en 0,5 s. |
| 18,1–19,1 s | Negro con tarjetas flotando en 3D alrededor de "Let's design your next breakthrough". | Perspectiva marcada, giro en Y lento. |
| 19,1–21,0 s | Fondo celeste degradado; la grilla se convierte en círculos blancos con íconos de línea que se ordenan en una grilla limpia 7×3. | Movimiento tipo resorte suave (≈ 0,7 s). |
| 21,0–22,4 s | Los íconos se juntan en una barra de búsqueda; se escribe la URL letra por letra y un cursor hace clic en la lupa. | ≈ 45 ms por carácter. |
| 22,43–24 s | Blanco, logo con revelado por máscara, letra por letra. | Escalonado ≈ 40 ms por letra. |

## Lenguaje general (confirmado)

- Contraste negro / blanco / pastel (celeste), mucho espacio vacío, **una sola idea por plano**.
- Sans geométrica; frases pequeñas (~40 px a 1080p) y listas gigantes (~150 px).
- Nada se mueve linealmente: todo es expo-out (`cubic-bezier(0.16, 1, 0.3, 1)`) o resorte.
- Los cortes del montaje caen cada ~0,5 s, sobre el pulso de la música.

## Diferencias con el brief y cómo las ajusté

| Brief | Medido | Decisión en el video de SevenLab |
|---|---|---|
| Escalonado por palabra 60–90 ms | ≈ 120 ms, con la última palabra más lenta | Usé 70–90 ms en frases cortas y 120–140 ms en frases de 4 palabras ("Ordenar. Comunicar. Vender. Crecer."). Color gris → blanco más lento que la opacidad, como en la referencia. |
| Lista sube ~110 px | Paso ≈ 205 px a 150 px de cuerpo, ~4 líneas/s | Cuerpo 118 px, paso 146 px, un paso cada 0,29 s (≈ 3,4 líneas/s). |
| La franja se abre a pantalla completa | La referencia corta a la foto | Mantuve la apertura a pantalla completa del guion (más fluida), en 0,6 s con expo-in-out. |
| Fotos a pantalla completa | — | Las fotos son de ~800 px: las uso desenfocadas de fondo y nítidas en una tarjeta, para no ver pixelado. |

## Cómo apliqué cada técnica

| Técnica de la referencia | Dónde está en el código | Escena SevenLab |
|---|---|---|
| Revelado por palabra (opacidad, blur 8→0, y 10→0, gris→blanco) | `src/shared/Text.tsx` → `WordReveal` | 1, 2, 3, 5, 8, 10, 12, 13, 15 y todos los títulos de la landing |
| Línea desde el centro | `DrawLine` | 2 (y bajo los títulos de la landing, línea de tiempo) |
| Letterbox que se abre | `video/scenes/part1.tsx` → `Franja` | 3 |
| Montaje 0,5 s con micro-zoom 1→1,06 | `PhotoPlane`, `Montaje` | 4 y 11 |
| Rodillo de lista con blur en los bordes | `Lista` | 7 |
| Tarjetas rotadas que entran con overshoot | `Contenido` (back-out) | 8 (posts de Instagram con fotos del box) |
| Cursor + clic + check con stroke-dashoffset | `CheckDraw`, `CursorArrow` | 9 |
| Bloque de color con texto gigante, trazos de gradiente, grilla | `Montaje2` | 11 |
| Muro de miniaturas 1,3 → 1 | `Montaje2` (último plano) | 11 |
| Tarjetas 3D con perspectiva | `Pilares` | 12 |
| Revelado por máscara letra por letra | `CharReveal`, `Logotype` | 13 (₡165.000) y 15 (logo) |
| Íconos → grilla (resorte) → barra de búsqueda, tipeo a 45 ms/carácter | `Busqueda` | 14 |

## Comparación final (hoja de contacto fps=4, 6×6)

Revisé el render completo con `fps=4,tile=6x6` contra las hojas de la
referencia. Correcciones que hice después de esa revisión:

- El contador "11" movía la fila al cambiar de 1 a 2 dígitos → ancho fijo.
- El rodillo mostraba 6–7 líneas a la vez (más cargado que la referencia) → se desvanecen antes, quedan ~4 nítidas.
- El chat del teléfono se leía chico → teléfono 15 % más grande.
- En la versión vertical una tarjeta 3D tapaba la frase → reubicada.

No copié textos, marcas, mockups ni logos de la referencia: solo su técnica,
ritmo y curvas.
