const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.message');
const userperso = document.getElementById('userperso');
const roomName = document.getElementById('room-name');
const conversation = document.getElementById('conversation');
const userList = document.getElementById('users');
const useronline = document.getElementById('username');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
username = urlParams.get('login')
room = urlParams.get('room')

// Get username and room from URL
/*const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});*/

//console.log(username, rom)

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputUserOnline(username);
  outputRoomName(this.room);
  if (this.room != room) {
  } else {
    outputUsers(users);
  }
});

// Message from server
socket.on('message', (message) => {
  console.log('message : ', message);
  outputMessage(message);

  // Scroll down
  conversation.scrollTop = conversation.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  console.log('message send: ', msg)

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {

  receptionMessage = '<div class="row message-body"><div class="col-sm-12 message-main-receiver"><div class="receiver"><span class="message-time pull-right">'
                 + message.username + '</span><div class="message-text">' +
       message.text + '</div><span class="message-time pull-right"> </span></div></div></div>';

  sendMessage = '<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><span class="message-time pull-right">'
       + message.username + '</span><div class="message-text">' +
        message.text + '</div><span class="message-time pull-right"> </span></div></div></div>';   

  /*sendMessage = '<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">' +
       message.text + '</div><span class="message-time pull-right"> Sun</span></div></div></div>';*/

       if (username == message.username) {
          $('#conversation').append(sendMessage);
         
       } else {
          $('#conversation').append(receptionMessage);
       }


  /*const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);*/



}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUserOnline(username) {
  useronline.innerText = username;
}

// Add users to DOM
function outputUsers(users) {
  listusers = []
  users.find((user)=> {
    if (user.username != this.username) {
      listusers.push(user)
    }
  })
  console.log(listusers)
  /*userList.innerHTML = '';
  users.forEach((user) => {
    listsUsersRoomHtml = '<div class="row sideBar-body user"><div class="col-sm-3 col-xs-3 sideBar-avatar"> <div class="avatar-icon"><img src="https://bootdey.com/img/Content/avatar/avatar1.png"></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">' + 
    user.username + ' </span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">18:18</span></div></div></div></div>';
    //const li = document.createElement('li');
    // li.innerText = user.username;
    userList.appendChild(listsUsersRoomHtml);
  });*/
  $('.user').remove();

  listusers.forEach(user => {
    // $( "div" ).remove( ".hello" );

    listsUsersRoomHtml = '<div class="row sideBar-body user"><div class="col-sm-3 col-xs-3 sideBar-avatar"> <div class="avatar-icon"><img src="https://bootdey.com/img/Content/avatar/avatar1.png"></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">' + 
      user.username + ' </span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">'+
      '</span></div></div></div></div>';
      $('#usersRoom').append(listsUsersRoomHtml);
  });
  if (room == "individuel") {
    $('.user').click((i)=> {
      console.log(i.target.innerText)
      if (i.target.innerText) {
        // userperso
        userperso.innerText = i.target.innerText
        socket.emit('individuelRoom', {
          username1: username,
          username2: i.target.innerText ,
          room     : room + '_' + i.target.innerText 
        });

      }
    })
  }


}

socket.on('individuelRoom', (data)=> {
  console.log('individuelRoom', data)
  // const leaveRoom = confirm('VOus voulez accepter l\'invitation ?');

  if (data.reception == username) {
    const leaveRoom = confirm('VOus voulez accepter l\'invitation ?');
    if (leaveRoom) {
      console.log(leaveRoom)
      userperso.innerText = data.demandeur

      socket.emit('acceptioninvi', {
        username,
        room: data.room
      })
    }
  }

})

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('VOus voulez quitter la conversation ?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
