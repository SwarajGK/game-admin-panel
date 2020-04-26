import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Radio, InputNumber, message } from "antd";
import { getTableId } from '../slices/usersSlice';
import { getIsUpdating, getUpdatingGame, setLastGameUpdatedId } from '../slices/gamesSlice';
import uniqid from 'uniqid';
import { useEffect } from "react";

export default function AddGameModal({
  isAddGameVisible,
  closeAddGamePopup,
  users,
  addGame,
  day,
  updatingGameInDb
}) {
  const dispatch = useDispatch();
  const isUpdating = useSelector(getIsUpdating);
  const updatingGame = useSelector(getUpdatingGame);
  const tableId = useSelector(getTableId);
  let updatingGamePoints = {};

  useEffect(() => {
    const updatingGamePoints = {};
    if (isUpdating) {
      updatingGame.users.forEach((user) => {
        if (user.points > 0) {
          setWinner(user.id);
        } else {
          updatingGamePoints[user.id] = -user.points;
        }
      });
      setUserPoints(updatingGamePoints);
    }
  }, [isUpdating, updatingGame]);

  const [winner, setWinner] = useState('');
  const [userPoints, setUserPoints] = useState(updatingGamePoints);

  const updateUserPoints = useCallback((points, userId) => {
    userPoints[userId] = points;
    setUserPoints(userPoints);
  }, [setUserPoints, userPoints]);

  const updateWinner = useCallback((e, userId) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setWinner(userId);
      userPoints[userId] = 0;
      setUserPoints(userPoints);
    }
  }, [setWinner, userPoints, setUserPoints]);

  const createGame = async () => {
    if (!winner) {
      message.error('Please select the winner');
      return;
    }
    if (isUpdating) {
      const { _id, id, name, day } = updatingGame;
      const totalSum = Object.values(userPoints).reduce((val, acc) => acc + val, 0);
      const finalData = {
        _id,
        id,
        name,
        day,
        users: users.map((user) => {
          if (user.dataIndex === winner) {
            return {
              id: user.dataIndex,
              name: user.title,
              points: Math.abs(totalSum)
            };
          }
          return {
            id: user.dataIndex,
            name: user.title,
            points: -userPoints[user.dataIndex] || 0
          }
        })
      }
      dispatch(setLastGameUpdatedId(_id));
      await updatingGameInDb(finalData);
    } else {
      const id = uniqid();
      const totalSum = Object.values(userPoints).reduce((val, acc) => acc + val, 0);
      const game = {
        id,
        name: `Game-${id}`,
        day,
        tableId,
        users: users.map((user) => {
          if (user.dataIndex === winner) {
            return {
              id: user.dataIndex,
              name: user.title,
              points: Math.abs(totalSum)
            };
          }
          return {
            id: user.dataIndex,
            name: user.title,
            points: -userPoints[user.dataIndex] || 0
          }
        })
      };
      await addGame(game);
    }
    setUserPoints({});
  };

  return (
    <Modal
      title="Add Game"
      visible={isAddGameVisible}
      onOk={() => createGame()}
      onCancel={closeAddGamePopup}
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
      okText="Submit"
    >
      {users.map((user) => {
        const isWinner = user.dataIndex === winner;
        return (
          <div className="game-user__wrapper">
            <div className="game-user__name">{user.title}</div>
            <div className="game-user__status-wrapper">
              <div className="game-user__points">
                <InputNumber
                  onChange={(e) => updateUserPoints(e, user.dataIndex)}
                  defaultValue={userPoints[user.dataIndex]}
                  disabled={isWinner}
                />
              </div>
              <div>
                <Radio checked={isWinner} onChange={(e) => updateWinner(e, user.dataIndex)} />
              </div>
            </div>
          </div>
        );
      })}
    </Modal>
  );
}
