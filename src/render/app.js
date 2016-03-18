import reactPolymer from 'react-polymer'
import React from 'react'
import { render } from 'react-dom'
import Framework from './js/render/components/Framework.react'

process.on('uncaughtException', console.error)

document.addEventListener('DOMContentLoaded', () => render(<Framework />, document.getElementById('app')))
