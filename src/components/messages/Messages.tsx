import './Messages.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Message from '../message/Message'
import { useAppSelector } from '../../redux/Store'
import { FriendInterface } from '../../interface/Interface'
import { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import axios from 'axios'

interface Message {
  user: string;
  message: string;
}

const Messages = () => {
  const [socket, setSocket] = useState<Socket>()
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')

  const receiver: FriendInterface = useAppSelector((state) => state.currentChat.receiver)
  const currentReceiverId = useAppSelector((state) => state.currentChat.receiver.idUser)
  const currentChatId = useAppSelector((state) => state.currentChat.chatId)
  const user = useAppSelector((state) => state.user.userInfo)

	useEffect(() => {
		setSocket(io('http://localhost:3003'))
	}, [])

	useEffect(() => {
		socket?.emit('addUser', user.idUser);
		socket?.on('getUsers', users => {
			console.log('activeUsers :>> ', users);
		})
    socket?.on('getMessage', (data) => {
      // Cập nhật state messages bằng cách thêm tin nhắn mới vào cuối mảng
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: data.user, message: data.message },
      ]);
    });
	}, [socket])

	const sendMessage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

		setMessage('')
		socket?.emit('sendMessage', {
			senderId: user.idUser,
			receiverId: currentReceiverId,
			message,
			chatId: currentChatId,
		});

    await axios.post('http://localhost:3000/send-message', {
      senderId: user.idUser,
      receiverId: currentReceiverId,
      chatId: currentChatId,
      message: message,
      name: user.name,
      avatar: user.avatar,
    })
    .then(() => {
      console.log('Send message successfully')
    })
    .catch(() => {
      console.log('Send message fail')
    })
	}

  console.log(messages)

  return (
    <div className='messages-wrapper'>
      <div className="messages-header">
        <div className="mh-left">
          <img src={receiver.avatar} alt="avatar-user" />
          <h4>{receiver.name}</h4>
        </div>
        <div className="mh-right">
          {/* <div className="avatar-wrapper">
            <img src={avatar} alt="avatar-user" />
            <img src={avatar} alt="avatar-user" />
            <img src={avatar} alt="avatar-user" />
            <img src={avatar} alt="avatar-user" />
            <p>+20</p>
          </div> */}
          <FontAwesomeIcon className='icon-setting' icon={faEllipsisVertical} />
        </div>
      </div>
      <hr />
      <div className="chat-content-wrapper">
        <Message />
      </div>
      <hr />
      <div className="input-message-wrapper">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
        <button onClick={(e) => sendMessage(e)}>Gửi</button>
      </div>
    </div>
  )
}

export default Messages
