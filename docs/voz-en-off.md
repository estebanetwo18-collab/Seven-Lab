# Voz en off — BOLD Agency × SevenLab (46 s)

La voz ya está generada e integrada en el video (`public/audio/voz.mp3`, y
mezclada en `public/audio/banda-sonora.mp3`). Voz: **es-CR-JuanNeural**
(neural, Costa Rica), con EQ, compresión y la música que baja sola cuando habla.

El texto fuente está en `assets/audio/voz/guion.tsv`; se regenera con
`python video/voz.py` y se mezcla con `python video/mezcla.py`.

## Texto (como suena)

| Inicio | Plano | Voz |
|---|---|---|
| 0:00,3 | Negro: "Hola, somos BOLD Agency" | Hola, somos BOLD Agency: tu socio estratégico de crecimiento. |
| 0:04,1 | Línea → franja → fachada | Esta es una propuesta para SevenLab. |
| 0:07,5 | Montaje (drop de la música) | Fuerza. · Técnica. · Comunidad. · Pasión. *(una palabra por foto)* |
| 0:11,3 | "Lo que tienen adentro…" | Lo que tienen adentro es mejor de lo que se ve desde afuera. |
| 0:14,1 | 1 reseña · 11 semanas | Hoy: una reseña en Google, y once semanas sin publicar. |
| 0:17,5 | Lista gigante | Por eso armamos un solo paquete, con todo incluido. |
| 0:20,3 | Posts flotando | Contenido que se ve, y conversaciones que se convierten. |
| 0:22,9 | Chat de WhatsApp | Un asistente de WhatsApp que responde al instante y agenda pruebas. |
| 0:26,4 | "Entrená fuerte…" | Entrená fuerte, sin lesionarte y nunca solo. |
| 0:29,1 | Landing · 100% · paquete | Una landing page de regalo, y cien por ciento de involucramiento. |
| 0:32,7 | Tarjetas 3D | Ordenar, comunicar, vender, crecer. |
| 0:35,3 | ₡165.000 | Todo el paquete: ciento sesenta y cinco mil colones, por dos meses de prueba. |
| 0:39,3 | Barra de búsqueda | *(sin voz: tipeo + clic)* |
| 0:41,5 | Logo | BOLD Agency y SevenLab. Empecemos esta semana. |

En el guion, "landing page" está escrito "lándin péich" para que la voz en
español lo pronuncie en inglés.

## Verificación

Transcribí la mezcla final con Whisper (modelo *small*, español): todas las
frases se reconocen prácticamente palabra por palabra, incluidas
"BOLD Agency", "landing page" y "165 mil colones". Para que "BOLD" se entienda, la música baja 6 dB extra
justo cuando se dice la marca.

## Si querés otra voz (ElevenLabs)

Generá cada frase por separado con el mismo texto, guardalas como
`assets/audio/voz/<id>.wav` (01, 02, 03a…13) y corré `python video/mezcla.py`
y `npm run video:render`. Ajustes sugeridos: Multilingual v2, Stability ~45 %,
Similarity ~75 %, Style ~20 %.
