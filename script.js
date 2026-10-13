/*
  ============================================================
  ЧТО ТАКОЕ JAVASCRIPT?
  
  JavaScript — язык программирования, который делает 
  веб-страницы ИНТЕРАКТИВНЫМИ.
  
  HTML = структура (скелет)
  CSS  = внешний вид (одежда)
  JS   = поведение (движения, реакции)
  
  Примеры: кнопка меняет цвет при клике, данные загружаются
  с сервера, анимации запускаются при скролле.
  
  ВАЖНО: JavaScript в браузере и Python на сервере — это
  разные среды выполнения, но логика программирования
  (переменные, условия, циклы, функции) — одна и та же.
  ============================================================
*/


// ==================== НАВИГАЦИЯ ПРИ СКРОЛЛЕ ====================
/*
  Что делаем: при прокрутке добавляем навигации фон и тень,
  чтобы она не "парила" прозрачной над контентом.
  
  document — объект, представляющий всю HTML-страницу.
  querySelector — находит ПЕРВЫЙ элемент по CSS-селектору.
  
  window — объект, представляющий окно браузера.
  addEventListener — подписываемся на событие.
  'scroll' — событие прокрутки страницы.
*/
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  // window.scrollY — на сколько пикселей прокручена страница
  if (window.scrollY > 50) {
    // classList.add — добавляет CSS-класс к элементу
    navbar.classList.add('scrolled');
  } else {
    // classList.remove — убирает CSS-класс
    navbar.classList.remove('scrolled');
  }
});


// ==================== МОБИЛЬНОЕ МЕНЮ ====================
/*
  На мобильных устройствах ссылки навигации скрыты.
  При клике на "гамбургер" (три полоски) — показываем их.
  
  getElementById — находит элемент по его id.
  Это быстрее, чем querySelector, но работает только с id.
*/
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  // classList.toggle — если класс есть — убирает, если нет — добавляет
  navLinks.classList.toggle('active');
});

// Закрываем меню при клике на ссылку
/*
  querySelectorAll — находит ВСЕ элементы по селектору.
  Возвращает NodeList (похоже на массив).
  
  forEach — перебирает каждый элемент, как for в Python:
  Python: for link in links:
  JS:     links.forEach(link => { ... })
*/
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});


// ==================== АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ====================
/*
  Intersection Observer API — мощный инструмент для отслеживания,
  когда элемент попадает в зону видимости (viewport).
  
  РАНЬШЕ для этого использовали scroll-событие + расчёт позиций,
  что было медленным и сложным.
  
  Intersection Observer работает АСИНХРОННО и не тормозит страницу.
  
  Логика:
  1. Находим все элементы, которые нужно анимировать.
  2. Создаём Observer, который "следит" за ними.
  3. Когда элемент попадает в viewport — добавляем класс .visible.
  4. CSS анимирует переход из невидимого в видимое состояние.
*/

// Настройки Observer
const observerOptions = {
  // threshold: 0.15 — сработает, когда 15% элемента видно
  threshold: 0.15,
  // rootMargin — отступ от края viewport
  // '0px 0px -50px 0px' — сработает на 50px раньше нижней границы
  rootMargin: '0px 0px -50px 0px'
};

// Создаём Observer
const observer = new IntersectionObserver((entries) => {
  /*
    entries — массив отслеживаемых элементов.
    entry.isIntersecting — true, если элемент видим.
  */
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // unobserve — прекращаем следить (анимация одноразовая)
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Добавляем класс fade-in ко всем элементам, которые нужно анимировать
/*
  Мы выбираем конкретные элементы по их классам.
  Можно было бы добавить class="fade-in" прямо в HTML,
  но так удобнее управлять из одного места.
*/
const animatedElements = document.querySelectorAll(
  '.section-title, .skill-card, .project-card, .about-text, ' +
  '.stat-card, .contact-card, .contact-text'
);

animatedElements.forEach((el, index) => {
  el.classList.add('fade-in');
  
  // Добавляем задержку для эффекта "волны" (каскадное появление)
  /*
    transitionDelay — задержка перед началом анимации.
    index % 4 — чтобы задержка не росла бесконечно 
    (сбрасывается каждые 4 элемента).
  */
  el.style.transitionDelay = `${(index % 4) * 0.1}s`;
  
  // Начинаем наблюдать за элементом
  observer.observe(el);
});


// ==================== АНИМАЦИЯ ЧИСЕЛ ====================
/*
  Числа в секции "Обо мне" плавно увеличиваются от 0 до целевого значения.
  Это называется "counter animation" или "count-up".
  
  data-target — пользовательский HTML-атрибут (data-*).
  Мы сами его придумали для хранения целевого числа.
  В HTML: <span data-target="500">0</span>
  В JS: element.getAttribute('data-target') → "500"
*/

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // Длительность анимации в миллисекундах
    const startTime = performance.now(); // Текущее время в мс
    
    /*
      requestAnimationFrame — просит браузер вызвать функцию 
      перед следующей перерисовкой экрана (обычно 60 раз в секунду).
      
      Это НАМНОГО лучше, чем setInterval/setTimeout для анимаций,
      потому что синхронизировано с обновлением экрана.
    */
    function updateCounter(currentTime) {
      // Прогресс от 0 до 1
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      /*
        easeOutQuart — функция замедления.
        Анимация начинается быстро и замедляется к концу.
        Это выглядит более "натурально", чем линейное движение.
      */
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      // Обновляем текст элемента
      const currentValue = Math.round(target * easeOutQuart);
      counter.textContent = currentValue;
      
      // Если ещё не достигли конца — продолжаем
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    
    requestAnimationFrame(updateCounter);
  });
}

// Запускаем анимацию счётчиков, когда секция "Обо мне" появляется
const aboutSection = document.getElementById('about');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

counterObserver.observe(aboutSection);


// ==================== ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ ====================
/*
  При скролле подсвечиваем ту ссылку в навигации, 
  которая соответствует текущей видимой секции.
*/
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      
      // Убираем подсветку у всех ссылок
      navLinksAll.forEach(link => {
        link.style.color = '';
      });
      
      // Подсвечиваем текущую
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) {
        activeLink.style.color = 'var(--accent-start)';
      }
    }
  });
}, { 
  threshold: 0.3,
  rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72}px 0px 0px 0px`
});

sections.forEach(section => {
  sectionObserver.observe(section);
});


// ==================== ПАРАЛЛАКС-ЭФФЕКТ ДЛЯ HERO ====================
/*
  Параллакс — элементы двигаются с разной скоростью при скролле,
  создавая ощущение глубины.
  
  Здесь мы чуть сдвигаем hero-контент вверх при прокрутке.
*/
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  if (heroContent) {
    const scrolled = window.scrollY;
    // Сдвигаем контент вверх, но медленнее, чем скролл (коэффициент 0.3)
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    // Уменьшаем непрозрачность при скролле
    heroContent.style.opacity = 1 - (scrolled / 800);
  }
});


// ==================== ПЛАВНАЯ ЗАГРУЗКА СТРАНИЦЫ ====================
/*
  Добавляем плавное появление всей страницы при загрузке.
  
  DOMContentLoaded — событие, которое срабатывает,
  когда весь HTML загружен и разобран (parsed).
  
  Отличие от 'load':
  - DOMContentLoaded — HTML готов (картинки могут ещё грузиться)
  - load — ВСЁ загружено (включая картинки, шрифты, стили)
*/
document.addEventListener('DOMContentLoaded', () => {
  // document.body.style — прямое изменение CSS-свойств элемента
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  // setTimeout — выполнить функцию через указанное время (в мс)
  // 50ms — маленькая задержка, чтобы transition успел "зарегистрироваться"
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
});


/*
  ============================================================
  ИТОГО — что мы использовали в JavaScript:
  
  1. DOM-манипуляции: querySelector, getElementById, classList
  2. События: addEventListener ('scroll', 'click', 'DOMContentLoaded')
  3. Intersection Observer API — отслеживание видимости элементов
  4. requestAnimationFrame — плавные анимации
  5. CSS Custom Properties через JS
  6. Таймеры: setTimeout
  7. Стрелочные функции: () => {}
  8. Шаблонные строки: `текст ${переменная}`
  9. Math: Math.min, Math.round, Math.pow
  10. Деструктуризация и data-атрибуты
  
  Это ~90% того, что нужно Junior для работы с фронтендом.
  ============================================================
*/
