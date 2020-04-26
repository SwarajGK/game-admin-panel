import React, { useState, useCallback } from "react";
import { useSelector } from 'react-redux';
import { Modal, InputNumber, message } from "antd";
import { getTableId } from '../slices/usersSlice';
import uniqid from 'uniqid';

export default function AddInitGameModal({
  isAddInitGameVisible,
  closeAddInitGamePopup,
  users,
  addGame,
  day
}) {
  const tableId = useSelector(getTableId);
  let updatingGamePoints = {};

  const [userPoints, setUserPoints] = useState(updatingGamePoints);

  const updateUserPoints = useCallback((points, userId) => {
    userPoints[userId] = points;
    setUserPoints(userPoints);
  }, [setUserPoints, userPoints]);

  const createGame = async () => {
    const totalSum = Object.values(userPoints).reduce((val, acc) => acc + val, 0);
    if (totalSum !== 0) {
      message.error('Sum should be 0');
      return;
    }
    const id = uniqid();
    const game = {
      id,
      name: `Game-${id}`,
      day,
      tableId,
      users: users.map((user) => ({
        id: user.dataIndex,
        name: user.title,
        points: userPoints[user.dataIndex] || 0
      }))
    };
    await addGame(game);
    setUserPoints({});
  };

  return (
    <Modal
      title="Add Init Game"
      visible={isAddInitGameVisible}
      onOk={() => createGame()}
      onCancel={closeAddInitGamePopup}
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
    >
      {users.map((user) => {
        return (
          <div className="game-user__wrapper">
            <p className="game-user__name">{user.title}</p>
            <div className="game-user__status-wrapper">
              <div className="game-user__points">
                <InputNumber
                  onChange={(e) => updateUserPoints(e, user.dataIndex)}
                  defaultValue={userPoints[user.dataIndex]}
                />
              </div>
            </div>
          </div>
        );
      })}
    </Modal>
  );
}
