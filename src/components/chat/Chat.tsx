import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Messages from '../messages/Messages'
import Navigation from '../navigation/Navigation'
import './Chat.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Conversation from '../conversation/Conversation'

const Chat = () => {
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
        <Conversation />
      </div>
      <Messages />
    </div>
  )
}

export default Chat
