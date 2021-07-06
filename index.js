$(document).ready(() => {
    isLoggedIn();
  
    $('#login-form').on('submit', (e) => {
      e.preventDefault();
      login();
      isLoggedIn();
    });
  
    $('#go-to-register').on('click', (e) => {
      e.preventDefault();
      $('#register-form').show();
      $('#login-form').hide();
    });
  
    $('#register-form').on('submit', (e) => {
      e.preventDefault();
      register();
    $('#login-form').show();
    });
  
    $('#go-to-login').on('click', (e) => {
      e.preventDefault();
      $('#register').hide();
      $('#login-form').show();
    });
  
    $('#nav-logout').on('click', (e) => {
      e.preventDefault();
      logout();
      signOut();
    });
  
    $('#nav-add').on('click', (e) => {
        e.preventDefault();
        $('#add-todo').show();
      })


    $('#add-cancel-btn').on('click', (e) => {
        e.preventDefault();
        $('#listTodo').show();
        $('#add-todo').hide();
      })

    $('#add-todo').on('submit', (e) => {
      e.preventDefault();
      addTodo();
      $('#listTodo').show();
      $('#add-todo').hide();
    });
  
    $('#edit-cancel-btn').on('click', (e) => {
      e.preventDefault();
      $('#listTodo').show();
      $('#edit-todo').hide();
    })
  
    $('#edit-todo').on('submit', (e) => {
      e.preventDefault();
      edit();
    })
});

 const isLoggedIn = () => {
     if(localStorage.getItem('access_token')) {
         $('#nav-login').hide();
         $('#register-form').hide();
         $('#nav-bar').show();
         $('#nav-home').show();
         $('#login-form').hide();
         $('#nav-add').show();
         $('#login-form').hide();
         $('#edit-todo').hide();
         $('#add-todo').hide();
         $('#todo-list').show();
         $('#nav-logout').show();
         getTodos();
        }
        else {
            $('#login').show();
            $('#nav-login').hide();
            $('#register-form').hide();
            $('#nav-bar').hide();
            $('#nav-home').hide();
            $('#nav-add').hide();
            $('#add-todo').hide();
            $('#edit-todo').hide();
            $('#todo-list').hide();
            $('#nav-logout').hide();
        };
    };

    const login = () => {
      const email = $('#email-login').val();
      const password = $('#password-login').val();
    
      $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/users/login',
        data: {
          email,
          password
        }
      })
      .done(data => {
        const { access_token } = data;
        localStorage.setItem('access_token', access_token);
        $('#email-login').val('');
        $('#password-login').val('');
      })
      .fail(err => {
        console.log(err)
      })
      .always(() => {
        isLoggedIn();
      });
    };

  function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/users/googleLogin',
      data: {
        idToken: id_token
      }
    })
    .done((data) => {
      const access_token = data;
      localStorage.setItem('access_token', access_token);
    })
    .fail((err) => {
      const { errors } = err.responseJSON;
      console.log(errors);
    })
    .always(() => {
      isLoggedIn();
    });
  }
  
  function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
  
  
  const register = () => {
    const email = $('#email-register').val();
    const password = $('#password-register').val();
  
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/users/register',
      data: {
        email,
        password
      }
    })
    .done(() => {
      $('#email-register').val('');
      $('#password-register').val('');
    })
    .fail(err => {
      console.log(err)
    })
    .always(() => {
      isLoggedIn();
    });
  };
  
  const logout = () => {
    localStorage.removeItem('access_token');
    signOut();
    isLoggedIn();
  };
  
  const addTodo = () => {
    const title = $('#add-title').val();
    const description = $('#add-description').val();
    const due_date = $('#add-due-date').val();
    const status = $('#category').val();
  
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/todos',
      headers: {
        access_token: localStorage.getItem('access_token')
      },
      data: {
        title,
        description,
        due_date,
        status
      }
    })
    .done(() => {
      getTodos();
      $('#title').val('');
      $('#description').val('');
      $('#due-date').val('');
      $('#category').val('');
    })
    .fail(err => {
        console.log(err)
    });
  };
  
