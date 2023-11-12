import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

const Chat = () => {
  const { search } = useLocation();
  const [params, setParams] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Преобразуем строку search в объект
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);

    // Передаем на бэк параметры (юзер, комната)
    socket.emit('join', searchParams);
  }, [search]);

  useEffect(() => {
    socket.on('message', ({ data }) => {
      // префикс "_" говорит нам, что эти элементы считаются приватными и должны использоваться только внутри своей области видимости.
      setMessages((_messages) => [..._messages, data]);
    });
  }, []);

  console.log(messages);

  return <h1>Chat</h1>;
};

export default Chat;
