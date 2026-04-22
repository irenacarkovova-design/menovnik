// --- 1. DEFINICE PROMĚNNÝCH ---
const amountinput = document.getElementById("amount");
const fromselect = document.getElementById("fromCurrency");
const toselect = document.getElementById("toCurrency");
const resultdiv = document.getElementById("result");
const statusp = document.getElementById("status-info");

const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const timeResult = document.getElementById("timeResult");

// --- 2. LOGIKA PRO KURZY ---
function calculate(data) {
    if (!data || !data.rates) return;
    const from = fromselect.value;
    const to = toselect.value;
    const rate = data.rates[to] / data.rates[from];
    const amount = parseFloat(amountinput.value) || 0;
    const result = (amount * rate).toFixed(2);
    resultdiv.innerText = `${amount} ${from} = ${result} ${to}`;    
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
        } else {
            statusp.innerText = "Jste offline a nemáte uložená data.";
        }
    }
}

// --- 3. LOGIKA PRO ČAS ---
function convertTime() {
    const h = parseFloat(hoursInput.value) || 0;
    const m = parseFloat(minutesInput.value) || 0;
    const decimal = h + (m / 60);
    if (timeResult) {
        timeResult.innerText = decimal.toFixed(2) + " h";
    }
}

// --- 4. EVENT LISTENERY (HLÍDAČE) ---

// Hlídače pro měny
[amountinput, fromselect, toselect].forEach(el => {
    if (el) {
        el.addEventListener('input', () => {
            const cached = localStorage.getItem('cashedRates');
            if (cached) calculate(JSON.parse(cached));
        });
    }
});

// Hlídače pro čas
if (hoursInput && minutesInput) {
    hoursInput.addEventListener('input', convertTime);
    minutesInput.addEventListener('input', convertTime);
}

// --- 5. SPUŠTĚNÍ PŘI STARTU ---
updateRates();
convertTime();

// Registrace Service Workeru
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log(err));
}
