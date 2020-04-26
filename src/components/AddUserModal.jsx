import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import uniqid from 'uniqid';
import cloneDeep from 'clone-deep';
import { Modal, Button, Input, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import UserNameField from './UserNameField';
import { getTableId } from '../slices/usersSlice';
import { setUsersInDb, updateUsers } from '../utils';

export default function AddUserModal({ isAddUserVisible, onAddUsers, closeAddUserPopup, users, day, gName }) {
  const [name, setName] = useState('');
  const [userList, setUserList] = useState(users);
  const [gameName, setGameName] = useState(gName);
  const tableId = useSelector(getTableId);

  const updateUserName = async (id, value) => {
    const clonedUserList = cloneDeep(userList);
    clonedUserList.forEach((user) => {
      if (user.dataIndex === id) {
        user.title = value;
      }
    });
    setUserList(clonedUserList);
  };
  
  const onNameChange = (e) => {
    const name = e.target.value.trim();
    setName(name);
  };
  
  const addNewUser = async () => {
    if (!name) {
      message.error('Please enter valid name');
      return;
    }
    const id = uniqid();
    const clonedUserList = cloneDeep(userList);
    clonedUserList.push({
      title: name,
      dataIndex: id
    });
    setUserList(clonedUserList);
    setName('');
  };

  const addUsersToDb = async () => {
    const finalUsers = {
        gameName,
        user: userList.map((user) => ({
          id: user.dataIndex,
          name: user.title
        }))
    };
    if (day) {
      const finalData = {
        _id: tableId,
        ...finalUsers
      };
      await updateUsers(finalData);
    } else {
      await setUsersInDb(finalUsers);
    }
    onAddUsers();
  }

  const updateGameName = (e) => {
    const name = e.target.value;
    setGameName(name);
  }

  return (
    <Modal
      title="Add Users"
      visible={isAddUserVisible}
      onOk={() => addUsersToDb()}
      onCancel={closeAddUserPopup}
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
      okText="Submit"
    >
      <Input placeholder="Game name" value={gameName} className="game-input-wrapper" onChange={updateGameName} />
      {userList.map((user) => (
        <div className="user-wrapper" key={user.dataIndex}>
          <UserNameField user={user} updateUserName={updateUserName} />
        </div>
      ))}
      <div className="user-wrapper">
        <div className="edit-wrapper">
          <Input value={name} onChange={onNameChange} className="input-wrapper" />
          <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={addNewUser} />
        </div>
      </div>
    </Modal>
  );
}