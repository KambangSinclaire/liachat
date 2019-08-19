$(document).ready(() => {

    const username = document.querySelector('.username');
    const password = document.querySelector('.password');
    const loginBtn = document.querySelector('.login');
    const register = document.querySelector('.register');
    const alert = document.querySelector('.alert');

    const url = 'http://localhost:9000/liachat.api/user/login';






    register.addEventListener('click', (event) => {
        event.preventDefault();
        window.location = "./src/views/register.html";
    });


    // Post User Details
    loginBtn.addEventListener('click', (event) => {
        event.preventDefault();

        if (username.value == '') {
            username.style.border = '1px solid red';
            return;
        } else {
            if (password.value == '') {
                password.style.border = '1px solid red';
                return;
            } else {
                // Create new user object
                const user = {
                    username: username.value.toLowerCase(),
                    password: password.value.toLowerCase(),
                    isLoggedIn: true
                }

                const userid = JSON.parse(localStorage.getItem("authUser"));
                if (userid === null) {
                    $.post(url, user, (user, statusResponse) => {

                        if (user === null) {
                            alert.innerHTML = "Login Error. Invalid username or password";
                            alert.classList.add('alert-danger');
                            alert.classList.remove('d-none');
                        } else {
                            console.log(user);

                            const usernameLog = JSON.stringify(user.id);
                            localStorage.setItem('authUser', usernameLog);
                            window.location = "./src/views/index.chat.html"
                        }
                    });
                } else {
                    let link = document.createElement('a');
                    link.href = './src/views/index.chat.html';
                    link.classList.add('alert-link');
                    link.innerHTML = `<strong>Go back to Chatroom</strong>`
                    alert.textContent = "Already logged in here ";
                    alert.classList.add('alert-danger');
                    alert.classList.remove('d-none');
                    alert.appendChild(link);
                }

            }
        }

    });

});