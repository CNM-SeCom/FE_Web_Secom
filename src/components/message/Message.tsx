import './Message.scss'
import { useAppSelector } from '../../redux/Store'
import { FriendInterface } from '../../interface/Interface'
import excel from '../../assets/logo-excel.png'
import pdf from '../../assets/logo-pdf.png'
import word from '../../assets/logo-word.png'
import ppt from '../../assets/logo-ppt.png'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faTrashAlt, faShare } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal';
import axios from 'axios'
import { setCurrentChatType, setCurrentMessage } from '../../redux/CurentChatSlice'
import { useDispatch } from 'react-redux'
import { ChatInterface } from '../../interface/Interface'



interface Props {
  message: {}
  chatType: string
}

const Message = ({ message, chatType }: Props) => {

  const receiver: FriendInterface = useAppSelector((state) => state.currentChat.receiver)
  const user: FriendInterface = useAppSelector((state) => state.user.userInfo)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const currentChatType = useAppSelector((state) => state.currentChat.currentChatType)
  const listParticipant = useAppSelector((state) => state.currentChat.listParticipant)
  const [loadingDelete, setLoadingDelete] = useState(false);
  const dispatch = useDispatch()
  const currentChatId = useAppSelector((state) => state.currentChat.chatId)
  const checkMyMessage = user.idUser === message?.user?.idUser
  const [isModalShareVisible, setIsModalShareVisible] = useState(false);
  const [chats, setChats] = useState<ChatInterface[]>([])
  const [listChat, setListChat] = useState<ChatInterface[]>([])
  const IP_BACKEND = 'https://se-com-be.onrender.com'

  const getConversation = async () => {
    await axios.post(`${IP_BACKEND}/getChatByUserId`, { idUser: user.idUser})
      .then((res) => {
        //sort theo lastMessageTime
        res.data.data.sort((a: ChatInterface, b: ChatInterface) => {
          if (a.lastMessageTime > b.lastMessageTime) {
            return -1;
          }
          if (a.lastMessageTime < b.lastMessageTime) {
            return 1;
          }
          return 0;
        });

        setChats(res.data.data)
      })
      .catch(() => {
        console.log('Error when get chat')
      })
  }
  useEffect(()=>{getConversation()}, [])
  

  // Hàm mở modal
  const showModal = (b) => {
    setIsModalVisible(b);
  };

  // Hàm đóng modal
  const handleDelete = async () => {
    setLoadingDelete(true);
    let data;
    if (currentChatType === 'single') {
      data = {
        messageId: message._id,
        chatId: message.chatId,
        receiverId: message.receiverId
      }
    }
    else {
      data = {
        messageId: message._id,
        chatId: message.chatId,
        listReceiver: listParticipant
      }
    }
    await axios.post(`${IP_BACKEND}/deleteMessageById`, data).then((res) => {
      getMessage()
      setLoadingDelete(false);
      showModal(false)
    })
    // Xử lý khi click vào tùy chọn Xóa
    setIsModalVisible(false); // Đóng modal sau khi thực hiện xóa
  };
  const getMessage = async () => {
    const data = {
      chatId: currentChatId
    }
    await axios.post(`${IP_BACKEND}/getMessageByChatId`, data)
      .then((res) => {
        dispatch(setCurrentMessage(res.data.data))
      })
      .catch(() => {
        console.log('Error when get message')
      })
  }


  // Hàm xử lý khi click vào tùy chọn Chuyển tiếp tin nhắn
  const handleForward = () => {
    // Xử lý khi click vào tùy chọn Chuyển tiếp tin nhắn
    setIsModalShareVisible(true); // Đóng modal sau khi thực hiện chuyển tiếp
  };


  let info
  let messageClass
  let formattedDate
  if (message.createdAt) {
    const date = new Date(message.createdAt);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  else {
    formattedDate = "Đang gửi..."
  }
  let messageContent: JSX.Element | null = null;
  let fileIcon: JSX.Element | null = null;
  if (user.idUser === message.user.idUser) {
    info = user
    messageClass = 'user-message'
  }
  else {
    info = message.user
    messageClass = 'receiver-message'
  }
  switch (message.type) {
    case 'text':
      messageContent = <div className="message-content">{message.text}</div>;
      break;
    case 'image':
      messageContent = <img src={message.image} alt="message-image" className="message-image" />;
      break;
    case 'video':
      messageContent = <video src={message.video} controls className="message-video" />;
      break;
    case 'file':
      if (message.text.includes('.pdf')) {
        fileIcon = <img src={pdf} className='file-icon' />
      }
      else if (message.text.includes('.docx') || message.text.includes('.doc')) {
        fileIcon = <img src={word} className='file-icon' />
      }
      else if (message.text.includes('.xlsx') || message.text.includes('.xls')) {
        fileIcon = <img src={excel} className='file-icon' />
      }
      else if (message.text.includes('.pptx') || message.text.includes('.ppt')) {
        fileIcon = <img src={ppt} className='file-icon' />
      }
      messageContent = <div className='file-show'>
        {fileIcon}
        <a href={message.file} className='link-file'>{message.text}</a>
      </div>
      break;
      case 'video-call':
        messageContent = <div className="message-notify" style={{ color: 'green' }}>{message.text}</div>;
        break;
    case 'KICKOUT_MEMBER':
      messageContent = <div className="message-notify" style={{ color: 'red' }}>{message.text}</div>;
      break;
    case 'LEAVE_GROUP':
      messageContent = <div className="message-notify" style={{ color: 'red' }}>{message.text}</div>;
      break;
    case 'ADD_MEMBER':
      messageContent = <div className="message-notify" style={{ color: 'green' }}>{message.text}</div>;
      break;
    case 'SET_ADMIN':
      messageContent = <div className="message-notify" style={{ color: 'blue' }}>{message.text}</div>;
      break;
    case 'CHANGE_NAME':
      messageContent = <div className="message-notify" style={{ color: 'blue' }}>{message.text}</div>;
      break;
    case 'CHANGE_AVATAR':
      messageContent = <div className="message-notify" style={{ color: 'blue' }}>{message.text}</div>;
      break;
    default:
      break;
  }
  const searchChat = (value) => {
    if(value === ''){
      setChats(chats)
    }
    else{
      const search = chats.filter((chat) => {
        return chat.name.toLowerCase().includes(value.toLowerCase())
      })
      setChats(search)
    }
  }
  const handleCheckboxChange = ()=>{

  }

  return (
    <div>
      <div className={`message-wrapper ${messageClass}`}>
        <img src={info.avatar} alt="avatar-user" className='user-image' />
        <div className="message-info">
          <div className="mc-header">
            <h4>{info.name}</h4>
            <p>{formattedDate}</p>
            {message.type === 'KICKOUT_MEMBER' || message.type === 'LEAVE_GROUP' || message.type === 'ADD_MEMBER' || message.type === 'SET_ADMIN' ? null :
              <div className='btnOption' onClick={() => {
                showModal(!isModalVisible)
              }}><FontAwesomeIcon icon={faEllipsis} /></div>
            }
          </div>
          {messageContent}
        </div>

      </div>
      <Modal
        isOpen={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        contentLabel="tùy chọn"
        className="modal-option"
        style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
      >
        <div>
          <div className="btn" onClick={handleForward} style={{ cursor: 'pointer' }}><FontAwesomeIcon icon={faShare} /> Chuyển tiếp</div>
          {loadingDelete ? <div className="btn" style={{ cursor: 'not-allowed' }}>Đang xóa...</div> : <div className="btn" onClick={handleDelete} style={{ cursor: checkMyMessage ? 'pointer' : 'not-allowed' }}><FontAwesomeIcon icon={faTrashAlt} /> Xóa</div>}
        </div>
        <button className='btnClose' onClick={() => setIsModalVisible(false)} style={{ backgroundColor: '#1CA1C1', margin: 'auto' }}>Đóng</button>
      </Modal>
      <Modal
        isOpen={isModalShareVisible}
        onRequestClose={() => setIsModalShareVisible(false)}
        contentLabel="Chuyển tiếp tin nhắn"
        className="modal-option"
        style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
      >
        <input type="text" onChange={(e) => { searchChat(e.target.value) }} placeholder="Tìm bạn bè để thêm vào nhóm" style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid black', marginBottom: 10 }} />
       <div style={{ overflowY: 'auto', height: 520 }}>
            {chats.map((chat, index) => (
              <div key={index} style={{ width: '100%', padding: 10, borderRadius: 10, borderBottom: '1px  black', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex' }}>
                  <img src={chat.avatar} alt="avatar-user" style={{ height: 40, width: 40, borderRadius: 50 }} />
                  <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ marginLeft: 10, fontWeight: 'bold' }}>{chat.groupName}</p>
                  </div>
                </div>
                <div>
                  <input type='checkbox' id={chat.id} name={chat.groupName} value={chat.id} className='checkBox' onChange={handleCheckboxChange} />
                </div>
              </div>
            ))
            }
          </div>
       <div style={{display:'flex', justifyContent:'center'}}>
       <button className='btnClose' onClick={() => setIsModalShareVisible(false)} style={{ backgroundColor: '#1CA1C1', margin: 10 }}>Đóng</button>
       <button className='btnClose' onClick={() => setIsModalShareVisible(false)} style={{ backgroundColor: '#1CA1C1', margin: 10 }}>Gửi</button>
       </div>
      </Modal>
    </div>

  )
}

export default Message
