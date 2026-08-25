const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const result = document.getElementById("result");

async function loadCurrencies() {
    try {
        const res = await fetch("https://api.frankfurter.dev/v1/currencies");
        const data = await res.json();

        // put INR first
        if (data["INR"]) {
            const optFrom = document.createElement("option");
            optFrom.value = "INR";
            optFrom.textContent = data["INR"];
            fromSelect.appendChild(optFrom);

            const optTo = document.createElement("option");
            optTo.value = "INR";
            optTo.textContent = data["INR"];
            toSelect.appendChild(optTo);
        }

        // add remaining currencies
        for (const code in data) {
            if (code === "INR") continue;

            const opt1 = document.createElement("option");
            opt1.value = code;
            opt1.textContent = data[code];

            const opt2 = document.createElement("option");
            opt2.value = code;
            opt2.textContent = data[code];

            fromSelect.appendChild(opt1);
            toSelect.appendChild(opt2);
        }

    } catch (error) {
        console.error(error);
    }
}

async function convertCurrency() {
    const amount = amountInput.value;
    const from = fromSelect.value;
    const to = toSelect.value;

    if (!amount || !from || !to) {
        result.textContent = "";
        return;
    }
    if (from === to) {
        result.textContent = amount;
        return;
    }
    const res = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${from}&to=${to}`
    );
    const data = await res.json();

    result.textContent = data.rates[to];
}

toSelect.addEventListener("change", convertCurrency);
fromSelect.addEventListener("change", convertCurrency);
amountInput.addEventListener("input", convertCurrency);

loadCurrencies();