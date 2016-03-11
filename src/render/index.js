import reactPolymer from 'react-polymer'
import React from 'react'
import { render } from 'react-dom'
import Framework from './components/Framework.react'
import './app.global.css'


render(<Framework />, document.getElementById('root'))

if (process.env.NODE_ENV !== 'production') {}
