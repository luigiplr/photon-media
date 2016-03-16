export default `

doctype html
html
  head
    meta(charset='utf-8')
    title Photon Media
    link(href='https://fonts.googleapis.com/css?family=Roboto:400,400italic,500italic,500,300italic,300,100italic,100,700,700italic,900,900italic', rel='stylesheet', type='text/css')
    // Begin Paper Elements
    script(src='bower_components/webcomponentsjs/webcomponents-lite.min.js')
    link(rel='import', href='bower_components/paper-button/paper-button.html')
    link(rel='import', href='bower_components/paper-input/paper-input.html')
    // End Paper Elements
    script.
      (function() {
      if (!process.env.HOT) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '../dist/style.css'
      document.write(link.outerHTML)
      }
      }())
  body
    #root
    script.
      (function() {
      const script = document.createElement('script')
      script.src = (process.env.HOT) ? 'http://localhost:3000/dist/bundle.js' : '../dist/bundle.js'
      document.write(script.outerHTML)
      }())


`