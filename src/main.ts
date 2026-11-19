import { chooseType } from './app/choose-type';
import { createAppEditor } from './app/create-app-editor';
import { documentTypes } from './core/document-type/discover';
import { mountApp } from './ui/mount-app';
import './ui/base.css';

const root = document.getElementById('app');
if (root) mountApp(root, createAppEditor(chooseType(documentTypes, window.location.hash)));
