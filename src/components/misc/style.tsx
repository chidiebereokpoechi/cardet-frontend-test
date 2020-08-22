import { createGlobalStyle } from 'styled-components'

let vh = '100vh'
let vw = '100vw'

window.addEventListener('resize', () => {
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
})

export const Stylesheet = createGlobalStyle`
  :root {
    --vh: ${vh};
    --vw: ${vw};
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    padding: 0;
    margin: 0;
    font-size: 16px;
    color: white;
    font-family: 'Space Grotesk', sans-serif;
  }
`
