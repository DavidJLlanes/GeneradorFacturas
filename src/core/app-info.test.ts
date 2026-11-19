import { describe, expect, it } from 'vitest';
import { APP_NAME, APP_TAGLINE } from './app-info';

describe('app-info', () => {
  it('define nombre y lema no vacíos', () => {
    expect(APP_NAME.length).toBeGreaterThan(0);
    expect(APP_TAGLINE.length).toBeGreaterThan(0);
  });
});
