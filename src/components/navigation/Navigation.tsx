import { faComment, faGear, faHouse, faUser } from '@fortawesome/free-solid-svg-icons'
import './Navigation.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 


const Navigation = () => {
  return (
    <div className='nav-wrapper'>
      <div className="nav-item">
        <FontAwesomeIcon className='nav-icon' icon={faHouse} />
        <p>Trang chủ</p>
      </div>
      <div className="nav-item">
        <FontAwesomeIcon className='nav-icon' icon={faComment} />
        <p>Tin nhắn</p>
      </div>
      <div className="nav-item">
        <FontAwesomeIcon className='nav-icon' icon={faUser} />
        <p>Trang cá nhân</p>
      </div>
      <div className="nav-item">
        <FontAwesomeIcon className='nav-icon' icon={faGear} />  
        <p>Cài đặt</p>
      </div>    
    </div>
  )
}

export default Navigation
