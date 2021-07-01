function form_signIn(){
    $('#form-signIn').show()

    $('#formRegister').hide()
    $('#listTodo').hide()
}

function afterSignIn(){
    todos()
    $('#listTodo').show()

    $('#form-signIn').hide()
    $('#formRegister').hide()
}

function submitSignIn(event){
    event.preventDefault()

    let email = $('#email-signIn').val()
    let password = $('#password-signIn').val()
    $.ajax({
        url: 'http://localhost:3000/signin',
        method: 'POST',
        data: {
            email, password
        }
    })

    .done(result=>{
        $('#email-signIn').val('')
        $('#password-signIn').val('')
        localStorage.setItem('access_token', result.access_token)
        afterSignIn()
    })

    .fail(err=>{
        console.log(err);
    })
}

function signOut(event){
    event.preventDefault()

    localStorage.removeItem('access_token')
    form_signIn()
}

function formRegister(){
    $('#formRegister').show()

    $('#form-signIn').hide()
    $('#listTodo').hide()

    //check re-password
    $('#password-register, #re-password-register').on('keyup', function () {
        if ($('#password-register').val() === $('#re-password-register').val()) {
            $('#message').html('Matching').css('color', 'green');
        }else{
            $('#message').html('Not Matching').css('color', 'red');
        }
    });
}

function submitRegister(event){
    event.preventDefault()

    let email = $('#email-register').val()
    let password = $('#password-register').val()
    $.ajax({
        url: 'http://localhost:3000/signup',
        method: 'POST',
        data: {
            email, password
        }
    })
    .done(data=>{
        form_signIn()
    })
    .fail(err=>{
        console.log(err);
    })
}

function todos(){
    $.ajax({
        url: 'http://localhost:3000/todos',
        method: 'GET',
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(result=>{
        result.forEach(todo=>{
            $('#todos-ul').append(
                `<li class="list-group-item"> 
                    <div class="todo-indicator bg-warning">
                    </div>
            
                    <div class="widget-content p-0">
                        <div class="widget-content-wrapper">                                            
                            <div class="widget-content-left">
                                <div class="widget-heading">
                                    ${todo.title}
                                    <div class="badge badge-info ml-2">
                                        ${todo.status}
                                    </div>
                                </div>
    
                                <div class="widget-subheading">
                                    <i>${todo.desc}</i>
                                </div>
                            </div>
    
                            <div class="widget-content-right">
                                <button class="border-0 btn-transition btn btn-outline-success">
                                    <i class="fa fa-check"></i>
                                </button>
    
                                <button class="border-0 btn-transition btn btn-outline-danger">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </li>`)
        })
        
    })
    .fail(err=>{
        console.log(err);
    })
}

$(document).ready(function (){
    if(localStorage.getItem('access_token')){
        afterSignIn()
    }else{
        form_signIn()
    }
    $('#register').click(formRegister)
    $('#signIn').click(form_signIn)
    $('#formSignIn').submit(submitSignIn)
    $('#signOut').click(signOut)
    $('#formSignUp').submit(submitRegister)
})