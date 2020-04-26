import React from "react";
import { Table, Typography } from 'antd';

const { Text } = Typography;

export default function GameTable({ users, games, lastUpdatedGameId }) {
  return (
    <Table
      columns={users}
      dataSource={games}
      rowClassName={(record) => record._id === lastUpdatedGameId ? 'highlight-row' : ''}
      pagination={false}
      scroll={{ y: 240 }}
      bordered
      summary={(pageData) => {
        const totalArray = [];
        for (let i = 1; i < users.length - 1; i++) {
          let userSum = 0;
          const userId = users[i].dataIndex;
          for (let j = 0; j < pageData.length; j++) {
            userSum += pageData[j][userId] || 0;
          }
          totalArray.push(userSum);
        }
        return (
          <tr>
            <th>Total</th>
            {totalArray.map((value) => {
              if (value >= 0) {
                return (
                  <td>
                    <Text>
                      <span style={{ color: "#52c41a" }}>{value}</span>
                    </Text>
                  </td>
                );
              }
              return (
                <td>
                  <Text type="danger">{value}</Text>
                </td>
              );
            })}
          </tr>
        );
      }}
    />
  );
}
