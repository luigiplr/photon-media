import { CHANGE, DISABLE_INFO, ENABLE_INFO, ENABLE, DISABLE } from 'actions/backdrop'

const defaultState = {
  infoIsEnabled: true,
  isEnabled: true,
  url: null,
  info: { title: null, homepage: null, certification: null, year: null }
}

export default function backdrop(state = defaultState, action) {
  switch (action.type) {
    case ENABLE:
      return {...state, isEnabled: true }
    case DISABLE:
      return {...state, isEnabled: false }
    case DISABLE_INFO:
      return {...state, info: defaultState.info, infoIsEnabled: false }
    case ENABLE_INFO:
      return {...state, infoIsEnabled: true }
    case CHANGE:
      return {...state, url: action.url, info: action.info }
    default:
      return state
  }
}
