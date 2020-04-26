import React from 'react';
import { Typography, Avatar } from 'antd';

const { Text } = Typography;

export const addGamesRow = ({ games = [] }) => {
  const finalGames = games.map((game) => game.users);
  return finalGames.map((game, index) => {
    const resultObject = {};
    game.forEach((g) => {
      resultObject[g.id] = g.points;
    });
    return {
      key: games[index].id,
      _id: games[index]._id,
      index: index + 1,
      ...resultObject,
    };
  });
};

export const addUsersCol = ({ users, lastGameId, updateGame }) => {
  return [{ title: "No.", dataIndex: "index", width: 100 }]
    .concat(
      users.map((user) => {
        return {
          ...user,
          width: 100,
          render: (value, record) => {
            if (value >= 0) {
              return <span style={{ color: "#52c41a" }}>{value || 0}</span>;
            }
            return <Text type="danger">{value || 0}</Text>;
          },
        };
      })
    )
    .concat([
      {
        title: "Update",
        dataIndex: "operation",
        width: 100,
        render: (text, record) => {
          return lastGameId === record.key ? (
            <div onClick={() => updateGame(record.key)}>
              <Avatar style={{ color: '#FFF', backgroundColor: '#87d068' }}>U</Avatar>
            </div>
            ) : null
        }
      },
    ]);

};