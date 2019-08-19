$(document).ready(function () {

    /**
     * Getting DOM Elements
     */
    const sentMessageTime = document.querySelector('.sentMessageTime');
    const receivedMessage = document.querySelector('.receivedMessage');
    const receivedMessageTime = document.querySelector('.receivedMessageTime');
    const userStatus = document.querySelector('.userStatus');
    const username = document.querySelector('.username');
    const groupName = document.querySelector('.groupName');
    const messageTime = document.querySelector('.messageTime');
    const profilePicture = document.querySelector('.profilePicture');
    const lastSeenAt = document.querySelector('.lastSeenAt');
    const send_btn = document.querySelector('.send_btn');
    const textMessage = document.querySelector('.textMessage');
    const msg_card_body = document.querySelector('.msg_card_body');
    const sendArrow = document.querySelector('.sendArrow');
    const logOut = document.querySelector('.logOut');

    /**
     * Get loggedin user
     */
    const userid = JSON.parse(localStorage.getItem("authUser"));
    // localStorage.removeItem("loggedUser");
    console.log(userid);

    const url = 'http://localhost:9000/liachat.api/user/authenticate';
    let loggedInUser = [];

    $.post(url, { userId: userid }, (user, error) => {
        if (user != null) {
            loggedInUser.push(user);
        } else {
            alert('query failed');
        }
    });

    /**
     * User Logout
     */
    // logOut.addEventListener('click', (event) => {
    //     event.preventDefault();
    // });

    //These counters are...
    let counter = 0;
    let counter2 = 0;

    //Socket.io client
    const socket = io()


    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });

    /**
    Get user Logged in
     */



    textMessage.addEventListener("keypress", () => {
        sendArrow.classList.remove('d-none');
    });
    send_btn.addEventListener('click', (event) => {
        event.preventDefault();

        let message = textMessage.value;
        if (message == "") {
            alert("message field cannot be empty");
        } else {
            socket.emit('message', { message: message, sender: 'Kambang' });

            const messageContainer = createSentMessageContainer(counter);
            msg_card_body.append(messageContainer);
            const sentMessage = document.querySelector('.sentMessage' + counter);
            sentMessage.textContent = message;
            counter++;
            textMessage.value = "";
        }

    });




    textMessage.addEventListener('keypress', function () {

        socket.emit('typing', loggedInUser[0].username);
    });

    //Listen for events
    socket.on('message', (data) => {
        lastSeenAt.innerHTML = "";
        const messageContainer = createReceivedMessageContainer(counter2);
        msg_card_body.appendChild(messageContainer);
        const receivedMessage = document.querySelector('.receivedMessage' + counter2);
        receivedMessage.innerHTML += `${data.message}`;
        counter2++;
    });

    socket.on('typing', (data) => {
        lastSeenAt.innerHTML = `<p><em> ${data} is typing </em></p>`;
    });


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
    let breakTag = document.createElement('br');
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