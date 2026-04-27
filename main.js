const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const inputVal = document.getElementById('input-value');
const outputVal = document.getElementById('output-value');
const fromUnit = document.getElementById('from-unit');
const toUnit = document.getElementById('to-unit');
const catBtns = document.querySelectorAll('.cat-btn');

const units = {
    length: {
        meters: 1,
        kilometers: 1000,
        centimeters: 0.01,
        millimeters: 0.001,
        miles: 1609.34,
        yards: 0.9144,
        feet: 0.3048,
        inches: 0.0254
    },
    weight: {
        kilograms: 1,
        grams: 0.001,
        milligrams: 0.000001,
        pounds: 0.453592,
        ounces: 0.0283495
    },
    temperature: {
        celsius: 'C',
        fahrenheit: 'F',
        kelvin: 'K'
    }
};

let currentCategory = 'length';

// Theme Logic
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') body.classList.add('light-mode');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Conversion Logic
function populateUnits() {
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    const categoryUnits = Object.keys(units[currentCategory]);
    categoryUnits.forEach(unit => {
        const opt1 = document.createElement('option');
        opt1.value = unit;
        opt1.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
        fromUnit.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = unit;
        opt2.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
        toUnit.appendChild(opt2);
    });

    // Set default selections
    if (categoryUnits.length > 1) {
        toUnit.selectedIndex = 1;
    }
    convert();
}

function convert() {
    const val = parseFloat(inputVal.value);
    if (isNaN(val)) {
        outputVal.value = '';
        return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    if (currentCategory === 'temperature') {
        outputVal.value = convertTemperature(val, from, to).toFixed(2);
    } else {
        const inBase = val * units[currentCategory][from];
        const result = inBase / units[currentCategory][to];
        outputVal.value = result.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
}

function convertTemperature(val, from, to) {
    if (from === to) return val;
    
    let celsius;
    if (from === 'celsius') celsius = val;
    else if (from === 'fahrenheit') celsius = (val - 32) * 5/9;
    else if (from === 'kelvin') celsius = val - 273.15;

    if (to === 'celsius') return celsius;
    if (to === 'fahrenheit') return celsius * 9/5 + 32;
    if (to === 'kelvin') return celsius + 273.15;
}

// Event Listeners
catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        populateUnits();
    });
});

inputVal.addEventListener('input', convert);
fromUnit.addEventListener('change', convert);
toUnit.addEventListener('change', convert);

// Init
populateUnits();
