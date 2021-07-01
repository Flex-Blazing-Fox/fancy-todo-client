import { submitRegister, submitLogin, submitLogout } from './handlers'
import { signupPage, loginPage, homePage } from './pages'

$(document).ready(function () {
  if (localStorage.getItem('access_token')) {
    homePage()
  } else {
    loginPage()
  } 

  $('#loginBtn').click(loginPage)
  $('#signUpBtn').click(signupPage)
  $('#submitRegisterBtn').click(submitRegister)
  $('#submitLoginBtn').click(submitLogin)
  $('#logoutBtn').click(submitLogout)
})
