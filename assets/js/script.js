const userForm = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const cityInput = document.getElementById("city");
const userList = document.getElementById("userList");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const searchInput = document.getElementById("search");
const userCount = document.getElementById("userCount");
const emptyMessage = document.getElementById("emptyMessage");

let users = JSON.parse(localStorage.getItem("users")) || [];
let editIndex = -1;

function resetForm() {
    userForm.reset();
    editIndex = -1;
    submitBtn.textContent = "Add user";
    formTitle.textContent = "Add a user";
    cancelBtn.hidden = true;
}

userForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const user = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        city: cityInput.value.trim()
    };

    if (editIndex === -1) {
        users.push(user);
    } else {
        users[editIndex] = user;
    }

    localStorage.setItem("users", JSON.stringify(users));

    resetForm();
    displayUsers();
});

function displayUsers() {
    const search = searchInput.value.trim().toLowerCase();
    let shown = 0;

    userList.innerHTML = "";

    for (let i = 0; i < users.length; i++) {
        const u = users[i];

        if (!(u.name + u.email + u.city).toLowerCase().includes(search)) {
            continue;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <div class="user">
                    <span class="avatar"></span>
                    <div>
                        <div class="user-name"></div>
                        <div class="user-email"></div>
                    </div>
                </div>
            </td>
            <td class="phone"></td>
            <td class="city"></td>
            <td>
                <div class="row-actions">
                    <button class="btn btn-ghost btn-sm edit-btn" data-index="${i}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${i}">Delete</button>
                </div>
            </td>
        `;

        row.querySelector(".avatar").textContent = u.name[0].toUpperCase();
        row.querySelector(".user-name").textContent = u.name;
        row.querySelector(".user-email").textContent = u.email;
        row.querySelector(".phone").textContent = u.phone;
        row.querySelector(".city").textContent = u.city;

        userList.appendChild(row);
        shown++;
    }

    emptyMessage.style.display = shown === 0 ? "block" : "none";
    userCount.textContent = users.length + " total";
}

userList.addEventListener("click", (event) => {
    const index = Number(event.target.dataset.index);

    if (event.target.dataset.index === undefined) {
        return;
    }

    if (event.target.classList.contains("edit-btn")) {
        nameInput.value = users[index].name;
        emailInput.value = users[index].email;
        phoneInput.value = users[index].phone;
        cityInput.value = users[index].city;

        editIndex = index;
        submitBtn.textContent = "Save changes";
        formTitle.textContent = "Edit user";
        cancelBtn.hidden = false;
    }

    if (event.target.classList.contains("delete-btn")) {
        if (confirm("Delete this user?")) {
            users.splice(index, 1);

            if (editIndex === index) {
                resetForm();
            } else if (editIndex > index) {
                editIndex--;
            }

            localStorage.setItem("users", JSON.stringify(users));
            displayUsers();
        }
    }
});

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", displayUsers);

displayUsers();