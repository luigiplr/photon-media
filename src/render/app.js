process.on('uncaughtException', console.error)

document.addEventListener('DOMContentLoaded', () => render(<Framework />, document.getElementById('root')))