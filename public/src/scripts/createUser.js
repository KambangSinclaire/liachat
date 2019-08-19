$(document).ready(() => {

    const login = document.querySelector('.login');
    const username = document.querySelector('.username');
    const email = document.querySelector('.email');
    const password = document.querySelector('.password');
    const cpassword = document.querySelector('.cpassword');
    const phone = document.querySelector('.phone');
    const alert = document.querySelector('.alert');
    // const profilePicture = document.querySelector('.profilePicture');
    const registerBtn = document.querySelector('.register');

    const url = 'https://liachat.herokuapp.com/liachat.api/user/registerUser';

    login.addEventListener('click', (event) => {
        event.preventDefault();
        window.location = "../../index.html";
    });


    // Post User Details
    registerBtn.addEventListener('click', (event) => {
        event.preventDefault();

        if (username.value == '') {
            username.style.border = '1px solid red';
            return;
        } else {
            if (email.value == '') {
                email.style.border = '1px solid red';
                return;
            } else {
                if (phone.value == '') {
                    phone.style.border = '1px solid red';
                    return;
                } else {
                    if (password.value == '') {
                        password.style.border = '1px solid red';
                        return;
                    } else {
                        if (cpassword.value == '') {
                            cpassword.style.border = '1px solid red';
                            return;
                        } else {
                            if (cpassword.value != password.value) {
                                alert('Your Passwords don\'t match')
                                return;
                            } else {

                                if (password.length < 7) {
                                    alert('Password Should be more than 7 characters')
                                    return;
                                } else {
                                    // Create new user object
                                    const NewUser = {
                                        username: username.value.toLowerCase(),
                                        email: email.value.toLowerCase(),
                                        password: password.value.toLowerCase(),
                                        phone: phone.value
                                    }
                                    $.post(url, NewUser, (user, statusResponse) => {
                                        if (user === null) {
                                            alert.innerHTML = "Error creating account. Please make sure your credentials are correct";
                                            alert.classList.add('alert-danger');
                                            alert.classList.remove('d-none');
                                        } else {
                                            window.location = "../../index.html"
                                        }
                                    });


                                }
                            }
                        }
                    }
                }
            }
        }

    });

});
