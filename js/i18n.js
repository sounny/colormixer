// ==================
// INTERNATIONALIZATION (i18n)
// ==================

// Supported languages
const SUPPORTED_LANGS = ['en', 'es', 'fr'];

// Current language (default: English, or saved preference)
let currentLang = localStorage.getItem('lang') || 'en';

// Translation dictionary
const translations = {
  en: {
    // Header
    title_paint: "Paint Mixer",
    title_light: "Light Mixer",
    subtitle_paint: "Mixing paint gets darker!",
    subtitle_light: "Mixing light gets brighter!",
    
    // Mode buttons
    mode_paint: "Paint",
    mode_light: "Light",
    
    // Color names
    color_red: "Red",
    color_blue: "Blue",
    color_yellow: "Yellow",
    color_green: "Green",
    color_purple: "Purple",
    color_orange: "Orange",
    color_cyan: "Cyan",
    color_magenta: "Magenta",
    color_white: "White",
    color_black: "Black",
    color_brown: "Brown",
    
    // Actions
    button_reset: "Reset",
    button_game_mode: "Game Mode",
    button_exit_game: "Exit Game",
    button_demo_mode: "Demo Mode",
    button_stop_demo: "Stop Demo",
    button_next: "Next",
    button_skip: "Skip",
    button_share: "Share Link",
    button_copied: "Copied!",
    button_tools: "Tools",
    
    // Challenge Mode
    challenge_make: "Make",
    challenge_level: "Level",
    challenge_success: "You made",
    challenge_level_up: "Level Up!",
    challenge_unlocked: "Mode Unlocked!",
    
    // Achievements
    achievement_unlocked: "Achievement Unlocked!",
    achievement_first_mix: "First Mix!",
    achievement_first_mix_desc: "You mixed your first color!",
    achievement_color_expert: "Color Expert",
    achievement_color_expert_desc: "Discovered all secondary colors!",
    achievement_mode_switcher: "Light & Paint",
    achievement_mode_switcher_desc: "Tried both mixing modes!",
    achievement_champion: "Challenge Champion",
    achievement_champion_desc: "Won 5 challenges!",
    
    // Tutorial
    tutorial_step1: "Click a color button to start mixing.",
    tutorial_step2: "Try switching between Paint and Light modes.",
    tutorial_step3: "Mix two colors to see the result!",
    tutorial_step4: "Copy the HEX code to your clipboard.",
    tutorial_complete: "Tutorial complete! Enjoy mixing colors!",
    
    // Footer
    footer_paint: "Red + Yellow + Blue = Brown Paint",
    footer_light: "Red + Green + Blue = White Light",
    keyboard_hint_paint: "Keyboard: R Y B colors · Space reset · Tab mode",
    keyboard_hint_light: "Keyboard: R G B colors · Space reset · Tab mode",
    
    // Equations
    equation_pick: "Pick a color to start",
    equation_selected: "Selected",
    equation_mixed: "Mixed",
    equation_result: "Result is",
    
    // Examples prefix
    examples_prefix: "Examples:",
    
    // Accessibility
    aria_color_button: "Add",
    aria_reset: "Reset all colors",
    aria_mode_switch: "Switch to",
    
    // Learn Mode
    learn_title: "Learning Path",
    learn_step: "Step",
    learn_of: "of",
    
    // Value slider
    value_tint: "Tint",
    value_pure: "Pure",
    value_shade: "Shade",
    
    // Settings
    settings_accessibility: "Accessibility",
    settings_high_contrast: "High Contrast",
    settings_sound: "Sound",
    settings_language: "Language",
    settings_value: "Color Value (Tints & Shades)"
  },
  
  es: {
    // Header
    title_paint: "Mezclador de Pintura",
    title_light: "Mezclador de Luz",
    subtitle_paint: "¡Mezclar pintura oscurece!",
    subtitle_light: "¡Mezclar luz ilumina!",
    
    // Mode buttons
    mode_paint: "Pintura",
    mode_light: "Luz",
    
    // Color names
    color_red: "Rojo",
    color_blue: "Azul",
    color_yellow: "Amarillo",
    color_green: "Verde",
    color_purple: "Púrpura",
    color_orange: "Naranja",
    color_cyan: "Cian",
    color_magenta: "Magenta",
    color_white: "Blanco",
    color_black: "Negro",
    color_brown: "Marrón",
    
    // Actions
    button_reset: "Reiniciar",
    button_game_mode: "Modo Juego",
    button_exit_game: "Salir del Juego",
    button_demo_mode: "Modo Demo",
    button_stop_demo: "Parar Demo",
    button_next: "Siguiente",
    button_skip: "Saltar",
    button_share: "Compartir",
    button_copied: "¡Copiado!",
    button_tools: "Herramientas",
    
    // Challenge Mode
    challenge_make: "Hacer",
    challenge_level: "Nivel",
    challenge_success: "¡Hiciste",
    challenge_level_up: "¡Subiste de nivel!",
    challenge_unlocked: "¡Modo desbloqueado!",
    
    // Achievements
    achievement_unlocked: "¡Logro Desbloqueado!",
    achievement_first_mix: "¡Primera Mezcla!",
    achievement_first_mix_desc: "¡Mezclaste tu primer color!",
    achievement_color_expert: "Experto en Colores",
    achievement_color_expert_desc: "¡Descubriste todos los colores secundarios!",
    achievement_mode_switcher: "Luz y Pintura",
    achievement_mode_switcher_desc: "¡Probaste ambos modos!",
    achievement_champion: "Campeón de Desafíos",
    achievement_champion_desc: "¡Ganaste 5 desafíos!",
    
    // Tutorial
    tutorial_step1: "Haz clic en un botón de color para empezar.",
    tutorial_step2: "Prueba cambiar entre los modos Pintura y Luz.",
    tutorial_step3: "¡Mezcla dos colores para ver el resultado!",
    tutorial_step4: "Copia el código HEX al portapapeles.",
    tutorial_complete: "¡Tutorial completo! ¡Disfruta mezclando colores!",
    
    // Footer
    footer_paint: "Rojo + Amarillo + Azul = Pintura Marrón",
    footer_light: "Rojo + Verde + Azul = Luz Blanca",
    keyboard_hint_paint: "Teclado: R A Z colores · Espacio reiniciar · Tab modo",
    keyboard_hint_light: "Teclado: R V Z colores · Espacio reiniciar · Tab modo",
    
    // Equations
    equation_pick: "Elige un color para empezar",
    equation_selected: "Seleccionado",
    equation_mixed: "Mezclado",
    equation_result: "Resultado es",
    
    // Examples prefix
    examples_prefix: "Ejemplos:",
    
    // Accessibility
    aria_color_button: "Agregar",
    aria_reset: "Reiniciar todos los colores",
    aria_mode_switch: "Cambiar a",
    
    // Learn Mode
    learn_title: "Ruta de Aprendizaje",
    learn_step: "Paso",
    learn_of: "de",
    
    // Value slider
    value_tint: "Claro",
    value_pure: "Puro",
    value_shade: "Oscuro",
    
    // Settings
    settings_accessibility: "Accesibilidad",
    settings_high_contrast: "Alto Contraste",
    settings_sound: "Sonido",
    settings_language: "Idioma",
    settings_value: "Valor de Color (Claridad)"
  },
  
  fr: {
    // Header
    title_paint: "Mélangeur de Peinture",
    title_light: "Mélangeur de Lumière",
    subtitle_paint: "Mélanger la peinture assombrit!",
    subtitle_light: "Mélanger la lumière éclaire!",
    
    // Mode buttons
    mode_paint: "Peinture",
    mode_light: "Lumière",
    
    // Color names
    color_red: "Rouge",
    color_blue: "Bleu",
    color_yellow: "Jaune",
    color_green: "Vert",
    color_purple: "Violet",
    color_orange: "Orange",
    color_cyan: "Cyan",
    color_magenta: "Magenta",
    color_white: "Blanc",
    color_black: "Noir",
    color_brown: "Marron",
    
    // Actions
    button_reset: "Réinitialiser",
    button_game_mode: "Mode Jeu",
    button_exit_game: "Quitter le Jeu",
    button_demo_mode: "Mode Démo",
    button_stop_demo: "Arrêter Démo",
    button_next: "Suivant",
    button_skip: "Passer",
    button_share: "Partager",
    button_copied: "Copié!",
    button_tools: "Outils",
    
    // Challenge Mode
    challenge_make: "Créer",
    challenge_level: "Niveau",
    challenge_success: "Tu as fait",
    challenge_level_up: "Niveau supérieur!",
    challenge_unlocked: "Mode débloqué!",
    
    // Achievements
    achievement_unlocked: "Succès Débloqué!",
    achievement_first_mix: "Premier Mélange!",
    achievement_first_mix_desc: "Tu as mélangé ta première couleur!",
    achievement_color_expert: "Expert en Couleurs",
    achievement_color_expert_desc: "Tu as découvert toutes les couleurs secondaires!",
    achievement_mode_switcher: "Lumière et Peinture",
    achievement_mode_switcher_desc: "Tu as essayé les deux modes!",
    achievement_champion: "Champion des Défis",
    achievement_champion_desc: "Tu as gagné 5 défis!",
    
    // Tutorial
    tutorial_step1: "Clique sur un bouton de couleur pour commencer.",
    tutorial_step2: "Essaie de changer entre les modes Peinture et Lumière.",
    tutorial_step3: "Mélange deux couleurs pour voir le résultat!",
    tutorial_step4: "Copie le code HEX dans le presse-papiers.",
    tutorial_complete: "Tutoriel terminé! Amuse-toi à mélanger les couleurs!",
    
    // Footer
    footer_paint: "Rouge + Jaune + Bleu = Peinture Marron",
    footer_light: "Rouge + Vert + Bleu = Lumière Blanche",
    keyboard_hint_paint: "Clavier: R J B couleurs · Espace réinitialiser · Tab mode",
    keyboard_hint_light: "Clavier: R V B couleurs · Espace réinitialiser · Tab mode",
    
    // Equations
    equation_pick: "Choisis une couleur pour commencer",
    equation_selected: "Sélectionné",
    equation_mixed: "Mélangé",
    equation_result: "Le résultat est",
    
    // Examples prefix
    examples_prefix: "Exemples:",
    
    // Accessibility
    aria_color_button: "Ajouter",
    aria_reset: "Réinitialiser toutes les couleurs",
    aria_mode_switch: "Changer vers",
    
    // Learn Mode
    learn_title: "Parcours d'Apprentissage",
    learn_step: "Étape",
    learn_of: "sur",
    
    // Value slider
    value_tint: "Teinte",
    value_pure: "Pur",
    value_shade: "Ombre",
    
    // Settings
    settings_accessibility: "Accessibilité",
    settings_high_contrast: "Contraste Élevé",
    settings_sound: "Son",
    settings_language: "Langue",
    settings_value: "Valeur de Couleur (Teintes)"
  }
};

// ==================
// TRANSLATION FUNCTIONS
// ==================

/**
 * Get translated string for a key
 * @param {string} key - Translation key
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} - Translated string or key if not found
 */
function t(key, params = {}) {
  let text = translations[currentLang]?.[key] || translations.en[key] || key;
  
  // Simple interpolation: replace {param} with value
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  
  return text;
}

/**
 * Get translated color name
 * @param {string} colorName - English color name (e.g., "Red", "Purple")
 * @returns {string} - Translated color name
 */
function tColor(colorName) {
  const key = `color_${colorName.toLowerCase()}`;
  return t(key) || colorName;
}

/**
 * Set the current language
 * @param {string} lang - Language code (en, es, fr)
 */
function setLanguage(lang) {
  if (SUPPORTED_LANGS.includes(lang)) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    updateAllText();
  }
}

/**
 * Get current language code
 * @returns {string} - Current language code
 */
function getCurrentLanguage() {
  return currentLang;
}

/**
 * Update all translatable text in the DOM
 */
function updateAllText() {
  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  // Update elements with data-i18n-placeholder (for inputs)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  
  // Update elements with data-i18n-aria (for accessibility)
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    el.setAttribute('aria-label', t(key));
  });
  
  // Trigger custom event for dynamic updates
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
}

/**
 * Initialize i18n - detect browser language or use saved preference
 */
function initI18n() {
  // Check saved preference first
  const savedLang = localStorage.getItem('lang');
  if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
    currentLang = savedLang;
  } else {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGS.includes(browserLang)) {
      currentLang = browserLang;
    }
  }
  
  // Set HTML lang attribute
  document.documentElement.lang = currentLang;
  
  // Initial text update
  updateAllText();
}

// Language display names
const LANG_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français'
};
