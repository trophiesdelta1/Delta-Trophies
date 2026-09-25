import { useEffect, useState } from "react";

const PRELOADER_SESSION_KEY = "delta-preloader-shown";
const DISPLAY_TIME_MS = 2400;
const EXIT_TIME_MS = 850;

function shouldShowPreloader() {
  try {
    return sessionStorage.getItem(PRELOADER_SESSION_KEY) !== "true";
  } catch {
    return true;
  }
}

function InitialPreloader() {
  const [visible, setVisible] = useState(shouldShowPreloader);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => {
      setLeaving(true);
      try {
        sessionStorage.setItem(PRELOADER_SESSION_KEY, "true");
      } catch {
        // The loader can still finish when browser storage is unavailable.
      }
    }, DISPLAY_TIME_MS);
    const removeTimer = window.setTimeout(
      () => setVisible(false),
      DISPLAY_TIME_MS + EXIT_TIME_MS,
    );

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`initial-preloader ${leaving ? "initial-preloader--leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Opening Delta Industries"
    >
      <div className="initial-preloader__content">
        <img
          src="/favicon-192.png"
          alt=""
          className="initial-preloader__mark"
        />
        <p className="initial-preloader__name">Delta Industries</p>
        <div className="initial-preloader__line" aria-hidden="true">
          <span />
        </div>
        <p className="initial-preloader__caption">Crafting excellence since 1998</p>
      </div>
    </div>
  );
}

export default InitialPreloader;
