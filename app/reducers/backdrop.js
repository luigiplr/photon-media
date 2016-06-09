import { CHANGE, DISABLE_INFO, ENABLE_INFO } from 'actions/backdrop'

const defaultState = {
  infoIsEnabled: true,
  url: null,
  info: { title: null, url: null, rating: null, year: null }
}

export default function backdrop(state = defaultState, action) {
  switch (action.type) {
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
