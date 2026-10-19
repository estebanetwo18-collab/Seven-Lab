import { MotionConfig } from 'framer-motion';
import { Hero } from './landing/Hero';
import {
  Arranque,
  CadaMes,
  Cierre,
  Contenidos,
  DesdeAfuera,
  Entendimos,
  Involucramiento,
  Inversion,
  Paquete,
  Regalo,
  TresColumnas,
  TresCosas,
  WhatsApp,
} from './landing/Sections';

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Hero />
      <main>
        <Entendimos />
        <DesdeAfuera />
        <TresCosas />
        <Paquete />
        <Contenidos />
        <WhatsApp />
        <TresColumnas />
        <Regalo />
        <Involucramiento />
        <CadaMes />
        <Arranque />
        <Inversion />
        <Cierre />
      </main>
    </MotionConfig>
  );
}
