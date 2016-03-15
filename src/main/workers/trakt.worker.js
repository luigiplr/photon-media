self.onmessage = ({ data }) => {
    self.postMessage('received ' + data)
}
