import { ChatInterface } from '../../interface/Interface'
import { setCurrentChatId, setCurrentReceiver } from '../../redux/CurentChatSlice'
import { useAppDispatch, useAppSelector } from '../../redux/Store'
import './Conversation.scss'
import axios from 'axios'
import { setCurrentMessage } from '../../redux/CurentChatSlice'


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

  const friend = {
    idUser: friendId,
    name: name,
    avatar: avatar
  }
  const getMessage = async (chatid) => {
    const data = {
      chatId: chatid
    }
    await axios.post('http://localhost:3000/getMessageByChatId', data)
      .then((res) => {
        dispatch(setCurrentMessage(res.data.data))
      })
      .catch(() => {
        console.log('Error when get message')
      })
  }
  const setCurrentChatID = () => {
        dispatch(setCurrentReceiver(friend))
        dispatch(setCurrentChatId(chats.id))
        getMessage(chats.id)
  }

  return (
    <div className= "conversation-wrapper"
          onClick={() => {
            setActive(friendId)
            setCurrentChatID()
          }}>
      <img src={avatar} alt='avatar-user' />
      <div className="conversation-info">
        <h4 style={{fontSize:17, marginLeft:-10, color:"black"}}>{name}</h4>
        <p style={{color:'black'}}>{chats.lastMessage}</p>
      </div>
      <div className="time-wrapper">
        <p className='time'>12:34</p>
        <p className='num-of-message'>29</p>
      </div>
    </div>
  )
}


export default Conversation
