import './Messages.scss'
import avatar from '../../assets/avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

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
    </div>
  )
}

export default Messages
