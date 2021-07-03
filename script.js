const format = 'MMMM Do, YYYY'
const format2 = 'YYYY-MM-DD'
const today = new Date()

function form_signIn(){
    $('#form-signIn').show()

    $('#formRegister').hide()
    $('#listTodo').hide()
    $('#add-form').hide()
    $('#edit-form').hide()
}

function afterSignIn(){
    todos()
    $('#listTodo').show()

    $('#form-signIn').hide()
    $('#formRegister').hide()
    $('#add-form').hide()
    $('#edit-form').hide()
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
    $('#todos-ul').html('')
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
    $('#todos-ul').html('')
    $.ajax({
        url: 'http://localhost:3000/todos',
        method: 'GET',
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(result=>{
        result.forEach(todo=>{
            let due_date = new Date(todo.due_date)
            const difference =Math.floor((due_date.getTime()-today.getTime())/(1000 * 3600 * 24))
            let badgeDueDate
                if(difference<= 1){
                    badgeDueDate = 'badge-danger'
                }else if(difference<= 3){
                    badgeDueDate = 'badge-warning'
                }else{
                    badgeDueDate = 'badge-info'
                }
            let bgStatus
                if(todo.status === 'New'){
                    bgStatus = 'bg-info'
                }else if(todo.status === 'On Progress'){
                    bgStatus = 'bg-warning'
                }else{
                    bgStatus = 'bg-success'
                }
            
            due_date = moment(todo.due_date).format(format)
            $('#todos-ul').append(
                `<li class="list-group-item"> 
                    
                    <div class="todo-indicator ${bgStatus}">
                    </div>
            
                    <div class="widget-content p-0">
                        <div class="widget-content-wrapper">                                            
                            <div class="widget-content-left">
                                <div class="widget-heading">
                                    ${todo.title}   
                                    <div class="badge ${badgeDueDate} ml-2">
                                        <i>Due Date: ${due_date}</i>
                                    </div>
                                </div>
    
                                <div class="widget-subheading">
                                    <i>${todo.desc}</i>
                                </div>
                            </div>
    
                            <div class="widget-content-right">
                                <button class="border-0 btn-transition btn btn-outline-success" onClick="formEditTodo(${todo.id})">
                                    <i class="fa fa-edit"></i>
                                </button>
    
                                <button class="border-0 btn-transition btn btn-outline-danger" onClick="deleteTodo(${todo.id})">
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

function formAddTodo(){
    $('#add-form').show()

    $('#listTodo').hide()
    $('#form-signIn').hide()
    $('#formRegister').hide()
    $('#edit-form').hide()

    $('#formAddTodo').submit(submitAddTodo)
}

function submitAddTodo(event){
    event.preventDefault()
    let title = $('#title-add').val()
    let status = 'New'
    let desc = $('#desc-add').val()
    let due_date = $('#due-date-add').val()

    $.ajax({
        url: 'http://localhost:3000/todos',
        method: 'POST',
        data: {
            title, status, desc, due_date
        },
        headers:{
            access_token: localStorage.access_token
        }
    })
    .done(result=>{
        $('#title-add').val('')
        $('#desc-add').val('')
        $('#due-date-add').val('')

        afterSignIn()
    })
    .fail(err=>{
        console.log(err);
    })

}

function formEditTodo(id){
    //form
    $('#edit-form').show()

    $('#listTodo').hide()
    $('#form-signIn').hide()
    $('#formRegister').hide()
    $('#add-form').hide()

    //getData
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: 'GET',
        headers: {
            access_token: localStorage.access_token
        }
    })

    .done(result=>{
        const todo = result.todo
        const due_date = moment(todo.due_date).format(format2)
        $('#title-edit').val(todo.title)
        $('#desc-edit').val(todo.desc)
        $('#due-date-edit').val(due_date)
        const status = ['New', 'On Progress', 'Done']
        let statusOpt
        statusOpt += `<option value="${todo.status}" selected>${todo.status}</option> `
        status.forEach(el=>{
            if(el !== todo.status)
            statusOpt += `<option value="${el}">${el}</option> `
        })
        $('#status-edit').html('')
        $('#status-edit').append(statusOpt)
        
    })
    .fail(err=>{
        console.log(err);
    })

    $('#formEditTodo').submit(event=>{
        event.preventDefault()
        submitEditTodo(id)
    })
}

function submitEditTodo(id){
    let title = $('#title-edit').val()
    let desc = $('#desc-edit').val()
    let due_date = $('#due-date-edit').val()
    let status = $('#status-edit').val()
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: 'PUT',
        headers: {
            access_token: localStorage.access_token
        },
        data:{
            title, desc, due_date, status
        }
    })
    .done(_ =>{
        afterSignIn()
    })
    .fail(err=>{
        console.log(err);
    })
}

function deleteTodo(id){
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: 'DELETE',
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(_=>{
        console.log('Brhasil Delete');
        afterSignIn()
    })
    .fail(err=>{
        console.log(fail);
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
    $('#add').click(formAddTodo)
})