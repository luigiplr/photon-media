import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import settings from './settings'
import header from './header'
import backdrop from './backdrop'

const rootReducer = combineReducers({
  settings,
  header,
  backdrop,
  routing
})

export default rootReducer
