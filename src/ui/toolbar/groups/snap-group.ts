import type { Editor } from '../../../canvas/editor/create-editor';
import type { ButtonGroup } from '../button-spec';

const GRID_STEPS_MM = [1, 2, 5, 10];

const updateUi = (editor: Editor, patch: (s: ReturnType<Editor['ui']['get']>) => object): void =>
  editor.ui.update((s) => ({ ...s, ...patch(s) }));

export const snapGroup: ButtonGroup = {
  id: 'snap',
  title: 'Rejilla e imanes',
  buttons: [
    {
      id: 'grid-visible',
      label: 'Rejilla',
      title: 'Mostrar u ocultar la rejilla',
      run: (e) => updateUi(e, (s) => ({ showGrid: !s.showGrid })),
      pressed: (e) => e.ui.get().showGrid,
    },
    {
      id: 'grid-snap',
      label: 'Imán rejilla',
      title: 'Ajustar a la rejilla',
      run: (e) => updateUi(e, (s) => ({ snap: { ...s.snap, snapGrid: !s.snap.snapGrid } })),
      pressed: (e) => e.ui.get().snap.snapGrid,
    },
    {
      id: 'guides-snap',
      label: 'Guías',
      title: 'Ajustar a bordes y centros de otros elementos y de la página',
      run: (e) => updateUi(e, (s) => ({ snap: { ...s.snap, snapGuides: !s.snap.snapGuides } })),
      pressed: (e) => e.ui.get().snap.snapGuides,
    },
    {
      id: 'margins-visible',
      label: 'Márgenes',
      title: 'Mostrar u ocultar la zona de seguridad de impresión',
      run: (e) => updateUi(e, (s) => ({ showMargins: !s.showMargins })),
      pressed: (e) => e.ui.get().showMargins,
    },
    {
      id: 'grid-step',
      label: (e) => `Paso ${e.ui.get().snap.gridMm} mm`,
      title: 'Cambiar el tamaño de la rejilla',
      run: (e) =>
        updateUi(e, (s) => {
          const index = GRID_STEPS_MM.indexOf(s.snap.gridMm);
          const next = GRID_STEPS_MM[(index + 1) % GRID_STEPS_MM.length] ?? 5;
          return { snap: { ...s.snap, gridMm: next } };
        }),
    },
  ],
};
