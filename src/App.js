import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, getUsers, setDay, getDay, setTableId } from './slices/usersSlice';
import { setGames, getGames, setIsUpdating, setUpdatingGame, getUpdatingGame, setGameName, getGameName, getLastGameUpdatedId } from './slices/gamesSlice';

import AddUserModal from "./components/AddUserModal";
import AddGameModal from "./components/AddGameModal";
import AddInitGameModal from './components/AddInitGameModal';
import GameTable from "./components/GameTable";
import { getUsersAndGames, setGameInDb, updateGameInDb, setUsersInDb } from './utils';
import { addGamesRow, addUsersCol } from './utils/addRowCol';

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const users = useSelector(getUsers);
  const games = useSelector(getGames);
  const day = useSelector(getDay);
  const gameName = useSelector(getGameName);
  const updatingGame = useSelector(getUpdatingGame);
  const [isAddUserVisible, setIsAddUserVisible] = useState(false);
  const [isAddGameVisible, setIsAddGameVisible] = useState(false);
  const [isAddInitGameVisible, setIsAddInitGameVisible] = useState(false);

  const fetchUsersAndGames = async () => {
    const result = await getUsersAndGames();
    const { user, games } = result.data.response;
    const formatUsers = (user[0] && user[0].user.map((user) => ({
      title: user.name,
      dataIndex: user.id
    }))) || [];
    const newDay = (user[0] && user[0].day) || '';
    const gName = (user[0] && user[0].gameName) || '';
    const tableId = (user[0] && user[0]._id) || '';
    dispatch(setUsers(formatUsers));
    dispatch(setGames(games));
    dispatch(setDay(newDay));
    dispatch(setGameName(gName));
    dispatch(setTableId(tableId));
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
    setIsAddInitGameVisible(false);
    fetchUsersAndGames();
  };

  const updatingGameInDb = async (game) => {
    dispatch(setIsUpdating(false));
    dispatch(setUpdatingGame({}));
    await updateGameInDb(game);
    await fetchUsersAndGames();
    setIsAddGameVisible(false);
  };

  const closeAddGamePopup = () => {
    setIsAddGameVisible(false);
    dispatch(setIsUpdating(false));
  };

  const closeAddInitGamePopup = () => {
    setIsAddInitGameVisible(false);
  }

  const updateGame = (id) => {
    const updateGameData = games.filter((game) => game.id === id)[0];
    dispatch(setIsUpdating(true));
    dispatch(setUpdatingGame(updateGameData));
    setIsAddGameVisible(true);
  };

  const createNewTable = async () => {
    await setUsersInDb({
      gameName: '',
      user: []
    });
    await fetchUsersAndGames();
    window.location.reload();
  };

  const gamesLength = (games && games.length) || 0;
  const lastGameId = games && games[gamesLength - 1] && games[gamesLength - 1].id;
  const lastUpdatedGameId = useSelector(getLastGameUpdatedId);
  const updatedUsersData = addUsersCol({ users, lastGameId, updateGame });
  const updatedGamesData = addGamesRow({ games, lastUpdatedGameId });


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
      <div className="game-data__action-button">
        {games && gamesLength === 0 && (
          <div>
            <Button type="primary" onClick={() => setIsAddInitGameVisible(true)}>
              Add opening game
            </Button>
          </div>
        )}
        <div>
          <Button type="primary" onClick={() => createNewTable()}>
            Create Game
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
          gName={gameName}
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
      {isAddInitGameVisible && (
        <AddInitGameModal
          isAddInitGameVisible={isAddInitGameVisible}
          closeAddInitGamePopup={closeAddInitGamePopup}
          addGame={addGame}
          users={users}
          day={day}
          updatingGame={updatingGame}
          updatingGameInDb={updatingGameInDb}
        />
      )}
      <GameTable users={updatedUsersData} games={updatedGamesData} lastUpdatedGameId={lastUpdatedGameId} />
    </div>
  );
}

export default App;
