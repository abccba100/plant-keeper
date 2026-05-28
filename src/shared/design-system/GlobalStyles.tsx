import { Global, css } from '@emotion/react'

const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
    color: #141815;
    background: #f7f5ef;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    overflow-x: hidden;
  }

  button {
    appearance: none;
    -webkit-appearance: none;
    font: inherit;
    color: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  @keyframes drift {
    from {
      transform: translate3d(-8px, -10px, 0) rotate(-8deg);
    }
    to {
      transform: translate3d(18px, 18px, 0) rotate(12deg);
    }
  }

  @keyframes shimmer {
    0%,
    100% {
      opacity: 0.28;
    }
    50% {
      opacity: 0.48;
    }
  }

  @keyframes anchoredBreathe {
    0%,
    100% {
      transform: translateX(-50%) translateY(0) scale(var(--scale));
    }
    50% {
      transform: translateX(-50%) translateY(-2px) scale(calc(var(--scale) * 1.015));
    }
  }

  @keyframes waterDrop {
    0% {
      opacity: 0;
      transform: translate3d(0, -12px, 0) rotate(22deg) scale(0.72);
    }
    34% {
      opacity: 0.86;
    }
    100% {
      opacity: 0;
      transform: translate3d(-7px, 32px, 0) rotate(22deg) scale(0.94);
    }
  }

  @keyframes waterRipple {
    0% {
      opacity: 0;
      transform: scaleX(0.5);
    }
    38% {
      opacity: 0.72;
    }
    100% {
      opacity: 0;
      transform: scaleX(1.18);
    }
  }

  @keyframes soilSoak {
    0% {
      filter: saturate(0.92) brightness(1.08);
      transform: scaleY(0.94);
    }
    54% {
      filter: saturate(1.08) brightness(0.96);
      transform: scaleY(1.08);
    }
    100% {
      filter: none;
      transform: scaleY(1);
    }
  }

  @keyframes anchoredSoilSoak {
    0% {
      filter: saturate(0.92) brightness(1.08);
      transform: translateX(-50%) scaleY(0.94);
    }
    54% {
      filter: saturate(1.08) brightness(0.96);
      transform: translateX(-50%) scaleY(1.08);
    }
    100% {
      filter: none;
      transform: translateX(-50%) scaleY(1);
    }
  }

  @keyframes scheduleComplete {
    0% {
      transform: translateY(2px) scale(0.98);
    }
    48% {
      transform: translateY(-2px) scale(1.015);
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 1ms !important;
      scroll-behavior: auto !important;
    }
  }
`

export function GlobalStyles() {
  return <Global styles={globalStyles} />
}
