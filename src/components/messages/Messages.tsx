import './Messages.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Message from '../message/Message'
import { useAppSelector } from '../../redux/Store'
import { FriendInterface } from '../../interface/Interface'
import { useEffect, useState, useRef } from 'react'
import { useAppDispatch } from '../../redux/Store'
import axios from 'axios'
import { setCurrentMessage } from '../../redux/CurentChatSlice'
import Loading from '../loading/Loading'
import { faPaperclip, faCancel } from '@fortawesome/free-solid-svg-icons';

interface Message {
  user: string;
  message: string;
}

const Messages = () => {
  //const [messages, setMessages] = useState<Message[]>([])
  const [txtMessage, setTxtMessage] = useState<string>('')
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const receiver: FriendInterface = useAppSelector((state) => state.currentChat.receiver)
  const currentReceiverId = useAppSelector((state) => state.currentChat.receiver.idUser)
  const currentChatId = useAppSelector((state) => state.currentChat.chatId)
  let messagesCurrent = useAppSelector((state) => state.currentChat.messages)
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.userInfo)
  const [loadingSend, setLoadingSend] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);



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
  }, [messagesCurrent]);


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
        console.log(res.data.uri)
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
    else if (file?.type.includes("document")||file?.type.includes("pdf")) {
      alert(file.name)
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
      console.log("AHJASHDUJHSJSHAJSHJKA")  
      console.log(res.data.uri)
        data = {
          message: {
            receiverId: currentReceiverId,
            user: {
              idUser: user.idUser,
              name: user.name,
              avatar: user.avatar
            },
            text:file.name,
            type: "file",
            chatId: currentChatId,
            file: res.data.uri
          }
        }
        console.log("++++++++++++")
        console.log(data.message.file)
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
    console.log("datraaaaaaaa")
    console.log(data.message)
    await axios.post('http://localhost:3000/ws/send-message-to-user', data).then((res) => {
      console.log('Send message success')
      console.log(res.data.data)
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
    const file = e.target.files?.[0];
    if (file) {
      //phân loại tệp ảnh, video, file
      alert(file.type)
      setFile(file);
      // Xử lý tệp ở đây
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
      <div className="chat-content-wrapper" ref={messagesContainerRef}>
        {messagesCurrent.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <hr />
      <div className="input-message-wrapper">
        {
          file ? (<div className='show-file-name'>
            <p>File đã chọn: {file.name.toString()}</p>

          </div>)
            :
            (<div><input type="text" value={txtMessage} onChange={(e) => setTxtMessage(e.target.value)} onKeyDown={handleKeyDown} /></div>)

        }
        <div className='btnChooseFile'>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}

            accept="image/*, video/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf"
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
