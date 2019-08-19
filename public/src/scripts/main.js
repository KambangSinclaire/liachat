$(document).ready(function () {

    const alertMessage = document.querySelector('.alert');
    const checkLogInUrl = 'https://liachat.herokuapp.com/liachat.api/user/authenticate';
    const logOutUrl = 'https://liachat.herokuapp.com/liachat.api/user/logOut';
    const usersUrl = 'https://liachat.herokuapp.com/liachat.api/users';


    /**
         * Get loggedin user
         */
    const userid = JSON.parse(localStorage.getItem("authUser"));

    console.log(userid);

    let loggedInUser = [];

    if (userid != null) {
        $.post(checkLogInUrl, { userId: userid }, (user, error) => {
            if (user.msg) {
                // alertMessage.textContent = `Welcome Dear ${user.user.username}, enjoy using LIA`;
                // alertMessage.classList.add('alert-primary');
                // alertMessage.classList.remove('d-none');
                loggedInUser.push(user.user);




                //These counters are...
                let counter = 0;
                let counter2 = 0;



                //Socket.io client
                const socket = io()

                $('#action_menu_btn').click(function () {
                    $('.action_menu').toggle();
                });


                const allUsers = document.querySelector('.contacts');

                $.get(usersUrl, (users, error) => {
                    users.forEach((user) => {
                        if (user.isLoggedIn) {
                            const listUser = createLoggedInUsers(user.username);
                            allUsers.appendChild(listUser);


                            let lastSeenAt = document.querySelector('.lastSeenAt');
                            socket.on('typing', (data) => {
                                const username = document.querySelector('.username');
                                username.innerHTML = loggedInUser[0].username;
                                lastSeenAt.innerHTML = `<p><em> ${data} is typing </em></p>`;
                            });
                            // lastSeenAt.innerHTML = 'Online';
                        }
                    });
                });

                //Listen for events
                // const lastSeenAt2 = document.querySelector('.lastSeenAt');
                socket.on('message', (data) => {

                    const messageContainer = createReceivedMessageContainer(counter2);
                    msg_card_body.appendChild(messageContainer);
                    const receivedMessage = document.querySelector('.receivedMessage' + counter2);
                    let sender = document.createElement('p');
                    sender.innerHTML = `<em class="text-secondary text-italic">@${data.sender}</em>`
                    receivedMessage.textContent += `${data.message}`;
                    receivedMessage.appendChild(sender);
                    counter2++;
                });

                const send_btn = document.querySelector('.send_btn');
                const textMessage = document.querySelector('.textMessage');
                const msg_card_body = document.querySelector('.msg_card_body');
                const sendArrow = document.querySelector('.sendArrow');
                const logOut = document.querySelector('.logOut');










                // User Logout

                logOut.addEventListener('click', (event) => {
                    console.log(loggedInUser[0].id);

                    event.preventDefault();
                    $.post(logOutUrl, { userId: loggedInUser[0].id, isLoggedIn: false }, (user, error) => {
                        if (user != null) {
                            localStorage.removeItem("authUser");
                            window.location = '../../index.html';
                        }
                    })

                });
                // End User Logout




                textMessage.addEventListener("keypress", () => {
                    sendArrow.classList.remove('d-none');
                });
                send_btn.addEventListener('click', (event) => {
                    event.preventDefault();

                    let message = textMessage.value;
                    if (message == "") {
                        alert("message field cannot be empty");
                    } else {
                        socket.emit('message', { message: message, sender: loggedInUser[0].username });

                        const messageContainer = createSentMessageContainer(counter);
                        msg_card_body.append(messageContainer);
                        const sentMessage = document.querySelector('.sentMessage' + counter);
                        sentMessage.textContent = message;
                        counter++;
                        textMessage.value = "";
                    }

                });



                textMessage.addEventListener('keypress', () => {

                    socket.emit('typing', loggedInUser[0].username);
                });



            } else {
                window.location = '../../index.html';
            }
        });

    } else {
        window.location = '../../index.html';
    }

});



function createSentMessageContainer(count) {
    /**
       * Dynamically creating message fields
       */
    let sentMessageParentContainer = document.createElement('div');
    let sentMessageDiv = document.createElement('div');
    let sentMessageContainer = document.createElement('div');
    let imageDiv = document.createElement('div');
    let sentMessageParagraph = document.createElement('span');
    let sentMessageTimeSpan = document.createElement('span');
    let breakTag = document.createElement('br');
    let senderProfilePicture = document.createElement('img');

    /**
     * Dynamically adding styles via classes
     */
    sentMessageParentContainer.classList.add('d-flex');
    sentMessageParentContainer.classList.add('justify-content-end');
    sentMessageParentContainer.classList.add('mb-2');
    sentMessageDiv.classList.add('message_container_send');
    // imageDiv.classList.add('img_cont_msg');
    sentMessageParagraph.classList.add('sentMessage' + count);
    sentMessageTimeSpan.classList.add('sentMessageTime');
    sentMessageTimeSpan.classList.add('msg_time_send');
    // senderProfilePicture.classList.add('rounded-circle');
    // senderProfilePicture.classList.add('user_img_msg');
    // senderProfilePicture.src = "";

    /**
     * Dynamically appending child elements
     */
    sentMessageDiv.appendChild(sentMessageParagraph);
    sentMessageDiv.appendChild(sentMessageTimeSpan);
    imageDiv.appendChild(senderProfilePicture);

    sentMessageContainer.appendChild(imageDiv);
    sentMessageContainer.appendChild(sentMessageDiv);
    sentMessageParentContainer.appendChild(sentMessageContainer);



    return sentMessageParentContainer;

}


function createReceivedMessageContainer(count) {

    /**
       * Dynamically creating message fields
       */
    let receivedMessageParentContainer = document.createElement('div');
    let receivedMessageDiv = document.createElement('div');
    let receivedMessageContainer = document.createElement('div');
    let receivedImageDiv = document.createElement('div');
    let receivedMessageParagraph = document.createElement('span');
    let receivedMessageTimeSpan = document.createElement('span');
    let receivedProfilePicture = document.createElement('img');

    /**
     * Dynamically adding styles via classes
     */

    receivedMessageParentContainer.classList.add('d-flex');
    receivedMessageParentContainer.classList.add('justify-content-start');
    receivedMessageParentContainer.classList.add('mb-2');
    receivedMessageDiv.classList.add('message_container');
    // receivedImageDiv.classList.add('img_cont_msg');
    receivedImageDiv.classList.add('profilePicture');
    receivedMessageParagraph.classList.add('receivedMessage' + count);
    receivedMessageTimeSpan.classList.add('receivedMessageTime');
    receivedMessageTimeSpan.classList.add('msg_time');
    // receivedProfilePicture.classList.add('rounded-circle');
    // receivedProfilePicture.classList.add('user_img_msg');
    // receivedProfilePicture.src = "";

    /**
     * Dynamically appending child elements
     */
    receivedMessageDiv.appendChild(receivedMessageParagraph);
    receivedMessageDiv.appendChild(receivedMessageTimeSpan);
    receivedImageDiv.appendChild(receivedProfilePicture);

    receivedMessageContainer.appendChild(receivedImageDiv);
    receivedMessageContainer.appendChild(receivedMessageDiv);
    receivedMessageParentContainer.appendChild(receivedMessageContainer);

    return receivedMessageParentContainer;

}



function createLoggedInUsers(nameOfUser) {

    /**
    * Dynamically creating message fields
    */
    let ParentContainer = document.createElement('li');
    let subContainer_alignment = document.createElement('div');
    let userProfilePicture = document.createElement('i');
    let userProfilePictureContainerContainer = document.createElement('div');
    // let userOnlineIcon = document.createElement('span');
    let userInfo = document.createElement('div');
    let usernameSpanTag = document.createElement('span');
    let lastSeenStatus = document.createElement('span');

    /**
     * Dynamically adding styles via classes
     */

    subContainer_alignment.classList.add('d-flex');
    subContainer_alignment.classList.add('bd-highlight');

    userProfilePictureContainerContainer.classList.add('img_cont');

    userProfilePicture.classList.add('fas');
    userProfilePicture.classList.add('fa-user-circle');
    userProfilePicture.classList.add('fa-3x');
    userProfilePicture.classList.add('userIcon');


    userInfo.classList.add('user_info');
    usernameSpanTag.classList.add('username');
    usernameSpanTag.classList.add('text-capitalize');
    lastSeenStatus.classList.add('lastSeenAt');

    /**
    * Dynamically adding content 
    */
    usernameSpanTag.innerHTML = nameOfUser;


    /**
     * Dynamically appending child elements
     */
    userInfo.appendChild(usernameSpanTag);
    userInfo.appendChild(lastSeenStatus);

    userProfilePictureContainerContainer.appendChild(userProfilePicture);
    // userProfilePictureContainerContainer.appendChild(userOnlineIcon);


    subContainer_alignment.appendChild(userProfilePictureContainerContainer);
    subContainer_alignment.appendChild(userInfo);

    ParentContainer.appendChild(subContainer_alignment);

    return ParentContainer;


}