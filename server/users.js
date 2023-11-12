const { trimStr } = require('./utils');

let users = [];

const addUser = (user) => {
  const userName = trimStr(user.name);
  const userRoom = trimStr(user.room);

  // Делаем проверку на наличие пользователя в нашем массиве users
  const isExist = users.find(
    (u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom
  );

  !isExist && users.push(user);

  const currentUser = isExist || user;

  // "!!" возвращает всегда булево значение
  return { isExist: !!isExist, user: currentUser };
};

module.exports = { addUser };
