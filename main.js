function beforeLogin() {
  $("nav-signup").show();
  $("form-login").show();

  $("#nav-home").hide();
  $("#nav-add").hide();
  $("#nav-logout").hide();
  $("#form-add-todo").hide();
  $("#form-edit-todo").hide();
  $("#form-registration").hide();
  $("#todo-list").hide();
}

function afterLogin() {
  $("#user-name").empty();
  $("#user-name").append(
    " " +
      localStorage.username.charAt(0).toUpperCase() +
      localStorage.username.slice(1).toLowerCase()
  );
  if (localStorage.repoData) {
    let totalIssues = JSON.parse(localStorage.repoData)
      .map((repo) => repo.open_issues)
      .reduce((prev, next) => prev + next);
    $("#count-issues").append(
      `You have ${totalIssues} open issues in your Github projects`
    );
    JSON.parse(localStorage.repoData).forEach((repo) => {
      $("#projects").append(`
      <div
      class="
        w-full
        max-w-md
        mx-0
        bg-white
        shadow-md
        rounded-md
        px-6
        py-4
        my-6
      "
    >
      <div class="sm:flex sm:justify-between">
        <div class="flex items-center">
          <div>
            <h3 class="text-lg text-gray-800 font-medium">
              ${repo.name}
            </h3>
            <span class="text-gray-600">${repo.url}</span>
          </div>
        </div>
        <div class="mt-2 sm:mt-0"></div>
      </div>
      <div class="flex items-center mt-4">
        <div>
          <h4 class="text-gray-600 text-sm">Issue</h4>
          <span class="mt-2 text-xl font-medium text-gray-800">${repo.open_issues}</span>
        </div>
      </div>
    </div>
  `);
    });
  }

  $("#nav-home").show();
  $("#nav-add").show();
  $("#nav-logout").show();
  $("#todo-list").show();

  $("#form-add-todo").hide();
  $("#form-edit-todo").hide();
  $("#nav-signup").hide();
  $("#form-login").hide();
  $("#form-registration").hide();

  getTodos();
}

function submitLogin(event) {
  event.preventDefault();

  let email = $("#loginEmail").val();
  let password = $("#loginPassword").val();
  localStorage.setItem("username", email.split("@")[0]);

  $.ajax({
    url: "http://localhost:3000/user/login",
    method: "POST",
    data: {
      email,
      password,
    },
  })
    .done((data) => {
      $("#errorMessage").text("").hide();
      localStorage.setItem("access_token", data.access_token);
      afterLogin();
    })
    .fail((error) => {
      $("#errorMessage").text(error.responseJSON.error).show();
    })
    .always((_) => {
      $("#loginEmail").val("");
      $("#loginPassword").val("");
    });
}

function getAccessToken() {
  let code = document.location.href.split("code=")[1];
  if (code) {
    $.ajax({
      url: "http://localhost:3000/user/login/github",
      method: "POST",
      data: {
        code: code,
      },
    })
      .done((data) => {
        $("#errorMessage").text("").hide();
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("github_access_token", data.github_access_token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("repoData", data.repoData);
        afterLogin();
      })
      .fail((error) => {
        $("#errorMessage").text(error.responseJSON.error).show();
      });
  }
}

function submitRegister(event) {
  event.preventDefault();

  let email = $("#emailRegister").val();
  let password = $("#passwordRegister").val();

  $.ajax({
    url: "http://localhost:3000/user/register",
    method: "POST",
    data: {
      email,
      password,
    },
  })
    .done(() => {
      beforeLogin();
      window.location.reload();
    })
    .fail((error) => {
      $("#errorMessage").text(error.responseJSON.error).show();
    })
    .always((_) => {
      $("#emailRegister").val("");
      $("#passwordRegister").val("");
    });
}

function getTodos() {
  $.ajax({
    url: "http://localhost:3000/todo",
    method: "GET",
    headers: {
      access_token: localStorage.access_token,
    },
  })
    .done((todos) => {
      $("#incomplete-todo").empty();
      $("#completed-todo").empty();
      todos.forEach((todo) => {
        let date = String(todo.due_date).split("T")[0];
        let time = String(todo.due_date).split("T")[1].slice(0, 5);
        let due_date = date + " " + time;
        if (todo.status !== "done") {
          $("#incomplete-todo").append(`
        <div
        class="
          w-full
          max-w-md
          mx-0
          bg-white
          shadow-md
          rounded-md
          px-6
          py-4
          my-6
        "
      >
        <div class="sm:flex sm:justify-between">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-lg text-gray-800 font-medium">${todo.title}</h3>
                </div>
                <div class="flex">
                  <a href="#" onclick="editTodo(${todo.id})">
                    <img class="ml-7"
                    src="assets/edit.svg"/>
                  </a>
                  <a href="#" onclick="deleteTodo(${todo.id})">
                    <img
                    src="assets/delete.svg"/>
                  </a>
                  <a href="#" onclick="doneTodo(${todo.id})">
                    <img
                    src="assets/done.svg"/>
                  </a>
                </div>
              </div>
              <h4 class="font-medium text-green-800">status: ${todo.status}</h4>
              <span class="text-gray-600">${todo.description}</span>
            </div>
          </div>
          <div class="mt-2 sm:mt-0"></div>
        </div>
        <div class="flex items-center mt-4">
          <div>
            <h4 class="text-gray-600 text-sm">Due Date</h4>
            <div>
              <div>
                <span class="mt-2 text-l font-medium text-gray-800"
                >${due_date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        `);
        } else {
          $("#completed-todo").append(`
        <div
        class="
          w-full
          max-w-md
          mx-0
          bg-white
          shadow-md
          rounded-md
          px-6
          py-4
          my-6
        "
      >
        <div class="sm:flex sm:justify-between">
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-lg text-gray-800 font-medium">${todo.title}</h3>
                </div>
                <div class="flex">
                  <a href="#" onclick="editTodo(${todo.id})">
                    <img class="ml-7"
                    src="assets/edit.svg"/>
                  </a>
                  <a href="#" onclick="deleteTodo(${todo.id})">
                    <img
                    src="assets/delete.svg"/>
                  </a>
                  <a href="#" onclick="doneTodo(${todo.id})">
                    <img
                    src="assets/done.svg"/>
                  </a>
                </div>
              </div>
              <h4 class="font-medium text-green-800">status: ${todo.status}</h4>
              <span class="text-gray-600">${todo.description}</span>
            </div>
          </div>
          <div class="mt-2 sm:mt-0"></div>
        </div>
        <div class="flex items-center mt-4">
          <div>
            <h4 class="text-gray-600 text-sm">Due Date</h4>
            <div>
              <div>
                <span class="mt-2 text-l font-medium text-gray-800"
                >${due_date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        `);
        }
      });
    })
    .fail((error) => {
      console.log(error);
    });
}

function registerFormPage() {
  $("#form-registration").show();

  $("#todo-list").hide();
  $("#nav-login").hide();
  $("#form-edit-todo").hide();
  $("#form-login").hide();
  $("#nav-signup").hide();
  $("#nav-home").hide();
  $("#nav-add").hide();
  $("#nav-logout").hide();
}

function addFormPage() {
  $("#form-add-todo").show();
  $("#nav-home").show();
  $("#nav-add").show();
  $("#nav-logout").show();

  $("#todo-list").hide();
  $("#nav-login").hide();
  $("#form-edit-todo").hide();
  $("#form-login").hide();
  $("#form-registration").hide();
}

function editFormPage() {
  $("#form-edit-todo").show();
  $("#nav-home").show();
  $("#nav-add").show();
  $("#nav-logout").show();

  $("#todo-list").hide();
  $("#nav-login").hide();
  $("#form-add-todo").hide();
  $("#form-login").hide();
  $("#form-registration").hide();
}

function submitTodo(event) {
  event.preventDefault();

  let title = $("#title").val();
  let description = $("#description").val();
  let status = $("#status").val();
  let due_date = $("#due_date").val().replace("T", " ") + ":00";

  $.ajax({
    url: "http://localhost:3000/todo",
    method: "POST",
    headers: {
      access_token: localStorage.access_token,
    },
    data: {
      title,
      description,
      status,
      due_date,
    },
  })
    .done(() => {
      $("#title").val("");
      $("#description").val("");
      $("#status").val("");
      $("#due_date").val("");

      afterLogin();
    })
    .fail((error) => {
      console.log(error);
    });
}

function editTodo(id) {
  editFormPage();
  $.ajax({
    url: `http://localhost:3000/todo/${id}`,
    method: "GET",
    headers: {
      access_token: localStorage.access_token,
    },
  })
    .done((todo) => {
      let date = String(todo.due_date).split("T")[0];
      let time = String(todo.due_date).split("T")[1].slice(0, 5);
      let due_date = date + "T" + time;
      $("#titleEdit").val(todo.title);
      $("#descriptionEdit").val(todo.description);
      $("#statusEdit").val(todo.status);
      $("#due_dateEdit").val(due_date);
    })
    .fail((error) => {
      console.log(error);
    });

  $("#form-edit").submit(function (event) {
    event.preventDefault();
    submitEditTodo(id);
  });
}

function editFormPage() {
  $("#nav-home").show();
  $("#nav-add").show();
  $("#nav-logout").show();
  $("#form-edit-todo").show();

  $("#form-add-todo").hide();
  $("#todo-list").hide();
  $("#nav-login").hide();
  $("#form-login").hide();
}

function submitEditTodo(id) {
  let title = $("#titleEdit").val();
  let description = $("#descriptionEdit").val();
  let status = $("#statusEdit").val();
  let date = $("#due_dateEdit").val().split("T")[0];
  let time = $("#due_dateEdit").val().split("T")[1];
  let due_date = date + " " + time + ":00";

  $.ajax({
    url: `http://localhost:3000/todo/${id}`,
    method: "PUT",
    headers: {
      access_token: localStorage.access_token,
    },
    data: {
      title,
      description,
      status,
      due_date,
    },
  })
    .done(() => {
      afterLogin();
    })
    .fail((error) => {
      console.log(error);
    });
}

function deleteTodo(id) {
  $.ajax({
    url: `http://localhost:3000/todo/${id}`,
    method: "DELETE",
    headers: {
      access_token: localStorage.access_token,
    },
  })
    .done(() => {
      afterLogin();
    })
    .fail((error) => {
      console.log(error);
    });
}

function doneTodo(id) {
  $.ajax({
    url: `http://localhost:3000/todo/${id}`,
    method: "PATCH",
    headers: {
      access_token: localStorage.access_token,
    },
    data: {
      status: "done",
    },
  })
    .done(() => {
      afterLogin();
    })
    .fail((error) => {
      console.log(error);
    });
}

$(document).ready(() => {
  getAccessToken();

  if (localStorage.getItem("access_token")) {
    afterLogin();
  } else {
    beforeLogin();
  }

  $("#nav-logout").click(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem("github_access_token");
    localStorage.removeItem("repoData");
    beforeLogin();
    window.location.href = "http://localhost:5000";
  });

  $("#nav-home").click(afterLogin);
  $("#nav-add").click(addFormPage);
  $("#nav-signup").click(registerFormPage);
  $("#form-add").submit(submitTodo);
  $("#formLogin").submit(submitLogin);
  $("#formRegister").submit(submitRegister);
});
