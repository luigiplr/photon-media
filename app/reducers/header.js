import { CLOSE, MAXIMIZE, MINIMIZE, RESTORE } from 'actions/header'

const defaultState = {
  isMaximized: false,
  isClosed: false
}

export default function header(state = defaultState, action) {
  switch (action.type) {
    case MAXIMIZE:
      return {...state, isMaximized: true }
    case CLOSE:
      return state
    case RESTORE:
      return {...state, isMaximized: false }
    case MINIMIZE:
      return state
    default:
      return state
  }
}
