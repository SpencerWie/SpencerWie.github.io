(() => {
    'use strict'
  
    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)
    const preferredTheme = '(prefers-color-scheme: dark)'
    const themeClass = 'data-bs-theme-value'
  
    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme();
      if (storedTheme) return storedTheme;
  
      return window.matchMedia(preferredTheme).matches ? 'dark' : 'light';
    }
  
    const setTheme = theme => {
        document.documentElement.setAttribute('data-bs-theme', theme);
    }
  
    setTheme(getPreferredTheme());
  
    const showTheme = (theme) => {
  
      const clickedTheme = document.querySelector(`[${themeClass}="${theme}"]`)
  
      document.querySelectorAll(`[${themeClass}]`).forEach(element => {
        element.classList.remove('d-none');
      })
  
      clickedTheme.classList.add('d-none');  
    }
  
    window.matchMedia(preferredTheme).addEventListener('change', () => {
      const storedTheme = getStoredTheme();
      if (storedTheme !== 'light' && storedTheme !== 'dark') setTheme(getPreferredTheme());
    })
  
    window.addEventListener('DOMContentLoaded', () => {
      showTheme(getPreferredTheme())
  
      document.querySelectorAll(`[${themeClass}]`)
        .forEach(toggle => {
          toggle.addEventListener('click', () => {
            const theme = toggle.getAttribute(themeClass)
            showTheme(theme)
            setStoredTheme(theme)
            setTheme(theme)
          })
        })
    })
  })();