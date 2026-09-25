import API from "./axios";

const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

function isCanceled(error, signal) {
  return signal?.aborted || error?.code === "ERR_CANCELED";
}

function isRetryable(error) {
  return (
    !error.response ||
    error.code === "ECONNABORTED" ||
    error.code === "ETIMEDOUT" ||
    error.code === "ERR_NETWORK" ||
    RETRYABLE_STATUS_CODES.has(error.response?.status)
  );
}

function waitForRetry(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      const error = new Error("Request canceled");
      error.code = "ERR_CANCELED";
      reject(error);
      return;
    }

    const timer = window.setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, milliseconds);
    const handleAbort = () => {
      window.clearTimeout(timer);
      signal?.removeEventListener("abort", handleAbort);
      const error = new Error("Request canceled");
      error.code = "ERR_CANCELED";
      reject(error);
    };

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

export default async function getWithRetry(
  url,
  config = {},
  { attempts = 4, onRetry } = {},
) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await API.get(url, { ...config, timeout: 20_000 });
    } catch (error) {
      if (isCanceled(error, config.signal)) throw error;
      lastError = error;
      if (attempt === attempts || !isRetryable(error)) throw error;

      onRetry?.({ attempt, attempts, error });
      await waitForRetry(attempt * 2_000, config.signal);
    }
  }

  throw lastError;
}
