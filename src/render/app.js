import reactPolymer from 'react-polymer'
import React from 'react'
import { render } from 'react-dom'

import Framework from './components/Framework.react'

process.on('uncaughtException', console.error)

render(<Framework />, document.getElementById('root'))
