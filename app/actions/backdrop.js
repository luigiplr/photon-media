import { defer } from 'lodash'

export const DISABLE_INFO = 'BACKDROP_DISABLE_INFO'
export const ENABLE_INFO = 'BACKDROP_ENABLE_INFO'
export const CHANGE = 'BACKDROP_CHANGE'
export const ENABLE = 'BACKDROP_ENABLE'
export const DISABLE = 'BACKDROP_DISABLE'

export function disable() {
  return { type: DISABLE }
}

export function enable() {
  return { type: ENABLE }
}

export function disableInfo() {
  return { type: DISABLE_INFO }
}

export function enableInfo() {
  return { type: ENABLE_INFO }
}

export function change(info, url) {
  return dispatch => {
    let backdropImage = new Image()
    backdropImage.onload = () => {
      dispatch({ info, url, type: CHANGE })
      defer(() => backdropImage = null)
    }
    backdropImage.src = url
  }
}
