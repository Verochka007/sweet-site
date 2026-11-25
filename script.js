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
const canvas = document.getElementById('sprinkles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h;
  const sprinkles = [];
  const colors = ['#F7C948', '#FF85A1', '#70C1FF']; // жёлтый, розовый, голубой

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 55; i++) {
    sprinkles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vy: 0.5 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.35,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.025,
      color: colors[i % colors.length]
    });
  }

  function animateSprinkles() {
    ctx.clearRect(0, 0, w, h);
    sprinkles.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx;
      p.angle += p.vAngle;

      if (p.y > h + 20) {
        p.y = -20;
        p.x = Math.random() * w;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-6, -2.2, 12, 4.4, 2.2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(animateSprinkles);
  }
  animateSprinkles();
}
// Плавное каскадное появление карточек и секций при прокрутке
const revealTargets = document.querySelectorAll('.item, .about__photo, .about__facts li, .contacts__info, .contacts__photo');

revealTargets.forEach((el, index) => {
  el.classList.add('reveal');
  // Небольшая задержка для карточек в одном ряду, чтобы всплывали волной
  el.style.transitionDelay = `${(index % 5) * 0.08}s`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // Анимируем один раз при появлении
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach((el) => observer.observe(el));
/* =====================================================
   Калькулятор торта и демо-оформление заказа
   Цены берутся из атрибутов value в index.html:
   меняйте их там, а не в этом файле.
   ===================================================== */
   (function () {
    'use strict';
  
    var calc = document.getElementById('calc');
    if (!calc) return;
  
    var MIN_HALVES = 2;    // 1 кг (считаем в «половинках» килограмма, чтобы не путаться с дробями)
    var MAX_HALVES = 20;   // 10 кг
    var halves = 4;        // стартовый вес: 2 кг
  
    var elValue = document.getElementById('wValue');
    var elLines = document.getElementById('calcLines');
    var elTotal = document.getElementById('calcTotal');
    var btnMinus = document.getElementById('wMinus');
    var btnPlus = document.getElementById('wPlus');
    var btnOrder = document.getElementById('toOrder');
    var orderForm = document.getElementById('orderForm');
    var orderDone = document.getElementById('orderDone');
    var addressField = document.getElementById('addressField');
    var fName = document.getElementById('fName');
    var fPhone = document.getElementById('fPhone');
    var fAddress = document.getElementById('fAddress');
    var fDate = document.getElementById('fDate');
    var fComment = document.getElementById('fComment');
  
    /* ---------- Вспомогательное ---------- */
    function money(n) {
      return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') + '\u00A0\u20BD';
    }
  
    function kg(h) {
      return String(h / 2).replace('.', ',') + '\u00A0\u043A\u0433';
    }
  
    function checked(name) {
      return calc.querySelector('input[name="' + name + '"]:checked');
    }
  
    function pad(n) { return (n < 10 ? '0' : '') + n; }
  
    function scrollToEl(el) {
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  
    /* ---------- Расчёт ---------- */
    function getState() {
      var filling = checked('filling');
      var delivery = checked('delivery');
      var extras = Array.prototype.slice.call(calc.querySelectorAll('input[name="extra"]:checked'));
  
      var weight = halves / 2;
      var cake = Number(filling.value) * weight;
      var total = cake;
      var lines = [{ label: filling.getAttribute('data-name') + ' \u00B7 ' + kg(halves), value: cake }];
  
      extras.forEach(function (e) {
        var v = Number(e.value);
        lines.push({ label: e.getAttribute('data-name'), value: v });
        total += v;
      });
  
      var dv = Number(delivery.value);
      lines.push({ label: delivery.getAttribute('data-name'), value: dv, free: dv === 0 });
      total += dv;
  
      return {
        filling: filling.getAttribute('data-name'),
        weightText: kg(halves),
        lines: lines,
        total: total,
        isDelivery: dv > 0
      };
    }
  
    function fillLines(ul, lines) {
      ul.innerHTML = '';
      lines.forEach(function (l) {
        var li = document.createElement('li');
        var a = document.createElement('span');
        var b = document.createElement('span');
        a.textContent = l.label;
        b.textContent = l.free ? '\u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E' : money(l.value);
        li.appendChild(a);
        li.appendChild(b);
        ul.appendChild(li);
      });
    }
  
    function render() {
      var s = getState();
      elValue.textContent = kg(halves);
      fillLines(elLines, s.lines);
      elTotal.textContent = money(s.total);
      btnMinus.disabled = halves <= MIN_HALVES;
      btnPlus.disabled = halves >= MAX_HALVES;
      addressField.hidden = !s.isDelivery;   // адрес нужен только для доставки
    }
  
    /* ---------- События калькулятора ---------- */
    btnMinus.addEventListener('click', function () {
      if (halves > MIN_HALVES) { halves--; render(); }
    });
  
    btnPlus.addEventListener('click', function () {
      if (halves < MAX_HALVES) { halves++; render(); }
    });
  
    calc.addEventListener('change', function (e) {
      if (e.target && e.target.tagName === 'INPUT') render();
    });
  
    /* ---------- Форма заказа ---------- */
    // Раньше завтрашнего дня торт не заказать
  var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var minDate = tomorrow.getFullYear() + '-' + pad(tomorrow.getMonth() + 1) + '-' + pad(tomorrow.getDate());
    fDate.setAttribute('min', minDate);
  
    function setErr(name, msg) {
      var el = orderForm.querySelector('[data-err="' + name + '"]');
      if (el) el.textContent = msg || '';
    }
  
    function clearErrs() {
      ['name', 'phone', 'address', 'date'].forEach(function (n) { setErr(n, ''); });
    }
  
    btnOrder.addEventListener('click', function () {
      orderDone.hidden = true;
      orderForm.hidden = false;
      scrollToEl(orderForm);
      setTimeout(function () { fName.focus(); }, 400);
    });
  
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrs();
      var s = getState();
      var ok = true;
      var first = null;
  
      function fail(name, msg, field) {
        setErr(name, msg);
        ok = false;
        if (!first) first = field;
      }
  
      if (fName.value.trim().length < 2) fail('name', '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F', fName);
  
      var digits = fPhone.value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 11) fail('phone', '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 (10\u201311 \u0446\u0438\u0444\u0440)', fPhone);
  
      if (s.isDelivery && fAddress.value.trim().length < 5) fail('address', '\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438', fAddress);
  
      if (!fDate.value) fail('date', '\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0430\u0442\u0443', fDate);
      else if (fDate.value < minDate) fail('date', '\u0422\u043E\u0440\u0442 \u043C\u043E\u0436\u043D\u043E \u0437\u0430\u043A\u0430\u0437\u0430\u0442\u044C \u043D\u0435 \u0440\u0430\u043D\u044C\u0448\u0435 \u0437\u0430\u0432\u0442\u0440\u0430', fDate);
  
      if (!ok) { first.focus(); return; }
  
      showDone(s);
    });
  
    function showDone(s) {
      var pay = orderForm.querySelector('input[name="pay"]:checked').value;
      orderDone.innerHTML = '';
  
      var h = document.createElement('h3');
      h.className = 'subtitle';
      h.textContent = '\u0417\u0430\u043A\u0430\u0437 \u043F\u0440\u0438\u043D\u044F\u0442 (\u0434\u0435\u043C\u043E)';
      orderDone.appendChild(h);
  
      var p1 = document.createElement('p');
      p1.textContent = fName.value.trim() + ', \u043C\u044B \u043F\u0435\u0440\u0435\u0437\u0432\u043E\u043D\u0438\u043C \u043F\u043E \u043D\u043E\u043C\u0435\u0440\u0443 ' + fPhone.value.trim() + ' \u0434\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F.';
      orderDone.appendChild(p1);
  
      var ul = document.createElement('ul');
      ul.className = 'calc__lines';
      fillLines(ul, s.lines);
      orderDone.appendChild(ul);
  
      var p2 = document.createElement('p');
      p2.textContent = '\u0418\u0442\u043E\u0433\u043E: ' + money(s.total) + '. \u041E\u043F\u043B\u0430\u0442\u0430: ' + pay + '.';
      orderDone.appendChild(p2);
  
      var p3 = document.createElement('p');
      var parts = ['\u0414\u0430\u0442\u0430: ' + fDate.value.split('-').reverse().join('.')];
      if (s.isDelivery) parts.push('\u0430\u0434\u0440\u0435\u0441: ' + fAddress.value.trim());
      p3.textContent = parts.join(', ') + '.';
      orderDone.appendChild(p3);
  
      var p4 = document.createElement('p');
      p4.className = 'calc__demo';
      p4.textContent = '\u042D\u0442\u043E \u0434\u0435\u043C\u043E-\u043F\u0440\u043E\u0435\u043A\u0442: \u0437\u0430\u043A\u0430\u0437 \u043D\u0438\u043A\u0443\u0434\u0430 \u043D\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D, \u043E\u043F\u043B\u0430\u0442\u0430 \u043D\u0435 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u043B\u0430\u0441\u044C.';
      orderDone.appendChild(p4);
  
      var again = document.createElement('button');
      again.type = 'button';
      again.className = 'btn-main';
  again.textContent = '\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0439 \u0442\u043E\u0440\u0442';
      again.addEventListener('click', resetAll);
      orderDone.appendChild(again);
  
      orderForm.hidden = true;
      orderDone.hidden = false;
      scrollToEl(orderDone);
      orderDone.focus();
    }
  
    function resetAll() {
      orderForm.reset();
      clearErrs();
      orderForm.hidden = true;
      orderDone.hidden = true;
      scrollToEl(calc);
    }
  
    render();   // первый расчёт при загрузке страницы
  })();