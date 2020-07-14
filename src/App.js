import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import { Input, Button, FormText } from 'reactstrap';
import io from 'socket.io-client';
import uuid from 'uuid/dist/v4';

const socket = io('https://chat-app-backend-b4tut4.herokuapp.com/');
const id = uuid();
function App() {
  const [messages, setMessages] = useState([]);

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
        id,
        message,
      });
      updateMessage('');
    }
  };
  console.log(message);
  const handlerInputMessage = (event) => updateMessage(event.target.value);

  return (
    <div className="container-fluid h-100">
      <div className="row h-100 ">
        <div className="col-12">
          {messages.map((value, i) => (
            <div className={`d-flex m-2 flex-column ${value.id === id ? ' align-items-end' : ''}`}>
              <p>
                {`${value.id} diz:`}
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
  );
}

export default App;
