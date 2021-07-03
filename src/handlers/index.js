import { loginPage, homePage } from '../pages'

export const submitRegister = (e) => {
  e.preventDefault()

  const email = $('#signupEmail').val()
  const password = $('#signupPassword').val()

  $.ajax({
    url: 'http://localhost:5000/users/register',
    method: 'POST',
    data: { email, password },
  })
    .done((user) => {
      loginPage()
    })
    .fail(({ responseJSON }) => {
      $('#submitRegisterBtn').after(`
        <p class="text-center mt-2 text-red-400">${responseJSON.err}</p>
      `)
    })
}

export const submitLogin = (e) => {
  e.preventDefault()

  const email = $('#loginEmail').val()
  const password = $('#loginPassword').val()

  $.ajax({
    url: 'http://localhost:5000/users/login',
    method: 'POST',
    data: { email, password },
  })
    .done(({ token }) => {
      $('#loginEmail').val('')
      $('#loginPassword').val('')
      localStorage.setItem('access_token', token)
      localStorage.setItem('email', email)
      homePage(email)
    })
    .fail(({ responseJSON }) => {
      $('#submitLoginBtn').after(`
        <p class="text-center mt-2 text-red-400">${responseJSON.err}</p>
      `)
    })
}

export const submitLogout = (e) => {
  e.preventDefault()

  localStorage.removeItem('access_token')
  localStorage.removeItem('email')

  // $('#todos').empty()
  $('#user').empty()
  // $('#avatar').empty()

  loginPage()
}

export const submitAddForm = (e) => {
  e.preventDefault()

  let title = $('#inputAddTitle').val()
  let description = $('#inputAddDesc').val()
  let due_date = $('#inputAddDate').val()

  $.ajax({
    url: 'http://localhost:5000/todos',
    method: 'POST',
    headers: { token: localStorage.getItem('access_token') },
    data: { title, description, due_date }
  })
    .done(todo => {
      $('#inputAddTitle').val('')
      $('#inputAddDesc').val('')
      $('#inputAddDate').val('')

      homePage(localStorage.getItem('email'))
    })
    .fail(({ responseJSON }) => {
      $('#addForm').after(`
        <p class="text-center text-red-400">${responseJSON.err}</p>
      `)
    })
}