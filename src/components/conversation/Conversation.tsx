import { ChatInterface } from '../../interface/Interface'
import { setCurrentChatId, setCurrentReceiver } from '../../redux/CurentChatSlice'
import { useAppDispatch, useAppSelector } from '../../redux/Store'
import './Conversation.scss'

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
  const friend = {
    idUser: friendId,
    name: name,
    avatar: avatar
  }
  console.log("id", chats)

  const setCurrentChatID = () => {
        dispatch(setCurrentReceiver(friend))
        dispatch(setCurrentChatId(chats.id))
  }

  return (
    <div className= "conversation-wrapper"
          onClick={() => {
            setActive(friendId)
            setCurrentChatID()
          }}>
      <img src={avatar} alt='avatar-user' />
      <div className="conversation-info">
        <h4>{name}</h4>
        <p>{chats.lastMessage}</p>
      </div>
      <div className="time-wrapper">
        <p className='time'>12:34</p>
        <p className='num-of-message'>29</p>
      </div>
    </div>
  )
}


export default Conversation
