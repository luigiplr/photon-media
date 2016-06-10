import { remote } from 'electron'

export const MAXIMIZE = 'WINDOW_MAXIMIZE'
export const CLOSE = 'WINDOW_CLOSE'
export const RESTORE = 'WINDOW_RESTORE'
export const MINIMIZE = 'WINDOW_MINIMIZE'

export function maximize(isEvent) {
  if (!isEvent)
    remote.getCurrentWindow().maximize()
  return { type: MAXIMIZE }
}

export function close() {
  return { type: CLOSE }
}

export function minimize(isEvent) {
  if (!isEvent)
    remote.getCurrentWindow().minimize()
  return { type: MINIMIZE }
}

export function restore(isEvent = false) {
  if (!isEvent)
    remote.getCurrentWindow().unmaximize()
  return { type: RESTORE }
}
