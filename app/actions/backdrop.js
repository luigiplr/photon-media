import { defer } from 'lodash'

export const DISABLE_INFO = 'DISABLE_INFO'
export const ENABLE_INFO = 'ENABLE_INFO'
export const CHANGE = 'CHANGE'

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
