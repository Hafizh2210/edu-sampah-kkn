import { initNavigation } from './navigation.js';
import { initScrollAnimations, initCounterAnimation } from './animations.js';
import { initQuiz } from './quiz.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initCounterAnimation();
  initQuiz();
});
