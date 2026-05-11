import React, { useEffect, useState } from "react";
import { currencyConverter, getSupportedCode } from "../api/postApi";

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(0);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("INR");
    const [loading, setLoading] = useState(false);
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [currencies, setCurrencies] = useState([]);


    const rates = {
        USD: 1,
        INR: 83,
        EUR: 0.92,
        GBP: 0.79,
        AED: 3.67,
    };

    const convertedAmountFn = async () => {
        console.log(fromCurrency, toCurrency, amount);
        setLoading(true);
        try {
            const res = await currencyConverter(fromCurrency, toCurrency, amount);
            const data = res.data;
            setExchangeRate(data.conversion_rate);
            setConvertedAmount(data.conversion_result);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        } finally {
            setLoading(false);
        }
        const usd = amount / rates[fromCurrency];

        //setConvertedAmount((usd * rates[toCurrency]).toFixed(2));
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const fetchSupportCode = async () => {
        const res = await getSupportedCode();
        if (res.status === 200) {
            const codes = res.data.supported_codes;
            const allSupportCurrency = codes.map((ele) => {
                return {
                    currCode: ele[0],
                    currText: ele[1]
                }
            });
            setCurrencies(allSupportCurrency);
            setFromCurrency(allSupportCurrency[0].currCode);
            setToCurrency(allSupportCurrency[0].currCode);
            return;
        }
        setCurrencies(Object.keys(rates));
    }
    useEffect(() => {
        fetchSupportCode();
    }, []);

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Currency Converter</h1>
                        <p style={styles.subtitle}>
                            Check live exchange rates instantly
                        </p>
                    </div>
                </div>

                {/* Amount */}
                <div style={styles.section}>
                    <label style={styles.label}>Amount</label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={styles.input}
                        placeholder="Enter amount"
                    />
                </div>

                {/* Currency Selection */}
                <div style={styles.currencyContainer}>
                    <div style={styles.currencyBox}>
                        <label style={styles.label}>From</label>

                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            style={styles.select}
                        >
                            {currencies.length > 0 && currencies.map((currency) => (
                                <option key={currency.currCode} value={currency.currCode}>{currency.currCode} ({currency.currText})</option>
                            ))}
                        </select>
                    </div>

                    {/* Swap Button */}
                    <button style={styles.swapButton} onClick={swapCurrencies}>
                        ⇄
                    </button>

                    <div style={styles.currencyBox}>
                        <label style={styles.label}>To</label>
                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            style={styles.select}
                        >
                            {currencies.length > 0 && currencies.map((currency) => (
                                <option key={currency.currCode} value={currency.currCode}>{currency.currCode} ({currency.currText})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Result */}
                {
                    exchangeRate !== 0 && (<div style={styles.resultCard}>
                        <p style={styles.resultLabel}>You will get</p>

                        <h2 style={styles.result}>
                            {convertedAmount} {toCurrency}
                        </h2>


                        <p style={styles.rate}>
                            1 {fromCurrency} = {" "} {exchangeRate} {" "} {toCurrency}
                        </p>

                    </div>
                    )
                }

                {/* Convert Button */}
                <button disabled={loading || amount <= 0} style={styles.convertBtn} onClick={convertedAmountFn}>
                    {loading ? "Converting..." : "Convert Currency"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f7fb",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
    },

    card: {
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "30px",
        boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
    },

    title: {
        margin: 0,
        fontSize: "28px",
        color: "#1f2937",
    },

    subtitle: {
        marginTop: "6px",
        color: "#6b7280",
        fontSize: "14px",
    },

    iconBox: {
        width: "55px",
        height: "55px",
        borderRadius: "16px",
        background: "#eef4ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "26px",
    },

    section: {
        marginBottom: "24px",
    },

    label: {
        display: "block",
        marginBottom: "10px",
        fontSize: "14px",
        color: "#4b5563",
        fontWeight: "600",
    },

    input: {
        width: "100%",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid #dbe2ea",
        fontSize: "18px",
        outline: "none",
        background: "#fafafa",
        boxSizing: "border-box",
    },

    currencyContainer: {
        display: "flex",
        alignItems: "flex-end",
        gap: "14px",
        marginBottom: "28px",
    },

    currencyBox: {
        flex: 1,
    },

    select: {
        width: "100%",
        padding: "15px",
        borderRadius: "14px",
        border: "1px solid #dbe2ea",
        background: "#fafafa",
        fontSize: "16px",
        cursor: "pointer",
        outline: "none",
    },

    swapButton: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        border: "none",
        background: "#2563eb",
        color: "#fff",
        fontSize: "22px",
        cursor: "pointer",
        marginBottom: "2px",
        boxShadow: "0 5px 15px rgba(37,99,235,0.3)",
    },

    resultCard: {
        background: "#f8fbff",
        border: "1px solid #e5eefc",
        borderRadius: "18px",
        padding: "22px",
        textAlign: "center",
        marginBottom: "25px",
    },

    resultLabel: {
        margin: 0,
        color: "#6b7280",
        fontSize: "14px",
    },

    result: {
        margin: "12px 0",
        fontSize: "38px",
        color: "#111827",
    },

    rate: {
        color: "#6b7280",
        fontSize: "14px",
    },

    convertBtn: {
        width: "100%",
        padding: "16px",
        borderRadius: "16px",
        border: "none",
        background: "#111827",
        color: "#fff",
        fontSize: "17px",
        fontWeight: "600",
        cursor: "pointer",
    },
};

export default CurrencyConverter;