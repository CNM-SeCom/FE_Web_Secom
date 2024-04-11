import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Messages from '../messages/Messages'
import FindFriend from '../findFriend/findFriend'
import './Chat.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Conversation from '../conversation/Conversation'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ChatInterface, FriendInterface, MessageInterface, UserInterface } from '../../interface/Interface'
import { useAppDispatch } from '../../redux/Store'
import { setCurrentMessage } from '../../redux/CurentChatSlice'

const Chat = () => {


  const [openModal, setOpenModal] = useState(false)

  const [openChat, setOpenChat] = useState(true)
  
  const [active, setActive] = useState<string>('')
  const [listFriends, setListFriends] = useState<FriendInterface[]>([])
  const [chats, setChats] = useState<ChatInterface[]>([])

  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)
  const userId: string = useAppSelector((state) => state.user.userInfo.idUser)
  const receiver: FriendInterface = useAppSelector((state) => state.currentChat.receiver)
  const currentMessage= useAppSelector((state) => state.currentChat.messages)
  const dispatch = useAppDispatch()
  const socket = new WebSocket(`ws://localhost:3001/?idUser=${userId}`);
  socket.addEventListener('open', function (event) {
    console.log("Connected to server")
    socket.send('Hello Server!');
  });
  //on message event
  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    const data = JSON.parse(event.data)
    if(receiver.idUser === data.user.idUser){
      getConversation()
      const newMessages = [...currentMessage, data]
      dispatch(setCurrentMessage(newMessages))
    }
    else{
      getConversation()
    }
  });

  const navigate = useNavigate()
  let friend={
    idUser: '',
    name: '',
    avatar: ''
   } 

 
  // console.log(userId)

  const getConversation = async () => {
  

    await axios.post('http://localhost:3000/getChatByUserId', { idUser: userId })
    .then((res) => {  
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

  
  return (
    
    <div className='chat-wrapper'>
      
      {openModal && (<div className="conversations-wrapper"><button onClick={() => {setOpenModal(false), setOpenChat(true)}}>Thoát</button><FindFriend/></div>)}
      {/* {openModalAddFriend && (<div className="conversations-wrapper"><button onClick={() => {setOpenModalAddFriend(false), setOpenChat(true)}}>Thoát</button><AddFriend list = {list}/></div>)} */}
      {openChat && 
      <div className="conversations-wrapper">
        <div className="conversations-header">
          <h4>Tin nhắn (3)</h4>

          <button>Tin nhắn mới</button>
          {/* <button onClick={() => {setOpenChat(false)}}>!</button> */}

        </div>
        <div className="search-wrapper">
          <input type="text" placeholder='Tìm kiếm...' onClick={() => {setOpenModal(true), setOpenChat(false)}}/>
          <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
        </div>
        <hr />
        {
          chats.map((c) => {
            {
              c.participants.forEach((p) => {
                if(p.idUser !== userId) {
                    friend.idUser = p.idUser
                    friend.name = p.name
                    friend.avatar = p.avatar
                }
              })
            }
            return (
              // <p>aaaa</p>
              
              <Conversation key={friend.idUser} friendId={friend.idUser} setActive={setActive} active={active} name={friend.name} avatar={friend.avatar} chats={c} />
            )
          })
        }
      </div>
        }
      {receiver.idUser && <Messages />}

    </div>
  )
}
export default Chat
