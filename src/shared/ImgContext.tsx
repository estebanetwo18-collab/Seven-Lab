import { createContext, useContext, type ImgHTMLAttributes } from 'react';

// En la landing es un <img> normal; en Remotion se reemplaza por <Img>,
// que espera a que la foto cargue antes de capturar cada cuadro.
type ImgComponent = (props: ImgHTMLAttributes<HTMLImageElement>) => JSX.Element;

const DefaultImg: ImgComponent = (props) => <img loading="lazy" decoding="async" {...props} />;

export const ImgContext = createContext<ImgComponent>(DefaultImg);
export const useImg = () => useContext(ImgContext);
