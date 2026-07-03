import ReactDOM from 'react-dom/client'
import '@fontsource/italiana'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import '@fontsource/jost/300.css'
import '@fontsource/jost/400.css'
import '@fontsource/jost/500.css'
import './index.css'
import App from './App.jsx'

// Scroll-driven site: never let the browser restore a mid-pin position.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Shared scroll/pointer state. Module scope on purpose: child effects run
// before parent effects, so initializing this in App's useEffect is too late.
window.__rouge = {
  hero: 0,
  showcase: 0,
  film: 0,
  spin: 0,
  tierIndex: 0,
  mouse: { x: 0, y: 0 },
  lenis: null,
  sceneObj: null,
  particles: null,
}

// No StrictMode: double-invoked effects would double-init WebGL/Lenis.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
