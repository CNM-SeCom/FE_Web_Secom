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

import Modal from 'react-modal'


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
  const messagesCurrent = useAppSelector((state) => state.currentChat.messages)
  const listParticipant = useAppSelector((state) => state.currentChat.listParticipant)
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.userInfo)
  const [loadingSend, setLoadingSend] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [typing, setTyping] = useState(false)
  const currentTyping = useAppSelector((state) => state.currentChat.currentTyping)
  useEffect(() => { }, [currentTyping])
  const [isModalVisible, setIsModalVisible] = useState(false)


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
    // Scroll to the bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messagesCurrent, currentTyping]);
  useEffect(() => { }, [typing]);
  useEffect(() => {},[messagesCurrent])

  const sendMessage = async () => {
    let data = {}
    if (file?.type.includes("image")) {
      const formData = new FormData();
      formData.append('file', file);
      data = {
        listReceiver: listParticipant,
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
          listReceiver: listParticipant,
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
        listReceiver: listParticipant,
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
          listReceiver: listParticipant,
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
        listReceiver: listParticipant,
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
            listReceiver: listParticipant,
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
        listReceiver: listParticipant,
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
    setFile(null)
    setTxtMessage('')
    if(currentChatType==='single'){
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
    else{
      await axios.post(`http://localhost:3000/ws/send-message-to-group/${currentChatId}`, data).then((res) => {
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
    
  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(txtMessage){
        sendMessage();
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filee = e.target.files?.[0];
    if (filee) {
      setFile(filee);
    }
  };
  const sendTyping = async (b) => {
    if(currentChatType==='single'){
      const data = {
        chatId: currentChatId,
        typing: b,
        receiverId: currentReceiverId,
        userId: userId
      }
      await axios.post('http://localhost:3000/ws/sendTypingToUser', data).then(() => {
        console.log('Send typing')
      }).catch(() => {
        console.log('Error when send typing')
      })
    }
    else{
      const data = {
        chatId: currentChatId,
        typing: b,
        listReceiver: listParticipant,
        userId: userId
      }
      await axios.post('http://localhost:3000/ws/sendTypingToGroup', data).then(() => {
        console.log('Send typing')
      }).catch(() => {
        console.log('Error when send typing')
      })
    }
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
          <button className='btnCall' onClick={()=>{
            setIsModalVisible(true)
          }}>
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
          <button onClick={()=>{
            if(txtMessage ||file){
              sendMessage()
            }
            
          }}>Gửi</button>
        </div>

      </div>
      <Modal
        isOpen={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        contentLabel="tùy chọn"
        className="modal-group-option"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            width: 550,
            height: '90%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: 'white',
            color: 'black',
            borderRadius: '10px',
            padding: '10px',
            border: 'none',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
          }
        
        }}
      >
          <div className='avtGroup'>
            {currentChatType==='group'?
            <img src={receiver.avatar}  alt="avatar-user" style={{height:80, width:80, padding: 10}}/>
            :null}
          </div>
          <div className='nameGroup'>
            {currentChatType==='group'?
            <p style={{height:80, width:80, padding: 10}}>{receiver.name}</p>
            :null}
          </div>
   
        <button className='btnClose' onClick={() => setIsModalVisible(false)} 
          style={{
            fontSize: 20,
            color: 'white',
            backgroundColor: '#1CA1C1',
          }}
        >Đóng</button>
      </Modal>
    </div>
  )
}

export default Messages
