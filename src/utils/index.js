import axios from 'axios';

const server = 'https://172.105.55.82:5000';
// const server = 'http://localhost:5000';

// Done
export const getUsersAndGames = () => {
  return axios.post(`${server}/getTables`);
};

// Done
export const setUsersInDb = (users) => {
  return axios.post(`${server}/createTable`, {
    user: users
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

// Done
export const updateUsers = (users) => {
  return axios.post(`${server}/updateUser`, {
    ...users
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

// Done
export const setGameInDb = (game) => {
  return axios.post(`${server}/createGame`, {
    ...game
  });
};

export const updateGameInDb = (game) => {
  return axios.post(`${server}/updateGame`, {
    ...game
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
};
