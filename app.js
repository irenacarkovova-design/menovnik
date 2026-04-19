const amountinput = document.getElementById("amount");
const fromselect = document.getElementById("fromCurrency");
const toselect = document.getElementById("toCurrency");
const resultdiv = document.getElementById("result");
const statusp = document.getElementById("status-info");

function calculate(data) {
    const from = fromselect.value;
    const to = toselect.value;
    const rate = data.rates[to] / data.rates[from];
    const result = (amountinput.value * rate).toFixed(2);
    resultdiv.innerText = `${amountinput.value} ${from} = ${result} ${to}`;    
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
        statusp.innerText = "Kurzy jsou aktuální (online)."; // Použita proměnná statusp
        calculate(data);
    } 
    catch (error) {
        nactiZPameti("Offline režim: Kurzy z paměti.");
        }
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

    [amountinput, fromselect, toselect].forEach(el => {
        el.addEventListener('input', () => {
            const data = JSON.parse(localStorage.getItem('cashedRates'));
            if (data) calculate(data);
        });
    });
    updateRates();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
    }
