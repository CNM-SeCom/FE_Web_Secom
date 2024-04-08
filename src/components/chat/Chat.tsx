import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Messages from '../messages/Messages'
import './Chat.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Conversation from '../conversation/Conversation'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ChatInterface, FriendInterface } from '../../interface/Interface'

const Chat = () => {
  const [active, setActive] = useState<string>('')
  const [listFriends, setListFriends] = useState<FriendInterface[]>([])
  const [chats, setChats] = useState<ChatInterface[]>([])

  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)
  const userId: string = useAppSelector((state) => state.user.userInfo.idUser)

  const navigate = useNavigate()

  // console.log(userId)

  const getConversation = async () => {
    await axios.post('http://localhost:3000/getListFriendByUserId', { idUser: userId })
    .then((res) => {
      // console.log(res.data.data)
      setListFriends(res.data.data)
    })
    .catch(() => {
      console.log('Error when get list friends')
    })

    await axios.post('http://localhost:3000/getChatByUserId', { idUser: userId })
    .then((res) => {
      // console.log(res.data.data)
      setChats(res.data.data)
    })
    .catch(() => {
      console.log('Error when get chat')
    })  
  }

  useEffect(() => {
      if(!isLogin) {
        navigate('/welcome')
      }
      getConversation()
    }, [])
    
  // console.log('cc', currentChatId)
  
  return (
    <div className='chat-wrapper'>
      {/* <Navigation /> */}
      <div className="conversations-wrapper">
        <div className="conversations-header">
          <h4>Tin nhắn (3)</h4>
          {/* <button>Tin nhắn mới</button> */}
        </div>
        <div className="search-wrapper">
          <input type="text" placeholder='Tìm kiếm...' />
          <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
        </div>
        <hr />
        {
          listFriends.map((f) => {
            return (
              <Conversation key={f.idUser} friendId={f.idUser} setActive={setActive} active={active} name={f.name} avatar={f.avatar} chats={chats} />
            )
          })
        }
      </div>
        <Messages />
    </div>
  )
}

export default Chat
