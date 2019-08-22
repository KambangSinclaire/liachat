$(document).ready(() => {

    const url = 'https://liachat.herokuapp.com/liachat.api/user/registerUser';
    const usersUrl = 'https://liachat.herokuapp.com/liachat.api/users';



    //Get DOM Elements
    const login = document.querySelector('.login');
    const username = document.querySelector('.username');
    const email = document.querySelector('.email');
    const password = document.querySelector('.password');
    const cpassword = document.querySelector('.cpassword');
    const phone = document.querySelector('.phone');
    const alertShow = document.querySelector('.alert');
    const usernameError = document.querySelector('.usernameError');
    const emailError = document.querySelector('.emailError');
    const phoneError = document.querySelector('.phoneError');

    // const profilePicture = document.querySelector('.profilePicture');
    const registerBtn = document.querySelector('.register');



    login.addEventListener('click', (event) => {
        event.preventDefault();
        window.location = "../../index.html";
    });



    //Get All registered users
    $.get(usersUrl, (users, error) => {
        if (users != null) {


            $('.username').blur(function () {
                for (let index = 0; index < users.length; index++) {

                    if (users[index].username == username.value) {
                        usernameError.innerHTML = `<em class="text-center text-danger ml-5">Username already exists</em>`;
                        alertShow.innerHTML = "Error creating account. Please choose a different username";
                        alertShow.classList.add('alert-danger');
                        alertShow.classList.remove('d-none');
                        return;
                    }
                }
            });




            $('.email').blur(function () {
                for (let index = 0; index < users.length; index++) {

                    if (users[index].email == email.value) {
                        emailError.innerHTML = `<em class="text-center text-danger ml-5">Email already in use</em>`;
                        alertShow.innerHTML = "Error creating account. Please choose a different Email";
                        alertShow.classList.add('alert-danger');
                        alertShow.classList.remove('d-none');
                        return;
                    }
                }
            });


            $('.phone').blur(function () {
                for (let index = 0; index < users.length; index++) {

                    if (users[index].phone == phone.value) {
                        phoneError.innerHTML = `<em class="text-center text-danger ml-5">Contact already registered</em>`;
                        alertShow.innerHTML = "Error creating account. Please use a different contact number";
                        alertShow.classList.add('alert-danger');
                        alertShow.classList.remove('d-none');
                    }
                }
            });

        } else {
            console.log(users);

        }

        registerBtn.classList.remove('disabled');
        registerBtn.addEventListener('click', (event) => {
            event.preventDefault();


            // Post User Details
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
                                    cpasswordError.innerHTML = `<em class="text-center text-danger ml-5">Passwords don't match</em>`;
                                    return;
                                } else {

                                    if (password.length < 7) {
                                        alert('Password Should be more than 7 characters');
                                        passwordError.innerHTML = `<em class="text-center text-danger ml-5">Password should not be less than 7 characters</em>`;
                                        return;
                                    } else {
                                        //  Create new user object
                                        const NewUser = {
                                            username: username.value.toLowerCase(),
                                            email: email.value.toLowerCase(),
                                            password: password.value.toLowerCase(),
                                            phone: phone.value
                                        }
                                        $.post(url, NewUser, (user, statusResponse) => {
                                            if (user === null) {
                                                alertShow.innerHTML = "Error creating account. Please make sure your credentials are correct";
                                                alertShow.classList.add('alert-danger');
                                                alertShow.classList.remove('d-none');
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



});










