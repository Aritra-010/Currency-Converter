import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyCKUCCbRo-OvnpE4pNOx9bX3-j8yPB1oao",
    authDomain: "currency-converter-d098c.firebaseapp.com",
    projectId: "currency-converter-d098c",
    storageBucket: "currency-converter-d098c.firebasestorage.app",
    messagingSenderId: "739677937464",
    appId: "1:739677937464:web:787ebb24102c4af920abcd"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const googleLoginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

googleLoginBtn.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        console.log("Logged in user:", user);

        userInfo.textContent = `Welcome, ${user.displayName}`;
    } catch (error) {
        console.error("Login error:", error);
    }
});

logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
    } catch (error) {
        console.error("Logout error:", error);
    }
});

onAuthStateChanged(auth, (user) => {

    if (user) {
        console.log("User is logged in:", user.email);

        googleLoginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";

        userInfo.textContent = `Welcome, ${user.displayName}`;

    } else {
        console.log("No user is logged in");

        googleLoginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";

        userInfo.textContent = "";
    }

});

console.log("Firebase initialized successfully!");

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