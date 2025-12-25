import { createGlobalStyle } from 'styled-components'

let vh = '100vh'
let vw = '100vw'

function isIpad() {
    return (
        navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 2 &&
        /MacIntel/.test(navigator.platform)
    )
}

function setDimensions() {
    const h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

    const w =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth

    if (
        (/((dar)?win)|(linux)|(mac)/gi.test(navigator.platform) && h > 768) ||
        isIpad()
    ) {
        vh = '700px'
        vw = '350px'
        return
    }

    vh = `${h}px`
    vw = `${w}px`
}

setDimensions()
window.addEventListener('resize', setDimensions)
document.addEventListener('DOMContentLoaded', setDimensions)

export const Stylesheet = createGlobalStyle`
  :root {
    --vh: ${vh};
    --vw: ${vw};
    --button-height: 3rem;
    --button-background: white;
    --button-color: black;
    --card-height: 60px;
    --card-width: 45px;
    --color: white;

    --green: #36ca4c;
    --blue: #3e8cd1;
    --yellow: #f9b202;
    --red: #d13e44;
    --orange: #ff9100;

    --gold: var(--yellow);
    --silver: #c0c0c0;
    --bronze: #cd7f32;

    --primary: var(--yellow);
    --good: var(--green);
    --medium: var(--primary);
    --warning: var(--orange);
    --critical: var(--red);

    --understated-grey: #97979b;
  }

  * {
    box-sizing: border-box;
    outline: none !important;
    user-select: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body {
    padding: 0;
    margin: 0;
    font-size: 16px;
    font-family: Gilroy, 'Space Grotesk', sans-serif;
    font-weight: 700 !important;
  }

  b {
    font-weight: 700 !important;
  }

  a, a:hover, a:focus, a:active {
    text-decoration: none !important;
    color: var(--color) !important;
  }

  code {
    font-size: inherit;
    background: #dde0e2;
    padding: 1rem 2rem;
    border-radius: .25rem;
    color: black;
    cursor: default;
    font-weight: bold;
    font-family: inherit;
    user-select: text;
    letter-spacing: .5rem;
  }

  svg {
    stroke-width: 3px;
  }

  .shine {
    mask-image: linear-gradient(
        -75deg,
        rgba(255, 255, 255, .65) 30%,
        rgba(255, 255, 255, 1) 50%,
        rgba(255, 255, 255, .65) 70%
    );

    mask-size: 200%;
        animation: shine 2s linear infinite;
    }

    @keyframes shine {
        from {
            -webkit-mask-position: 150%;
        }
        to {
            -webkit-mask-position: -50%;
        }
    }
`
