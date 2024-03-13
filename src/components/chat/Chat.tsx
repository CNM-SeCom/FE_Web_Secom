import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Messages from '../messages/Messages'
import Navigation from '../navigation/Navigation'
import './Chat.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Conversation from '../conversation/Conversation'
import { useState } from 'react'

const Chat = () => {

  const [active, setActive] = useState<number>(0)

  return (
    <div className='chat-wrapper'>
      <Navigation />
      <div className="conversations-wrapper">
        <div className="conversations-header">
          <h4>Tin nhắn (3)</h4>
          <button>Tin nhắn mới</button>
        </div>
        <div className="search-wrapper">
          <input type="text" placeholder='Tìm kiếm...' />
          <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
        </div>
        <hr />
        <Conversation id={1} setActive={setActive} active={active} />
        <Conversation id={2} setActive={setActive} active={active} />
        <Conversation id={3} setActive={setActive} active={active} />
        <Conversation id={4} setActive={setActive} active={active} />
      </div>
      <Messages />
    </div>
  )
}

export default Chat
