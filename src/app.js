$(document).ready(function () {
  if (localStorage.getItem('access_token')) {
    homePage(localStorage.getItem('email'))
  } else {
    loginPage()
  }

  $('#loginBtn').click(loginPage)
  $('#signUpBtn').click(signupPage)
  $('#submitRegisterBtn').click(submitRegister)
  $('#loginPage').submit(submitLogin)
  $('#logoutBtn').click(submitLogout)
  $('#addForm').submit(submitAddForm)
})
