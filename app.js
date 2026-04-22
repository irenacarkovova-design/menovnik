// 1. Definice proměnných pro měnový převodník
const amountinput = document.getElementById("amount");
const fromselect = document.getElementById("fromCurrency");
const toselect = document.getElementById("toCurrency");
const resultdiv = document.getElementById("result");
const statusp = document.getElementById("status-info");

// 2. Definice proměnných pro časovou kalkulačku
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const timeResult = document.getElementById("timeResult");

// FUNKCE PRO MĚNY
function calculate(data) {
    const from = fromselect.value;
    const to = toselect.value;
    const rate = data.rates[to] / data.rates[from];
    const result = (amountinput.value * rate).toFixed(2);
    resultdiv.innerText = `${amountinput.value} ${from} = ${result} ${to}`;    
}

function nactiZPameti(zprava) {
    const cashedData = localStorage.getItem('cashedRates');
    if (cashedData) {
        const data = JSON.parse(cashedData);
        statusp.innerText = zprava;
        calculate(data);
    } else {
        resultdiv.innerText = "Nelze načíst kurzy. Jste offline a paměť je prázdná.";
    }
}

async function updateRates() {
    const apiURL = 'https://open.er-api.com/v6/latest/CZK';

    if (!navigator.onLine) {
        nactiZPameti("Pracujete offline (používám starší kurzy)");
        return; 
    }

    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        
        localStorage.setItem('cashedRates', JSON.stringify(data));
        statusp.innerText = "Kurzy jsou aktuální (online).";
        calculate(data);
    } 
    catch (error) {
        nactiZPameti("Offline režim: Kurzy z paměti.");
    }
}

// FUNKCE PRO ČAS
function convertTimeToDecimal() {
    const h = parseFloat(hoursInput.value) || 0;
    const m = parseFloat(minutesInput.value) || 0;
    const decimal = h + (m / 60);
    timeResult.innerText = decimal.toFixed(2) + " h";
}

// POSLUCHAČE UDÁLOSTÍ (EVENT LISTENERS)
[amountinput, fromselect, toselect].forEach(el => {
    el.addEventListener('input', () => {
        const data = JSON.parse(localStorage.getItem('cashedRates'));
        if (data) calculate(data);
    });
});

hoursInput.addEventListener('input', convertTimeToDecimal);
minutesInput.addEventListener('input', convertTimeToDecimal);

// SPUŠTĚNÍ PŘI NAČTENÍ
updateRates();

// REGISTRACE SERVICE WORKERU
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log("SW registrován"))
        .catch(err => console.log("SW chyba", err));
}
