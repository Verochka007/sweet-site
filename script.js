// Бургер-меню: открывает и закрывает меню на телефоне

// 1. Находим элементы на странице
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

// 2. По клику на бургер добавляем или убираем класс is-open
burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');   // toggle вернёт true, если класс появился
  burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  burger.setAttribute('aria-expanded', isOpen);     // для экранных читалок
});

// 3. После нажатия на пункт меню закрываем меню
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  });
});