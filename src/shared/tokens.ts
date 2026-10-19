// Paleta y textos fijos de la propuesta. Una sola fuente para la landing y el video.

export const C = {
  black: '#0A0A0A',
  white: '#FFFFFF',
  gray: '#6B6B6B',
  ink: '#111312',
  sky1: '#EAF4FB',
  sky2: '#B9CFE0',
  forest: '#0E2A22',
  mint: '#4FC08D',
  brand: '#1E7A56',
  paper: '#F4F6F5',
} as const;

export const FONT = `'Manrope', 'ColonSign', system-ui, -apple-system, 'Segoe UI', sans-serif`;

export const PHOTO = {
  fachada: 'fotos/01_box_fachada.webp',
  equipo: 'fotos/02_comunidad_equipo.webp',
  banca: 'fotos/03_press_banca.webp',
  anillas: 'fotos/04_anillas.webp',
  levantamiento: 'fotos/05_levantamiento.webp',
  concentracion: 'fotos/06_concentracion.webp',
  grupo: 'fotos/07_rebel7ion_grupo.webp',
} as const;

export const CREDITOS = 'Fotos: Instagram @sevenlab7 · @recuerdos_fullframe';

export const PRECIO = '₡165.000';
export const PRECIO_DETALLE = 'por 2 meses de prueba';

export const WHATSAPP_URL = 'https://wa.me/50672445642';

/** Conversación de ejemplo (diapositiva 7 de la propuesta). */
export const CHAT = [
  { from: 'them', text: 'Hola, ¿qué horarios tienen? Nunca he entrenado.' },
  { from: 'us', text: '¡Hola! Tenemos clases para todos los niveles. ¿Preferís mañana o tarde?' },
  { from: 'them', text: 'En la tarde.' },
  { from: 'us', text: 'Perfecto. ¿Te agendo una clase de prueba el jueves a las 6:00 p. m.?' },
  { from: 'them', text: '¡Sí, dale!' },
] as const;

export type IconName =
  | 'instagram'
  | 'whatsapp'
  | 'google'
  | 'calendar'
  | 'dumbbell'
  | 'heart'
  | 'megaphone'
  | 'chart'
  | 'video'
  | 'browser'
  | 'users'
  | 'spark';

/** Los 8 elementos del paquete (diapositiva 5). */
export const PAQUETE: { title: string; desc: string; icon: IconName }[] = [
  { title: 'Presencia digital en orden', desc: 'Instagram y Google claros y completos', icon: 'google' },
  { title: '10 contenidos al mes', desc: 'Pensados, producidos y publicados', icon: 'video' },
  { title: 'Asistente de WhatsApp con IA', desc: 'Responde al instante y agenda pruebas', icon: 'whatsapp' },
  { title: 'Promociones que venden', desc: 'Ofertas que atraen sin bajar el valor', icon: 'megaphone' },
  { title: 'Comunidad que se queda', desc: 'Que tus miembros sigan y recomienden', icon: 'users' },
  { title: 'Reporte y acompañamiento', desc: 'Resultados y próximos pasos cada mes', icon: 'chart' },
  { title: 'Landing page de regalo', desc: 'Tu página web, lista para mostrar el box', icon: 'browser' },
  { title: '100% de involucramiento', desc: 'Un equipo comprometido con tu marca', icon: 'heart' },
];

/** Formato con punto de miles: 17200 → "17.200". */
export const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
