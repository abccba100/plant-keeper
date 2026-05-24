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

  @keyframes breathe {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-2px) scale(1.015);
    }
  }
`

export function GlobalStyles() {
  return <Global styles={globalStyles} />
}
