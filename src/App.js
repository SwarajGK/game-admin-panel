import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, getUsers, setDay, getDay } from './slices/usersSlice';
import { setGames, getGames, setIsUpdating, setUpdatingGame, getUpdatingGame } from './slices/gamesSlice';

import AddUserModal from "./components/AddUserModal";
import AddGameModal from "./components/AddGameModal";
import GameTable from "./components/GameTable";
import { getUsersAndGames, setGameInDb, updateGameInDb } from './utils';
import { addGamesRow, addUsersCol } from './utils/addRowCol';

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const users = useSelector(getUsers);
  const games = useSelector(getGames);
  const day = useSelector(getDay);
  const updatingGame = useSelector(getUpdatingGame);
  const [isAddUserVisible, setIsAddUserVisible] = useState(false);
  const [isAddGameVisible, setIsAddGameVisible] = useState(false);

  const fetchUsersAndGames = async () => {
    const result = await getUsersAndGames();
    const { user, games } = result.data.response;
    const formatUsers = (user[0] && user[0].user.map((user) => ({
      title: user.name,
      dataIndex: user.id
    }))) || [];
    const newDay = (user[0] && user[0].day) || '';
    dispatch(setUsers(formatUsers));
    dispatch(setGames(games));
    dispatch(setDay(newDay));
  }

  useEffect(() => {
    fetchUsersAndGames();
  }, []);

  const onAddUsers = async () => {
    setIsAddUserVisible(false);
    await fetchUsersAndGames();
  };

  const closeAddUserPopup = () => {
    setIsAddUserVisible(false);
  };

  const addGame = async (game) => {
    await setGameInDb(game);
    setIsAddGameVisible(false);
    fetchUsersAndGames();
  };

  const updatingGameInDb = async (game) => {
    dispatch(setIsUpdating(false));
    dispatch(setUpdatingGame({}));
    await updateGameInDb(game);
    setIsAddGameVisible(false);
    dispatch(setIsUpdating(false));
  };

  const closeAddGamePopup = () => {
    setIsAddGameVisible(false);
    dispatch(setIsUpdating(false));
  };

  const updateGame = (id) => {
    const updateGameData = games.filter((game) => game.id === id)[0];
    dispatch(setIsUpdating(true));
    dispatch(setUpdatingGame(updateGameData));
    setIsAddGameVisible(true);
  };

  const updatedGamesData = addGamesRow(games);
  const lastGameId = games[games.length - 1] && games[games.length - 1].id;
  const updatedUsersData = addUsersCol(users, lastGameId, updateGame);

  return (
    <div className="game-data">
      <div className="game-data__date">
        Date: {day}
      </div>
      <div className="game-data__action-button">
        <div>
          <Button type="primary" onClick={() => setIsAddUserVisible(true)}>
            Add Player
          </Button>
        </div>
        <div>
          <Button type="primary" onClick={() => setIsAddGameVisible(true)}>
            Add game
          </Button>
        </div>
      </div>
      {isAddUserVisible && (
        <AddUserModal
          isAddUserVisible={isAddUserVisible}
          onAddUsers={onAddUsers}
          closeAddUserPopup={closeAddUserPopup}
          users={users}
          day={day}
        />
      )}
      {isAddGameVisible && (
        <AddGameModal
          isAddGameVisible={isAddGameVisible}
          closeAddGamePopup={closeAddGamePopup}
          addGame={addGame}
          users={users}
          day={day}
          updatingGame={updatingGame}
          updatingGameInDb={updatingGameInDb}
        />
      )}
      <GameTable users={updatedUsersData} games={updatedGamesData} />
    </div>
  );
}

export default App;
