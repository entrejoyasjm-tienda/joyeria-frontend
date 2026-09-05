import React from 'react';
import { Image as ChakraImage } from '@chakra-ui/react';

/**
 * Transforma URLs de Cloudinary agregando compresión (q_auto) y formato WebP/AVIF (f_auto)
 */
const getOptimizedUrl = (src, width, height) => {
  if (!src || !src.includes('cloudinary.com')) {
    return src; // Devuelve las imágenes de public/ sin modificar
  }

  const transformations = `f_auto,q_auto${width ? `,w_${width}` : ''}${height ? `,h_${height}` : ''}`;
  return src.replace('/upload/', `/upload/${transformations}/`);
};

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  fallbackSrc = '/images/todas.jpg',
  ...chakraProps
}) => {
  const finalSrc = getOptimizedUrl(src, width, height);

  return (
    <ChakraImage
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fallbackSrc={fallbackSrc}
      objectFit="cover"
      {...chakraProps}
    />
  );
};

export default OptimizedImage;