import './Messages.scss'
import avatar from '../../assets/avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Message from '../message/Message'

const Messages = () => {
  return (
    <div className='messages-wrapper'>
      <div className="messages-header">
        <div className="mh-left">
          <img src={avatar} alt="avatar-user" />
          <h4>Triet Kun</h4>
        </div>
        <div className="mh-right">
          <div className="avatar-wrapper">
            <img src={avatar} alt="avatar-user" />
            <img src={avatar} alt="avatar-user" />
            <img src={avatar} alt="avatar-user" />
            <img src={avatar} alt="avatar-user" />
            <p>+20</p>
          </div>
          <FontAwesomeIcon className='icon-setting' icon={faEllipsisVertical} />
        </div>
      </div>
      <hr />
      <div className="chat-content-wrapper">
        <Message />
      </div>
      <hr />
      <div className="input-message-wrapper">
        <input type="text" />
        <button>Gửi</button>
      </div>
    </div>
  )
}

export default Messages
