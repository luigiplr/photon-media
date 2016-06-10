import { CLOSE, MAXIMIZE, MINIMIZE, RESTORE } from 'actions/header'

const defaultState = {
  isMaximized: false,
  isMinimized: false,
  isClosed: false
}

export default function header(state = defaultState, action) {
  switch (action.type) {
    case MAXIMIZE:
      return {...state, isMaximized: true, isMinimized: false }
    case CLOSE:
      return state
    case RESTORE:
      return {...state, isMaximized: false, isMinimized: false }
    case MINIMIZE:
      return {...state, isMinimized: true }
      return state
    default:
      return state
  }
}
