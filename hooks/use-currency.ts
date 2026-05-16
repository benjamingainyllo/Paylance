"use client";

import { useState, useEffect } from "react";

export function useCurrency() {
  const [currency, setCurrency] = useState({ symbol: "₦", code: "NGN", name: "Naira" });

  useEffect(() => {
    // Force Naira regardless of location
    setCurrency({ symbol: "₦", code: "NGN", name: "Naira" });
  }, []);

  const formatPrice = (amount: number, minimumFractionDigits = 0) => {
    // Create a local formatter string manually for simplicity or use Intl.NumberFormat
    // Many currencies like Rwf don't typically show decimal places if it's 0, so we just build a string.
    let formattedAmount = amount.toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits: 2 });
    return `${currency.symbol}${formattedAmount}`;
  };

  return { currency, formatPrice };
}
