export const UIConfig = {
  theme: localStorage.getItem('theme') || 'light',

  setTheme(value) {
    this.theme = value;
    localStorage.setItem('theme', value);
    document.body.classList.toggle('dark', value === 'dark');
  },

  syncTheme() {
    document.body.classList.toggle('dark', this.theme === 'dark');
  }
};

