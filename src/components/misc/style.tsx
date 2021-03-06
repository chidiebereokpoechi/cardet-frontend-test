import { createGlobalStyle } from 'styled-components'

let vh = '100vh'
let vw = '100vw'

function setDimensions() {
  const h =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight

  const w =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  if (/((dar)?win)|(linux)|(mac)/gi.test(navigator.platform) && h > 768) {
    vh = '800px'
    vw = '400px'
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
    --card-height: 60px;
    --card-width: 45px;
    --color: white;
  }

  * {
    box-sizing: border-box;
    outline: none !important;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body {
    padding: 0;
    margin: 0;
    font-size: 16px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 400;
  }

  b {
    font-weight: 500;
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
`
