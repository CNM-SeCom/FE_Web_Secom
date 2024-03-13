import { faComment, faGear, faHouse, faUser } from '@fortawesome/free-solid-svg-icons'
import './Navigation.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { useState } from 'react'


const Navigation = () => {

  const [active, setActive] = useState<number>(0)

  return (
    <div className='nav-wrapper'>
      <div className={`${active == 0 ? 'nav-item active' : 'nav-item'}`} onClick={() => setActive(0)}>
        <FontAwesomeIcon className='nav-icon' icon={faHouse} />
        <p>Trang chủ</p>
      </div>
      <div className={`${active == 1 ? 'nav-item active' : 'nav-item'}`} onClick={() => setActive(1)}>
        <FontAwesomeIcon className='nav-icon' icon={faComment} />
        <p>Tin nhắn</p>
      </div>
      <div className={`${active == 2 ? 'nav-item active' : 'nav-item'}`} onClick={() => setActive(2)}>
        <FontAwesomeIcon className='nav-icon' icon={faUser} />
        <p>Trang cá nhân</p>
      </div>
      <div className={`${active == 3 ? 'nav-item active' : 'nav-item'}`} onClick={() => setActive(3)}>
        <FontAwesomeIcon className='nav-icon' icon={faGear} />  
        <p>Cài đặt</p>
      </div>    
    </div>
  )
}

export default Navigation
