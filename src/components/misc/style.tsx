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
    vh = '640px'
    vw = '360px'
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
    color: inherit !important;
  }

  code {
    font-size: inherit;
    background: #dde0e2;
    padding: .25rem .75rem;
    border-radius: .25rem;
    color: black;
    cursor: default;
    font-weight: inherit;
    user-select: text;
  }
`
