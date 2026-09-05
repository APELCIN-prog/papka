// ========================
// 1. ДАННЫЕ (холодные цвета)
// ========================
const expenseData = [
    { name: 'Маша', amount: 4200, color: '#4A9EFF' },
    { name: 'Петя', amount: 3800, color: '#6C5CE7' },
    { name: 'Оля', amount: 3200, color: '#00CEC9' },
    { name: 'Коля', amount: 2500, color: '#74B9FF' },
    { name: 'Дима', amount: 1720, color: '#A29BFE' },
];

// ========================
// 1.5 ДАННЫЕ ПО ДОЛГАМ (только имя + сумма)
// ========================
const debtData = [
    { from: 'Маша', to: 'Петя', amount: 1200 },
    { from: 'Оля', to: 'Коля', amount: 850 },
    { from: 'Дима', to: 'Маша', amount: 2300 },
    { from: 'Петя', to: 'Оля', amount: 420 },
    { from: 'Коля', to: 'Дима', amount: 180 },
];

// ========================
// 2. ДИАГРАММА (БЕЗ СВЕЧЕНИЯ)
// ========================
function drawChart() {
    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    const total = expenseData.reduce((sum, item) => sum + item.amount, 0);
    document.getElementById('totalSpent').textContent = total.toLocaleString();

    ctx.clearRect(0, 0, width, height);

    let startAngle = -Math.PI / 2;

    // 1. Рисуем цветные сектора круга
    expenseData.forEach((item) => {
        const sliceAngle = (item.amount / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = item.color;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 2;
        ctx.stroke();

        startAngle = endAngle;
    });

    // 2. ВЫРЕЗАЕМ ЦЕНТР (Превращаем в Donut Chart)
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    const innerRadius = radius * 0.65; 
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // 3. Добавляем красивое внутреннее полупрозрачное кольцо для объема
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ВЫЗОВ, КОТОРЫЙ ПРОПАЛ: Отрисовка списка людей под диаграммой
    renderLegend(total); 
}


// ========================
// 3. ЛЕГЕНДА СО СВЕЧЕНИЕМ
// ========================
function renderLegend(total) {
    const container = document.getElementById('legendContainer');
    if (!container) return;

    container.innerHTML = '';

    expenseData.forEach((item) => {
        const percent = ((item.amount / total) * 100).toFixed(0);

        const div = document.createElement('div');
        div.className = 'legend-item';

        const glowColor = item.color;

        div.innerHTML = `
            <span class="legend-color" style="background: ${item.color}; box-shadow: 0 0 16px 6px ${glowColor}50;"></span>
            <span class="legend-name">${item.name}</span>
            <span class="legend-amount">${item.amount.toLocaleString()} ₽</span>
            <span class="legend-percent">${percent}%</span>
        `;

        container.appendChild(div);
    });
}

// ========================
// 4. РЕНДЕР ЗАДОЛЖЕННОСТЕЙ (БЛОК А)
// ========================
function renderDebts() {
    const container = document.getElementById('debtList');
    const totalEl = document.getElementById('debtTotal');
    if (!container) return;

    container.innerHTML = '';

    let total = 0;

    debtData.forEach((debt) => {
        total += debt.amount;

        const div = document.createElement('div');
        div.className = 'debt-item';

        div.innerHTML = `
            <span class="debt-people">
                <span class="debt-name">${debt.from}</span>
                <span class="debt-arrow">→</span>
                <span class="debt-name">${debt.to}</span>
            </span>
            <span class="debt-amount">${debt.amount.toLocaleString()} ₽</span>
        `;

        container.appendChild(div);
    });

    if (debtData.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; color:rgba(255,255,255,0.3); padding:20px 0; font-size:14px;">
                ✨ Все долги закрыты!
            </div>
        `;
    }

    totalEl.textContent = `Итого: ${total.toLocaleString()} ₽`;
}

// ========================
// 6. ВКЛАДКИ (переключение)
// ========================
document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', function() {
        // Убираем активный класс у всех вкладок
        document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
        this.classList.add('active');

        // Скрываем весь контент
        document.querySelectorAll('.tab-content').forEach((content) => {
            content.classList.remove('active');
        });

        // Показываем нужный контент
        const tabId = this.dataset.tab;
        const target = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
        if (target) target.classList.add('active');
    });
});

// ========================
// 7. ДОБАВЛЕНИЕ РАСХОДА (обработчик)
// ========================
document.getElementById('addExpenseBtn')?.addEventListener('click', function() {
    const amount = document.getElementById('expenseAmount').value;
    const category = document.getElementById('expenseCategory');
    const categoryText = category.options[category.selectedIndex].text;
    const payer = document.getElementById('expensePayer').value;

    if (!amount || parseFloat(amount) <= 0) {
        alert('Введите сумму расхода');
        return;
    }

    // Здесь вы можете добавить логику отправки на бэкенд
    console.log(`💰 Расход: ${amount} ₽, категория: ${categoryText}, платил: ${payer}`);

    // Визуальный фидбек
    this.textContent = '✅ Добавлено!';
    setTimeout(() => {
        this.textContent = '➕ Добавить';
    }, 1500);

    // Очищаем поле суммы
    document.getElementById('expenseAmount').value = '';
});

// ========================
// 5. ЗАПУСК
// ========================
document.addEventListener('DOMContentLoaded', () => {
    drawChart();
    renderDebts();
    console.log('📊 Диаграмма со свечением загружена');
});