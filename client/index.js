import 'semantic-styles'
import 'babel-polyfill'

const urlParams = new URLSearchParams(window.location.search)
const authBtn = document.querySelector('#auth-btn')
authBtn.addEventListener('click', authWithGoogle)

if (urlParams.has('code')) {
  const code = urlParams.get('code')
  sendAccessToken(code)
}

async function authWithGoogle() {
  const res = await fetch(`http://localhost:3000/login`)

  if (res.ok) {
    const { url } = await res.json()

    window.location.href = url
  }
}

async function sendAccessToken(code) {
  const data = { code }

  fetch(`http://localhost:3000/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}
