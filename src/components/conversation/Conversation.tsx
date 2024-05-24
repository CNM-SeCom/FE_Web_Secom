import { ChatInterface } from '../../interface/Interface'
import { setAvatarGroup, setCurrentChatId, setCurrentChatType, setCurrentReceiver, setGroupName, setListParticipant } from '../../redux/CurentChatSlice'
import { useAppDispatch, useAppSelector } from '../../redux/Store'
import './Conversation.scss'
import axios from 'axios'
import { setCurrentMessage } from '../../redux/CurentChatSlice'
//fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons'



interface Props {
  friendId: string,
  setActive: React.Dispatch<React.SetStateAction<string>>,
  active: string,
  name: string,
  avatar: string,
  chats: {},
}

const Conversation = ({ friendId, setActive, active, name, avatar, chats } : Props) => {
  const dispatch = useAppDispatch()
  const userId: string = useAppSelector((state) => state.user.userInfo.idUser)
  const currentChatId: string = useAppSelector((state) => state.currentChat.chatId)
  let formattedDate
  const IP_BACKEND = 'https://se-com-be.onrender.com'
  if(chats.lastMessageTime){
    const date = new Date(chats.lastMessageTime)
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    formattedDate= `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  else{
    formattedDate = ''
  }

  const friend = {
    idUser: friendId,
    name: name,
    avatar: avatar
  }
  const getMessage = async (chatid) => {
    const data = {
      chatId: chatid
    }
    await axios.post(`${IP_BACKEND}/getMessageByChatId`, data)
      .then((res) => {
        dispatch(setCurrentMessage(res.data.data))
      })
      .catch(() => {
        console.log('Error when get message')
      })
  }
  const setCurrentChatID = async () => {
        dispatch(setCurrentMessage([]))   
        dispatch(setCurrentReceiver(friend))
        dispatch(setCurrentChatId(chats.id))
        dispatch(setCurrentChatType(chats.type))
        
        if(chats.type==='group'){
          dispatch(setListParticipant(chats.participants))
          dispatch(setGroupName(chats.groupName))
          dispatch(setAvatarGroup(chats.avatar))
        }
        else{
          dispatch(setListParticipant([]))
        }
        getMessage(chats.id)
        
  }

  return (
    <div className= "conversation-wrapper"
          onClick={() => {
            setCurrentChatID()
          }}>
      <img src={avatar} alt='avatar-user' />
      <div className="conversation-info">
        <h4 style={{fontSize:13, marginLeft:-10, color:"black"}}>{name}</h4>
        <p style={{color:'black', marginLeft: 10}}>{chats.lastMessage}</p>
      </div>
      <div className="time-wrapper">
        {/* <p className='num-of-message'>29</p> */}
        <p style={{color:"black", fontSize:10}}>{formattedDate}</p>
        {chats.type==='group'?<FontAwesomeIcon icon={faPeopleGroup} style={{color:"black", fontSize:10}}/>:null}
      </div>
    </div>
  )
}


export default Conversation
