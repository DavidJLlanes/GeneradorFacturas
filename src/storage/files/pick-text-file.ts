// Pide un archivo al usuario y devuelve su texto (o `null` si cancela).
export function pickTextFile(accept: string): Promise<{ name: string; text: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      void file.text().then((text) => resolve({ name: file.name, text }));
    });
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}
