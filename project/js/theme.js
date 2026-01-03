import { UIConfig } from './config.js';

export function initThemeToggle() {
  UIConfig.syncTheme();

  const toggle = document.querySelector('#modeToggle');
  if (!toggle) return; // halaman artikel aman

  toggle.checked = UIConfig.theme === 'dark';

  toggle.addEventListener('change', () => {
    UIConfig.setTheme(toggle.checked ? 'dark' : 'light');
  });
}

