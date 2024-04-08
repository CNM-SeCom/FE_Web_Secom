import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Messages from '../messages/Messages'
import FindFriend from '../findFriend/findFriend'
import './Chat.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Conversation from '../conversation/Conversation'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import AddFriend from './../addFriend/addFriend';
import axios from 'axios'
import { UserInterface } from '../../interface/Interface'

const Chat = () => {


  const [active, setActive] = useState<number>(0)
  const [openModal, setOpenModal] = useState(false)

  const [openChat, setOpenChat] = useState(true)

  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)

  const navigate = useNavigate()

 

  useEffect(() => {
      if(!isLogin) {
        navigate('/welcome')
      }
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
        <Conversation id={1} setActive={setActive} active={active} />
        <Conversation id={2} setActive={setActive} active={active} />
        <Conversation id={3} setActive={setActive} active={active} />
        <Conversation id={4} setActive={setActive} active={active} />
      </div>
        }
      <Messages />
    </div>
  )
}

export default Chat
