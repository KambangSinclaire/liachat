$(document).ready(() => {
    const loginBtn = document.querySelector('.login');
    const email = document.querySelector('.email');
    const password = document.querySelector('.password');

    loginBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if (email.value == "kambangsinclaire@gmail.com" && password.value == "12345678") {

            window.location = './src/views/main.html'
        } else {
            alert("User authentication failed");
        }
    })
});