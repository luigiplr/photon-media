import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import settings from './settings'
import header from './header'

const rootReducer = combineReducers({
  settings,
  header,
  routing
})

export default rootReducer
