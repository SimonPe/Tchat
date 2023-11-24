const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// Get current user
function findByName(username) {
  return users.find(user => user.username === username);
}

// Get current user
function updateRoom(user) {
  // console.log('user', user)
  let index = users.findIndex((x)=> x.username == user.username)
  users[index].id = user.id
  users[index].room = user.room
  return users
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

// Get room users
function getUsers() {
  return users;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getUsers,
  findByName,
  updateRoom
};
