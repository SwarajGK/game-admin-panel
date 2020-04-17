import React, { useState } from 'react';
import uniqid from 'uniqid';
import cloneDeep from 'clone-deep';
import { Modal, Button, Input, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import UserNameField from './UserNameField';
import { setUsersInDb, updateUsers } from '../utils';

export default function AddUserModal({ isAddUserVisible, onAddUsers, closeAddUserPopup, users, day }) {
  const [name, setName] = useState('');
  const [userList, setUserList] = useState(users);

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
    const finalUsers = userList.map((user) => ({
      id: user.dataIndex,
      name: user.title
    }));
    if (day) {
      const finalData = {
        day,
        user: finalUsers
      };
      await updateUsers(finalData);
    } else {
      await setUsersInDb(finalUsers);
    }
    onAddUsers();
  }

  return (
    <div>
      <Modal
        title="Add Users"
        visible={isAddUserVisible}
        onOk={() => addUsersToDb()}
        onCancel={closeAddUserPopup}
      >
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
    </div>
  );
}