import axios from "axios";
const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

const api = axios.create({
    baseURL: `https://v6.exchangerate-api.com/v6/${apiKey}`
});

// get request
export const currencyConverter = (fromCurr, toCurr, amount) => {
    return api.get(`/pair/${fromCurr}/${toCurr}/${amount}`);
}

export const getSupportedCode = () => {
    return api.get(`/codes`);
}


