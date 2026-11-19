import { APP_NAME, APP_TAGLINE } from './core/app-info';
import './ui/base.css';

const root = document.getElementById('app');

if (root) {
  const title = document.createElement('h1');
  title.textContent = APP_NAME;
  const tagline = document.createElement('p');
  tagline.textContent = `${APP_TAGLINE} En construcción.`;
  root.append(title, tagline);
}
