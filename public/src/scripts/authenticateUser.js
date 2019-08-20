$(document).ready(() => {


    const username = document.querySelector('.username');
    const password = document.querySelector('.password');
    const loginBtn = document.querySelector('.login');
    const register = document.querySelector('.register');
    const alert = document.querySelector('.alert');
    const url = 'https://liachat.herokuapp.com/liachat.api/user/login';
    const setAuthUrl = 'https://liachat.herokuapp.com/liachat.api/user/setAuth';





    // const url = 'http://localhost:9000/liachat.api/user/login';
    // const setAuthUrl = 'http://localhost:9000/liachat.api/user/setAuth';






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

                const userid = JSON.parse(localStorage.getItem("authUser"));
                // Create new user object
                const user = {
                    username: username.value.toLowerCase(),
                    password: password.value.toLowerCase(),
                };

                if (userid === null) {
                    $.post(url, user, (user, statusResponse) => {

                        if (user === null) {
                            alert.innerHTML = "Login Error. Invalid username";
                            alert.classList.add('alert-danger');
                            alert.classList.remove('d-none');
                        } else {
                            if (user.password != password.value) {
                                alert.innerHTML = "Login Error. Invalid password";
                                alert.classList.add('alert-danger');
                                alert.classList.remove('d-none');
                            } else {
                                $.post(setAuthUrl, { userId: user.id, isLoggedIn: true });
                                const uid = JSON.stringify(user.id);
                                localStorage.setItem('authUser', uid);
                                window.location = "./src/views/index.chat.html"
                            }
                        }
                    });
                } else {
                    let link = document.createElement('a');
                    localStorage.setItem('authUser', userid);
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