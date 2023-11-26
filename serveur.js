const express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getUsers,
  findByName,
  updateRoom
} = require('./utils/users');

const port = 3000

app.use(express.static(__dirname + '/public'));

users = []
rooms = [
    {
        value: "Discussion 1",
        name: "Discussion 1"
    },
    {
        value: "Discussion 2",
        name: "Discussion 2"
    },
    {
        value: "Discussion 3",
        name: "Discussion 3"
    },
    {
      value: "creer",
      name: "Crée sa discussion"
    },
]

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        newusers = false
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
    
        socket.emit('message', formatMessage("Serveur", 'Bienvenue dans la conversation!'));

    


        if (room == "individuel" ) {
          io.emit('roomUsers', {
            room: user.room,
            users: getUsers()
          });
        } else {
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
        }

      });

      
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

    socket.on('individuelRoom', (roomind) => {

      const user1 = findByName(roomind.username1)
      user1.room = roomind.room
      user1.id = socket.id
      updateRoom(user1)
      socket.on('joinRoom').join(user1.room);
      io.emit('individuelRoom', {
        demandeur: roomind.username1,
        reception: roomind.username2,
        roomindivi: roomind.room
      })
      console.log(getUsers())
    });

    socket.on('acceptioninvi', (data)=> {
      const user1 = findByName(data.username)
      user1.room = data.room
      user1.id = socket.id
      updateRoom(user1)
      socket.join(user1.room);
    })


  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage("Serveur", `${user.username} vient de se deconnecter`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });

    socket.on('login', user => { 
        user.id = socket.client.id
        users.push(user)
        console.log('users : ',users)

        if (users) {
            socket.emit('login', {
                server: 'Client connecté',
                users,
                user
            })
        }
     });

     socket.emit("sendRooms", rooms);

     socket.on('addroom', addRoom => { 
       console.log("addroom", addRoom)
       rooms.push(addRoom)
       console.log(rooms)
     });
});


server.listen(port, ()=>{
    console.log("Le serveur fonctionne désormais sur le port:", port,)
});