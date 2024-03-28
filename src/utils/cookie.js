function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

function setCookie(name = null, lifespanInSeconds = null, value = '') {
  if (name === null) {
    console.error('The name or value cannot be empty')
    return
  }

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (lifespanInSeconds != null) {
    cookie = `${cookie}; max-age=${lifespanInSeconds};`
  }

  return (document.cookie = cookie)
}

export { getCookie, setCookie }
