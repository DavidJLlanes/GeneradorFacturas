import { describe, expect, it } from 'vitest';
import { fitWithin, isAllowedImageType, isImageDataUrl } from './image-limits';

describe('imágenes', () => {
  it('reduce sin deformar y sin ampliar', () => {
    expect(fitWithin(3200, 1600, 1600)).toEqual({ w: 1600, h: 800 });
    expect(fitWithin(1000, 4000, 1600)).toEqual({ w: 400, h: 1600 });
    expect(fitWithin(800, 600, 1600)).toEqual({ w: 800, h: 600 });
    expect(fitWithin(100000, 1, 1600).h).toBe(1);
  });

  it('solo admite PNG, JPG y SVG', () => {
    expect(isAllowedImageType('image/png')).toBe(true);
    expect(isAllowedImageType('image/jpeg')).toBe(true);
    expect(isAllowedImageType('image/svg+xml')).toBe(true);
    expect(isAllowedImageType('image/gif')).toBe(false);
    expect(isAllowedImageType('text/html')).toBe(false);
  });

  it('reconoce data URLs de imagen y rechaza el resto', () => {
    expect(isImageDataUrl('data:image/png;base64,AAAA')).toBe(true);
    expect(isImageDataUrl('data:image/svg+xml;base64,AAAA')).toBe(true);
    expect(isImageDataUrl('data:text/html;base64,AAAA')).toBe(false);
    expect(isImageDataUrl('javascript:alert(1)')).toBe(false);
    expect(isImageDataUrl('https://x/y.png')).toBe(false);
    expect(isImageDataUrl(5)).toBe(false);
  });
});
