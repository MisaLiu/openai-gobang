import { nanoid } from 'nanoid'
import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'

// Create a session ID
if (window.localStorage.getItem('sessiontoken') === null) {
  window.localStorage.setItem('sessiontoken', nanoid());
}

render(<App />, document.getElementById('app')!)
