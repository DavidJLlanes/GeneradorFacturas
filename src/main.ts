import { createEditor } from './canvas/editor/create-editor';
import { createDemoDocument } from './demo/demo-document';
import { mountApp } from './ui/mount-app';
import './ui/base.css';

const root = document.getElementById('app');
if (root) mountApp(root, createEditor(createDemoDocument()));
