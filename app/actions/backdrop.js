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
  return {
    info,
    url,
    type: CHANGE
  }
}
