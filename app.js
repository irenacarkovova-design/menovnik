// --- MĚNOVÝ PŘEVODNÍK ---
const amountinput = document.getElementById("amount");
const fromselect = document.getElementById("fromCurrency");
const toselect = document.getElementById("toCurrency");
const resultdiv = document.getElementById("result");
const statusp = document.getElementById("status-info");

// --- ČASOVÁ KALKULAČKA ---
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const timeResult = document.getElementById("timeResult");

// Logika pro měny
function calculate(data) {
    if (!data || !data.rates) return;
    const from = fromselect.value;
    const to = toselect.value;
    const rate = data.rates[to] / data.rates[from];
    const result = (amountinput.value * rate).toFixed(2);
    resultdiv.innerText = `${amountinput.value} ${from} = ${result} ${to}`;    
}

async function updateRates() {
    const apiURL = 'https://open.er-api.com/v6/latest/CZK';
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        localStorage.setItem('cashedRates', JSON.stringify(data));
        statusp.innerText = "Kurzy jsou aktuální (online).";
        calculate(data);
    } catch (error) {
        const cached = localStorage.getItem('cashedRates');
        if (cached) {
            statusp.innerText = "Režim offline (starší kurzy).";
            calculate(JSON.parse(cached));
        }
    }
}

// Logika pro čas (TADY JE TA OPRAVA)
function convertTime() {
    const h = parseFloat(hoursInput.value) || 0;
    const m = parseFloat(minutesInput.value) || 0;
    const decimal = h + (m / 60);
    timeResult.innerText = decimal.toFixed(2) + " h";
}

// Event Listenery
[amountinput, fromselect, toselect].forEach(el => {
    el.addEventListener('input', () => {
        const data = JSON.parse(localStorage.getItem('cashedRates'));
        calculate(data);
    });
});

hoursInput.addEventListener('input', convertTime);
minutesInput.addEventListener('input', convertTime);

// Spuštění
updateRates();

// Registrace SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
