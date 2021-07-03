function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token
  $.ajax({
    url: 'http://localhost:5000/users/googleLogin',
    method: 'POST',
    data: { id_token }
  })
    .done(({ token, email }) => {
      localStorage.setItem('access_token', token)
      localStorage.setItem('email', email)
      homePage(email)
    })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}