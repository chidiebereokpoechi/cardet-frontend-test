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

  vh = `${h}px`
  vw = `${w}px`
}

setDimensions()
window.addEventListener('resize', setDimensions)

export const Stylesheet = createGlobalStyle`
  :root {
    --vh: ${vh};
    --vw: ${vw};
  }

  * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body {
    padding: 0;
    margin: 0;
    font-size: 16px;
    color: white;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 400;
  }

  b {
    font-weight: 500;
  }

  a {
    text-decoration: none;
  }
`
