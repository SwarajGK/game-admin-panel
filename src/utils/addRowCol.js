import React from 'react';
import { Typography, Button } from 'antd';
const { Text } = Typography;

export const addGamesRow = (games) => {
  const finalGames = games.map((game) => game.users);
  return finalGames.map((game, index) => {
    const resultObject = {};
    game.forEach((g) => {
      resultObject[g.id] = g.points;
    });
    return {
      key: games[index].id,
      index: index + 1,
      ...resultObject,
    };
  });
};

export const addUsersCol = (users, lastGameId, updateGame) => {
  return [{ title: "Game no.", dataIndex: "index" }]
    .concat(
      users.map((user) => {
        return {
          ...user,
          width: 100,
          render: (value) => {
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
        render: (text, record) => {
          return lastGameId === record.key ? (
            <Button type="link" onClick={() => updateGame(record.key)}>Update</Button>
            ) : null
        }
      },
    ]);

};