import { describe, expect, it } from 'vitest';
import { History } from './history';

describe('History', () => {
  it('deshace y rehace', () => {
    const h = new History(0);
    h.push(1);
    h.push(2);
    expect(h.undo()).toBe(true);
    expect(h.get()).toBe(1);
    expect(h.redo()).toBe(true);
    expect(h.get()).toBe(2);
    expect(h.canRedo).toBe(false);
  });

  it('un nuevo cambio borra el futuro', () => {
    const h = new History(0);
    h.push(1);
    h.undo();
    h.push(5);
    expect(h.canRedo).toBe(false);
    expect(h.get()).toBe(5);
  });

  it('ignora cambios idénticos y no deshace de más', () => {
    const h = new History(0);
    h.push(0);
    expect(h.canUndo).toBe(false);
    expect(h.undo()).toBe(false);
  });

  it('un arrastre transitorio es un único paso', () => {
    const h = new History(0);
    h.beginTransient();
    h.setTransient(1);
    h.setTransient(2);
    h.setTransient(3);
    h.commitTransient();
    expect(h.get()).toBe(3);
    h.undo();
    expect(h.get()).toBe(0);
    expect(h.canUndo).toBe(false);
  });

  it('cancelar un arrastre restaura el estado y no guarda historial', () => {
    const h = new History(0);
    h.beginTransient();
    h.setTransient(9);
    h.cancelTransient();
    expect(h.get()).toBe(0);
    expect(h.canUndo).toBe(false);
  });

  it('confirmar sin cambios no crea paso', () => {
    const h = new History(0);
    h.beginTransient();
    h.commitTransient();
    expect(h.canUndo).toBe(false);
  });

  it('avisa a los suscriptores', () => {
    const h = new History(0);
    let n = 0;
    const off = h.subscribe(() => n++);
    h.push(1);
    off();
    h.push(2);
    expect(n).toBe(1);
  });

  it('soporta muchos pasos sin límite', () => {
    const h = new History(0);
    for (let i = 1; i <= 5000; i++) h.push(i);
    for (let i = 0; i < 5000; i++) h.undo();
    expect(h.get()).toBe(0);
  });
});
