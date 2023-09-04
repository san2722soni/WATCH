import { useEffect, useState } from "react";

const PREFIX = "CHAT-message-";

const ISSERVER = typeof window === "undefined";

export default function useLocalStorage(key, initialValue) {
  let jsonValue;
  const prefixedKey = PREFIX + key;

  if (!ISSERVER) {
    jsonValue = localStorage.getItem(prefixedKey);
  }
  const [value, setValue] = useState(() => {
    // Here one error occurs if you reload page when localStorage id is 'undefined'
    if (jsonValue != null) return JSON.parse(jsonValue);
    if (typeof initialValue === "function") {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);

  return [value, setValue];
}
