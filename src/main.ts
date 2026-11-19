import { chooseTemplate, chooseType } from './app/choose-type';
import { createAppEditor } from './app/create-app-editor';
import { documentTypes } from './core/document-type/discover';
import { mountApp } from './ui/mount-app';
import './ui/base.css';

const root = document.getElementById('app');
if (root) {
  const hash = window.location.hash;
  const type = chooseType(documentTypes, hash);
  mountApp(root, createAppEditor(type, chooseTemplate(type, hash)));
}
