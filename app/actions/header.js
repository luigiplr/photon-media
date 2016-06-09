import { remote } from 'electron'

const browserWindow = remote.getCurrentWindow()
export const MAXIMIZE = 'MAXIMIZE'
export const CLOSE = 'CLOSE'
export const RESTORE = 'RESTORE'
export const MINIMIZE = 'MINIMIZE'

export function maximize(isEvent) {
  if (!isEvent)
    browserWindow.maximize()
  return { type: MAXIMIZE }
}

export function close() {
  return { type: CLOSE }
}

export function minimize(isEvent) {
  if (!isEvent)
    browserWindow.minimize()
  return { type: MINIMIZE }
}

export function restore(isEvent = false) {
  if (!isEvent)
    browserWindow.unmaximize()
  return { type: RESTORE }
}
