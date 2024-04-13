import './Messages.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Message from '../message/Message'
import { useAppSelector } from '../../redux/Store'
import { FriendInterface } from '../../interface/Interface'
import { useEffect, useState, useRef } from 'react'
import { useAppDispatch } from '../../redux/Store'
import axios from 'axios'
import { setCurrentMessage, setCurrentTyping } from '../../redux/CurentChatSlice'
import Loading from '../loading/Loading'
import { faPaperclip, faCancel, faVideo, faPhone, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

interface Message {
  user: string;
  message: string;
}

const Messages = () => {
  //const [messages, setMessages] = useState<Message[]>([])
  const [txtMessage, setTxtMessage] = useState<string>('')
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const receiver: FriendInterface = useAppSelector((state) => state.currentChat.receiver)
  const userId = useAppSelector((state) => state.user.userInfo.idUser)
  const currentReceiverId = useAppSelector((state) => state.currentChat.receiver.idUser)
  const currentChatId = useAppSelector((state) => state.currentChat.chatId)
  const currentChatType = useAppSelector((state) => state.currentChat.currentChatType)
  let messagesCurrent = useAppSelector((state) => state.currentChat.messages)
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.userInfo)
  const [loadingSend, setLoadingSend] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [typing, setTyping] = useState(false)
  const currentTyping = useAppSelector((state) => state.currentChat.currentTyping)
  useEffect(() => {
    let socket: WebSocket | undefined;
    if (currentChatType === 'group') {
      socket = new WebSocket(`ws://localhost:3001/?idUser=${currentChatId}`);
      socket.addEventListener('open', function (event) {
        console.log("Connected to server group...");
      });
      socket.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        if (data.type === "RELOAD_MESSAGE") {
          if (data.chatId === currentChatId) {
            getMessage()
          }
        } else
          if (data.type === "text" || data.type === "video" || data.type === "image" || data.type === "file") {
           if(userId !== data.user.idUser){
            toast(data.user.name + ": " + data.text);
            if (receiver.idUser !== '' && receiver.idUser === data.chatId) { 
              const newMessages = [...messagesCurrent, data]
              dispatch(setCurrentMessage(newMessages))
            } 
           }
          }
          else if (data.type === "TYPING") {
            if(userId !== data.user.idUser){
            if (receiver !== null && currentChatId === data.chatId) {
              dispatch(setCurrentTyping(data.typing))
            }
          }
    
          }
    
      });
    }
  }, [currentChatType, currentChatId]);
  useEffect(() => { }, [currentTyping])

  const getMessage = async () => {
    const data = {
      chatId: currentChatId
    }
    await axios.post('http://localhost:3000/getMessageByChatId', data)
      .then((res) => {
        dispatch(setCurrentMessage(res.data.data))
      })
      .catch(() => {
        console.log('Error when get message')
      })
  }
  useEffect(() => {
    getMessage();
  }, []);
  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messagesCurrent, currentTyping]);
  useEffect(() => { }, [typing]);

  const sendMessage = async () => {
    let data = {}
    if (file?.type.includes("image")) {
      const formData = new FormData();
      formData.append('file', file);
      data = {
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: '',
          type: "image",
          chatId: currentChatId,
        }
      }
      const newMessages = [...messagesCurrent, data.message]
      dispatch(setCurrentMessage(newMessages))
      await axios.post('http://localhost:3000/uploadImageMessageWeb', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {

        data = {
          message: {
            receiverId: currentReceiverId,
            user: {
              idUser: user.idUser,
              name: user.name,
              avatar: user.avatar
            },
            text: '',
            type: "image",
            chatId: currentChatId,
            image: res.data.uri
          }
        }
      })
    }
    else if (file?.type.includes("video")) {
      const formData = new FormData();
      formData.append('file', file);
      data = {
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: '',
          type: "video",
          chatId: currentChatId,
        }
      }
      const newMessages = [...messagesCurrent, data.message]
      dispatch(setCurrentMessage(newMessages))
      await axios.post('http://localhost:3000/cloudinary/uploadVideoWeb', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
        console.log(res.data.url)
        data = {
          message: {
            receiverId: currentReceiverId,
            user: {
              idUser: user.idUser,
              name: user.name,
              avatar: user.avatar
            },
            text: '',
            type: "video",
            chatId: currentChatId,
            video: res.data.url.url
          }
        }
      })
    }
    else if (file?.type.includes("document") || file?.type.includes("pdf")) {
      const formData = new FormData();
      formData.append('file', file);
      data = {
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: file.name,
          type: "file",
          chatId: currentChatId,
          file: ''
        }
      }
      const newMessages = [...messagesCurrent, data.message]
      dispatch(setCurrentMessage(newMessages))

      await axios.post('http://localhost:3000/uploadFile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((res) => {
          data = {
            message: {
              receiverId: currentReceiverId,
              user: {
                idUser: user.idUser,
                name: user.name,
                avatar: user.avatar
              },
              text: file.name,
              type: "file",
              chatId: currentChatId,
              file: res.data.uri
            }
          }
        }
        ).catch((err) => {
          const newMessagesWithoutData = messagesCurrent.filter((message) => message !== data.message);
          dispatch(setCurrentMessage(newMessagesWithoutData));
        })
    }
    else {
      data = {
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: txtMessage,
          type: "text",
          chatId: currentChatId

        }
      }
    }
    setLoadingSend(true)
    const newMessages = [...messagesCurrent, data.message]
    dispatch(setCurrentMessage(newMessages))
    setTxtMessage('')
    await axios.post('http://localhost:3000/ws/send-message-to-user', data).then((res) => {
      //xóa đi data.message trong mảng messagesCurrent
      const newMessagesWithoutData = messagesCurrent.filter((message) => message !== data.message);
      dispatch(setCurrentMessage(newMessagesWithoutData));
      const newMessagesHasId = [...messagesCurrent, res.data.data]
      dispatch(setCurrentMessage(newMessagesHasId))
      setLoadingSend(false)
    }).catch(() => {
      console.log('Error when send message')
      setLoadingSend(false)
    })

  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filee = e.target.files?.[0];
    if (filee) {
      setFile(filee);
    }
  };
  const sendTyping = async (b) => {
    const data = {
      chatId: currentChatId,
      typing: b,
      receiverId: currentReceiverId
    }
    await axios.post('http://localhost:3000/ws/sendTypingToUser', data).then(() => {
      console.log('Send typing')
    }).catch(() => {
      console.log('Error when send typing')
    })
  }

  const handleButtonClick = () => {
    if (!file) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
    else {
      setFile(null)
    }
  };
  return (

    <div className='messages-wrapper'>
      <div className="messages-header">
        <div className="mh-left">
          <img src={receiver.avatar} alt="avatar-user" />
          <h4 className='name-user'>{receiver.name}</h4>
        </div>
        <div className="mh-right">
          <button className='btnCall'>
            <FontAwesomeIcon icon={faPhone} />
          </button>
          <button className='btnCall'>
            <FontAwesomeIcon icon={faVideo} />
          </button>
          <button className='btnCall'>
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>
      </div>
      <hr />
      <div className="chat-content-wrapper" ref={messagesContainerRef}>
        {messagesCurrent.map((message, index) => (
          <Message key={index} message={message} chatType={currentChatType} />
        ))}
        {!currentTyping ? null : <p style={{ color: 'gray', marginLeft: 10 }}>Đang soạn tin nhắn...</p>}
      </div>
      <hr />
      <div className="input-message-wrapper">
        {
          file ? (<div className='show-file-name'>
            <p>File đã chọn: {file.name.toString()}</p>

          </div>)
            :
            (<div><input type="text" value={txtMessage} placeholder='Nhập để gửi tin nhắn...' onFocus={() => {
              sendTyping(true)
            }} onBlur={() => {

              sendTyping(false)
            }} onChange={(e) => setTxtMessage(e.target.value)} onKeyDown={handleKeyDown} /></div>)

        }
        <div className='btnChooseFile'>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}

            accept="image/*, video/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleFileChange}
          />
          <button onClick={handleButtonClick}>{!file ? (<FontAwesomeIcon icon={faPaperclip} />) : (<FontAwesomeIcon icon={faCancel} />)}</button>
        </div>
        <div className='btnSendMessage'>
          <button onClick={sendMessage}>Gửi</button>
        </div>

      </div>
    </div>
  )
}

export default Messages
