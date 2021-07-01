export const signupPage = () => {
  $('#logoutBtn').hide()
  $('#mainContent').hide()
  $('#welcomeText').hide()
  $('#loginPage').hide()
  $('#signUpPage').show()
}

export const loginPage = () => {
  $('#logoutBtn').hide()
  $('#mainContent').hide()
  $('#welcomeText').hide()
  $('#signUpPage').hide()
  $('#loginPage').show()
}

export const homePage = (email) => {
  $('#logoutBtn').show()
  $('#loginBtn').hide()
  $('#signUpBtn').hide()
  $('#mainContent').show()
  $('#welcomeText').show()

  if (email) {
    let username = email.split('@')[0]
    username = username[0].toUpperCase() + username.substring(1)
    $('#user').append(username)
  }

}