function beforeLogin(){
    $('#listTodoButton').hide()
    $('#upcamingButton').hide()
    $('#logoutButton').hide()
    $('#signUpForm').hide()
    $('#addTodoForm').hide()
    $('#editTodoForm').hide()
    $('#loginButton').show()
}

function afterLogin(){
    $('#listTodoButton').show()
    $('#upcamingButton').show()
    $('#listTodo').show()
    $('#logoutButton').show()
    $('#signInForm').hide()
    $('#addTodoForm').hide()
    $('#editTodoForm').hide()
    $('#signUpForm').hide()
    $('#loginButton').hide()
    $('#registerButton').hide()
    getAllTodos()
}

function logout(event){
    event.preventDefault()
    localStorage.removeItem('access_token')

    beforeLogin();
}

function getDota2(){
    $.ajax({
        url: 'http://127.0.0.1:3000/games/dota2',
        method:'GET'
    })
    .done(result => {

        let filteredData = result.map(el => {
           return {
               data : el.match.filter(data => data.status === "not_started")
           }
        })

        sortData = filteredData.sort((a,b) => { new Date(a.data.begin_at) - new Date(b.data.begin_at)})

        sortData.forEach(el => {
            if(el.data.length > 0){
                el.data.forEach(match => {                                    
                    $('#upcomingMatches').append(`
                    <div class="col-md-3">
                       <p>${match.league}</p>
                        <img src="${match.img}"/>
                         ${match.match_name}</p>
                        <p id="countdown">${match.begin_at}</p>
                    </div
                    `)
                    
                })
                }  
            }
        )
    })
    .fail(err => {
        console.log(err)
    })
}

function submitLogin(event){
    event.preventDefault()
    
    let email = $('#loginEmail').val()
    let password = $('#loginPassword').val()

    $.ajax({
        url: 'http://localhost:3000/users/login',
        method: 'POST',
        data: {
            email, password
        }
    })
    .done(result => {
        $('#loginEmail').val('')
        $('#loginPassword').val('')
        
        localStorage.setItem('access_token', result.access_token)
        afterLogin()
    })
    .fail(err => {
        console.log(err);
    })
}

function submitRegister(event){
    event.preventDefault()
    let email = $('#registerEmail').val()
    let password = $('#registerPassword').val()

    $.ajax({
        url: 'http://localhost:3000/users/register',
        method: 'POST',
        data: {
            email, password
        }
    })
    .done((_) => {
        $('#loginEmail').val('')
        $('#loginPassword').val('')
    })
    .fail(err => {
        console.log(err);
    })
}

function getAllTodos(){
    $.ajax({
        url:'http://127.0.0.1:3000/todos',
        method:'GET',
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(result =>{
        
        result.forEach(data => {
            let badge
            if(data.status === 'selesai'){
                badge = `<span class="badge badge-success">selesai</span>`
            }else {
                badge = `<span class="badge badge-warning"> belum selesai</span>`
            }
            $('#listTodo').append(`
                <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                    ${data.title}
                        
                    </div>
                    <div class="card-body">${data.description}</div>
                    ${badge}
                    <div class="card-footer">
                        <a href="" class="btn btn-info" style="float:right">Edit</a>
                        <a href="" class="btn btn-danger" style="float:right">Delete</a>
                    </div>
                </div>
                </div>
            `)
        })
    })
    .fail(err=>{
        console.log(err);
    })
}

function addTodo(event){
    event.preventDefault()
    let title = $('#addTitle').val()
    let description = $('#addDescription').val()
    let due_date = $('#addDueDate').val()

    $.ajax({
        url: 'http://localhost:3000/todos/',
        method: 'POST',
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            title, description, due_date
        }
    })
    .done((_) => {
        $('#addTitle').val('')
        $('#addDescription').val('')
        $('#addDueDate').val('')
    })
    .fail(err => {
        console.log(err);
    })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/users/googleLogin',
        data: {
            idToken : id_token
        }
    })
    .done(data => {
        console.log("masuk");
        localStorage.setItem('access_token', data.access_token)
    })
    .fail(err => {
        console.log(err);
    })
  }

$(document).ready(function(){
    console.log(localStorage.getItem('access_token'));
    if(localStorage.getItem('access_token')){
        afterLogin()
    }else{
        beforeLogin();
    }

    $('#listTodoButton').click(getAllTodos)
    $('#upcamingButton').click(getDota2)
    $('#signInForm').submit(submitLogin);
    $('#signUpForm').submit(submitRegister);
    $('#addTodo').submit(addTodo);
    $('#logoutButton').click(logout)
})