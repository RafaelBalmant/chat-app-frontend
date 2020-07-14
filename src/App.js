import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Input, Button } from 'reactstrap';
import io from 'socket.io-client';
import uuid from 'uuid/dist/v4';
import Swal from 'sweetalert2';

const socket = io('https://chat-app-backend-b4tut4.herokuapp.com/');
const id = uuid();
function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUserName] = useState(['']);
  const [message, updateMessage] = useState('');

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setMessages([
        ...messages,
        newMessage,
      ]);
    };
    socket.on('chat.message', handleNewMessage);
    return () => socket.off('chat.message', handleNewMessage);
  }, [messages]);

  const updateMessageCallback = (event) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit('chat.message', {
        username,
        id,
        message,
      });
      updateMessage('');
    }
  };

  const handlerInputMessage = (event) => updateMessage(event.target.value);

  const insertUserName = useCallback(async () => {
    await Swal.fire({
      title: 'Insira o nome do usuário',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        setUserName(value);
        if (!value) {
          return 'Sinto muito, você precisa de um nome';
        }
      },
    });
  }, []);

  useEffect(() => {
    insertUserName();
  }, [insertUserName]);

  return (
    <>
      {
      username.length > 1 && (
        <div className="container-fluid h-100">
          <div className="row h-100 ">
            <div className="col-12">
              {messages.map((value, i) => (
                <div
                  className={`d-flex m-2 flex-column ${value.id === id ? ' align-items-end' : ''}`}
                  key={username + uuid + Math.random()}
                >
                  <p>
                    {`${value.username} diz:`}
                  </p>
                  <p>
                    {value.message}
                  </p>
                </div>
              ))}
            </div>
            <div className="col-12 d-flex align-items-end">
              <form onSubmit={updateMessageCallback} className="d-flex w-100 justify-content-between m-2">
                <Input type="textarea" value={message} onChange={handlerInputMessage} />
                <Button className="ml-2" type="submit">Enviar</Button>
              </form>
            </div>
          </div>
        </div>
      )
    }
    </>
  );
}

export default App;
