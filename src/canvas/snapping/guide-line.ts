// Línea guía visible mientras se arrastra. `axis: 'x'` es una línea vertical en x = posMm.
export interface GuideLine {
  axis: 'x' | 'y';
  posMm: number;
}
