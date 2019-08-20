$(document).ready(function () {

    const alertMessage = document.querySelector('.alert');
    const checkLogInUrl = 'https://liachat.herokuapp.com/liachat.api/user/authenticate';
    const logOutUrl = 'https://liachat.herokuapp.com/liachat.api/user/logOut';
    const usersUrl = 'https://liachat.herokuapp.com/liachat.api/users';
    const sentMessagesUrl = 'https://liachat.herokuapp.com/liachat.api/message/sent/save';
    const receivedMessagesUrl = 'https://liachat.herokuapp.com/liachat.api/message/received/saveMessage';
    const allMessagesUrl = 'https://liachat.herokuapp.com/liachat.api/messages';


    /**
         * Get loggedin user
         */
    const userid = JSON.parse(localStorage.getItem("authUser"));

    let loggedInUser = [];

    if (userid != null) {
        $.post(checkLogInUrl, { userId: userid }, (user, error) => {
            if (user.msg) {
                // alertMessage.textContent = `Welcome Dear ${user.user.username}, enjoy using LIA`;
                // alertMessage.classList.add('alert-primary');
                // alertMessage.classList.remove('d-none');
                loggedInUser.push(user.user);


                /**
                 * Getting DOM elements
                 */
                const send_btn = document.querySelector('.send_btn');
                const textMessage = document.querySelector('.textMessage');
                const msg_card_body = document.querySelector('.msg_card_body');
                const sendArrow = document.querySelector('.sendArrow');
                const logOut = document.querySelector('.logOut');
                const loggedUser = document.querySelector('.loggedUser');
                const allLoggedIn = document.querySelector('.allLoggedIn');
                const contacts_card = document.querySelector('.contacts_card');
                const closeContact_Card = document.querySelector('.closeContact_Card');
                const chatRoom = document.querySelector('.chatRoom');
                const action_menu = document.querySelector('.action_menu');
                const body = document.querySelector('body');
                loggedUser.classList.add('text-capitalize');
                loggedUser.innerHTML = `<strong class="text-warning">${user.user.username}</strong>`;



                //These counters are...
                let counter = 0;
                let counter2 = 0;

                chatRoom.addEventListener('load', () => {
                    $.get(allMessagesUrl, (messages, error) => {

                        if (messages != null) {

                            messages.forEach((message) => {

                                if (message.isSent) {
                                    // Sent messages here
                                    let messageContainer = createSentMessageContainer(counter);
                                    msg_card_body.append(messageContainer);
                                    let sentMessage = document.querySelector('.sentMessage' + counter);
                                    sentMessage.textContent = message.message;
                                    console.log(message);
                                    console.log(message.isSent);
                                    counter++;

                                } else {
                                    // Received messages here
                                    let messageContainer = createReceivedMessageContainer(counter2);
                                    msg_card_body.appendChild(messageContainer);
                                    let receivedMessage = document.querySelector('.receivedMessage' + counter2);
                                    let sender = document.createElement('p');
                                    sender.innerHTML = `<em class="text-secondary text-italic">@${message.author}</em>`
                                    receivedMessage.textContent += `${message.message}`;
                                    receivedMessage.appendChild(sender);
                                    counter2++;
                                }
                            })
                        }


                    });

                });

                allLoggedIn.addEventListener('click', () => {
                    contacts_card.style.display = 'block';
                });
                closeContact_Card.addEventListener('click', () => {
                    contacts_card.style.display = 'none';
                });
                // body.addEventListener('click', () => {
                //     action_menu.style.display = "none";
                // });

                //Socket.io client
                const socket = io()

                $('.openMenuBtn').click(function () {
                    $('.openMenu').toggle();
                });

                $('.toggleUsersBtn').click(function () {
                    $('.toggleUsersMenu').toggle();
                });


                const allUsers = document.querySelector('.contacts');
                $.get(usersUrl, (users, error) => {
                    let countA = 0;
                    let countB = 0;
                    users.forEach((user) => {
                        if (user.isLoggedIn) {
                            const status = 'Available';
                            const listUser = createLoggedInUsers(user.username, status, countA, countB);
                            allUsers.appendChild(listUser);


                            if (user.username == loggedInUser[0].username) {
                                let lastSeenAt = document.querySelector('.lastSeenAt' + countB);
                                let typing = document.querySelector('.typing');
                                socket.on('typing', (data) => {
                                    // const username = document.querySelector('.username' + countA);
                                    // username.innerHTML = loggedInUser[0].username;
                                    lastSeenAt.innerHTML = `<p><em> ${data} is typing </em></p>`;
                                    typing.classList.remove('text-capitalize');
                                    typing.innerHTML = `<p class="text-warning"><em> ${data} is typing </em></p>`;
                                });
                            }
                            countB++;
                        }
                    });
                });




                //Listen for events
                socket.on('message', (data) => {
                    const messageContainer = createReceivedMessageContainer(counter2);
                    msg_card_body.appendChild(messageContainer);
                    const receivedMessage = document.querySelector('.receivedMessage' + counter2);
                    let sender = document.createElement('p');
                    sender.innerHTML = `<em class="text-secondary text-italic">@${data.sender}</em>`
                    receivedMessage.textContent += `${data.message}`;
                    receivedMessage.appendChild(sender);
                    counter2++;
                    let receivedMsg = {
                        message: data.message,
                        author: data.sender,
                        time: new Date(),
                        isSent: false
                    }
                    $.post(receivedMessagesUrl, receivedMsg);
                });




                // User Logout
                logOut.addEventListener('click', (event) => {
                    console.log(loggedInUser[0].id);

                    event.preventDefault();
                    $.post(logOutUrl, { userId: loggedInUser[0].id, isLoggedIn: false }, (user, error) => {
                        if (user != null) {
                            localStorage.clear();
                            window.location = '../../index.html';
                        }
                    })

                });
                // End User Logout




                textMessage.addEventListener("keypress", () => {
                    sendArrow.classList.remove('d-none');
                });



                //Send Message event listener
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
                        const available = document.querySelectorAll('.available');
                        available.innerHTML = 'Available'

                        let sentMsg = {
                            message: message,
                            author: loggedInUser[0].username,
                            time: new Date(),
                            isSent: true
                        }
                        $.post(sentMessagesUrl, sentMsg);
                    }
                });
                //End of Send Message event listener



                //Event listener for typing event
                textMessage.addEventListener('keypress', () => {

                    socket.emit('typing', loggedInUser[0].username);
                });
                //End Event listener for typing event



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



function createLoggedInUsers(nameOfUser, status, countA, countB) {

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
    let lastSeenStatus = document.createElement('p');

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
    usernameSpanTag.classList.add('username' + countA);
    usernameSpanTag.classList.add('text-capitalize');
    lastSeenStatus.classList.add('lastSeenAt' + countB);
    lastSeenStatus.classList.add('available');

    /**
    * Dynamically adding content 
    */
    usernameSpanTag.innerHTML = nameOfUser;
    lastSeenStatus.innerHTML = status;


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