import { openGalleryDialog } from '../../gallery/gallery-dialog';
import { openRandomDialog } from '../../gallery/random-dialog';
import type { ButtonGroup } from '../button-spec';

export const galleryGroup: ButtonGroup = {
  id: 'gallery',
  title: 'Empezar',
  buttons: [
    {
      id: 'gallery-open',
      label: 'Galería',
      title: 'Plantillas de partida de todos los tipos de documento',
      run: (e) => openGalleryDialog(e),
    },
    {
      id: 'random-open',
      label: 'Aleatorio',
      title: 'Generar un diseño completo al azar, con datos ficticios',
      run: (e) => openRandomDialog(e),
    },
  ],
};
