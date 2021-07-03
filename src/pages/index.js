const signupPage = () => {
  $('#logoutBtn').hide()
  $('#mainContent').hide()
  $('#welcomeText').hide()
  $('#loginPage').hide()
  $('#loginBtn').show()
  $('#signUpPage').show()
}

const loginPage = () => {
  $('#logoutBtn').hide()
  $('#mainContent').hide()
  $('#welcomeText').hide()
  $('#signUpPage').hide()
  $('#loginBtn').show()
  $('#loginPage').show()
  $('#signUpBtn').show()
}

const homePage = (email) => {
  $('#logoutBtn').show()
  $('#loginBtn').hide()
  $('#signUpBtn').hide()
  $('#signUpPage').hide()
  $('#loginPage').hide()
  $('#mainContent').show()
  $('#welcomeText').show()

  $('#user').empty()
  $('#avatar').empty()

  // Display name on navbar
  let username = email.split('@')[0]
  username = username[0].toUpperCase() + username.substring(1)
  $('#user').append(username)

  // Get avatar based on id
  $.ajax({
    url: `http://localhost:5000/avatars/${email}`,
    method: 'GET',
  })
    .done(avatar => {
      $('#avatar').append(avatar)
    })

  // Display todos
  $.ajax({
    url: 'http://localhost:5000/todos',
    method: 'GET',
    headers: { token: localStorage.getItem('access_token') },
  }).done((todos) => {
    $('#todos').empty()
    $('#avatar').empty()

    let todoIds = []
    todos.forEach((todo) => {
      todoIds.push(todo.id)
      $('#todos').append(`
        <div id="todo-${todo.id}" class="my-5 bg-gray-800 rounded-2xl flex flex-col">
          <div class="my-5 bg-gray-800 rounded-2xl px-4  flex flex-row justify-between">
            <!-- Title -->
            <div class="flex flex-row items-center">
              <svg id="checked-${todo.id}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 border-2 border-red-400 rounded-full text-red-400 ${todo.status === 'done' ? '' : 'text-transparent'}  hover:cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span id="title-${todo.id}" class="ml-2 ${todo.status === 'done' ? 'line-through text-gray-500' : ''}">${todo.title}</span>
            </div>
    
            <div class="flex gap-2">
              <!-- Edit Button -->
              <a id="editBtn-${todo.id}" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </a>
              <!-- Delete Button -->
              <a id="deleteBtn-${todo.id}" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Description -->
          <div class="px-11 flex flex-row gap-2">
            <svg id="descSvg-${todo.id}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ${todo.status === 'done' ? 'text-gray-500' : ''}" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <p id="desc-${todo.id}" class="pb-4 ${todo.status === 'done' ? 'line-through text-gray-500' : ''}">${todo.description}</p>
          </div>

          <!-- Due Date -->
          <div class="px-11 flex flex-row gap-2">
          <svg id="dueDateSvg-${todo.id}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-300/70 ${todo.status === 'done' ? 'text-gray-500' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
            <p id="dueDate-${todo.id}" class="pb-4 text-indigo-300/70 text-sm ${todo.status === 'done' ? 'line-through text-gray-500' : ''}">${new Date(todo.due_date).toLocaleDateString()}</p>
          </div>
        </div>

        <!-- Edit Form -->
        <div id="editForm-${todo.id}" class="hidden">
          <form class="my-10 border-2 border-gray-800 rounded-2xl flex flex-col">
            <div class="p-2 flex flex-row">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400 hover:cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
              </svg>
              <input id="inputEditTitle-${todo.id}" type="text" class="bg-gray-900 w-full ml-2 focus:caret-gray-100" value="${todo.title}">
            </div>
    
            <div class="p-2 flex flex-row">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
              <input id="inputEditDesc-${todo.id}" type="text" class="bg-gray-900 w-full ml-2 focus:caret-gray-100" value="${todo.description}">
            </div>
    
            <div class="p-2 flex flex-row">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input id="inputEditDate-${todo.id}" type="text" onfocus="(this.type='date')" class="bg-gray-900 ml-2 focus:caret-gray-100 w-full" value="${new Date(todo.due_date).toLocaleDateString()}">
            </div>

            <div class="p-2 flex flex-row gap-4">
              <div class="flex flex-row items-center">
                <input class="h-4 w-4" type="radio" id="radioDone-${todo.id}" name="radioStatus-${todo.id}" value="done">
                <label for="radioDone">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </label>
              </div>
              <div class="flex flex-row items-center">
                <input class="h-4 w-4" type="radio" id="radioNotDone-${todo.id}" name="radioStatus-${todo.id}" value="not done" checked>
                <label for="radioNotDone">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </label>
              </div>
            </div>
    
            <button id="submitEditBtn-${todo.id}" class="bg-green-500 active:bg-green-600 rounded-md py-2 mt-3 font-bold text-md text-gray-50">Edit</button>
          </form>
        </div>
      `)
    })

    todoIds.forEach(id => {
      $(`#checked-${id}`).click(() => {
        $(`#checked-${id}`).toggleClass('text-transparent')
        $(`#title-${id}`).toggleClass('line-through text-gray-500')
        $(`#descSvg-${id}`).toggleClass('text-gray-500')
        $(`#desc-${id}`).toggleClass('line-through text-gray-500')
        $(`#dueDateSvg-${id}`).toggleClass('text-indigo-300/70 text-gray-500')
        $(`#dueDate-${id}`).toggleClass('line-through text-indigo-300/70 text-gray-500')

        if ($(`#checked-${id}`).hasClass('text-transparent')) {
          $.ajax({
            url: `http://localhost:5000/todos/${id}`,
            method: 'PATCH',
            headers: { token: localStorage.getItem('access_token') },
            data: { status: 'not done' }
          })
        } else {
          $.ajax({
            url: `http://localhost:5000/todos/${id}`,
            method: 'PATCH',
            headers: { token: localStorage.getItem('access_token') },
            data: { status: 'done' }
          })
        }
      })

      $(`#deleteBtn-${id}`).click(() => {
        $.ajax({
          url: `http://localhost:5000/todos/${id}`,
          method: 'DELETE',
          headers: { token: localStorage.getItem('access_token') },
        })
          .done(msg => {
            $(`#todo-${id}`).remove()
          })
          .fail(({ responseJSON }) => {
            console.log(responseJSON)
          })
      })

      $(`#editBtn-${id}`).click((e) => {
        e.preventDefault()
        $(`#editForm-${id}`).slideToggle('fast')
      })

      $(`#editForm-${id}`).submit(e => {
        e.preventDefault()

        let title = $(`#inputEditTitle-${id}`).val()
        let description = $(`#inputEditDesc-${id}`).val()
        let due_date = $(`#inputEditDate-${id}`).val()
        let status = $(`input[name="radioStatus-${id}"]:checked`).val()

        $.ajax({
          url: `http://localhost:5000/todos/${id}`,
          method: 'PUT',
          headers: { token: localStorage.getItem('access_token') },
          data: { 
            title, 
            description, 
            due_date,
            status
          }
        })
          .done(todo => {
            $(`inputEditTitle-${id}`).val(todo.title)
            $(`inputEditDesc-${id}`).val(todo.description)
            $(`inputEditDate-${id}`).val(todo.due_date)
              
            $(`#editForm-${id}`).slideToggle('fast')
          })
          .fail(({ responseJSON }) => {
            console.log(responseJSON)
          })

        $(`#title-${id}`).html(title)
        $(`#desc-${id}`).html(description)
        $(`#dueDate-${id}`).html(new Date(due_date).toLocaleDateString())
        if (status === 'done') {
          $(`#checked-${id}`).removeClass('text-transparent')
          $(`#title-${id}`).addClass('line-through text-gray-500')
          $(`#descSvg-${id}`).addClass('text-gray-500')
          $(`#desc-${id}`).addClass('line-through text-gray-500')
          $(`#dueDateSvg-${id}`).addClass('text-gray-500')
          $(`#dueDate-${id}`).addClass('line-through text-gray-500')
        } else {
          $(`#checked-${id}`).addClass('text-transparent')
          $(`#title-${id}`).removeClass('line-through text-gray-500')
          $(`#descSvg-${id}`).removeClass('text-gray-500')
          $(`#desc-${id}`).removeClass('line-through text-gray-500')
          $(`#dueDateSvg-${id}`).removeClass('text-gray-500')
          $(`#dueDate-${id}`).removeClass('line-through text-gray-500')
        }
      })
    })
  })
  .fail(({ responseJSON }) => {
    console.log(responseJSON)
  })
}
