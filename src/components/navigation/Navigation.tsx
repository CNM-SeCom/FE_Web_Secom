import { faArrowRightFromBracket, faComment, faGear, faHouse, faUser } from '@fortawesome/free-solid-svg-icons'
import './Navigation.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { useState } from 'react'
import { useAppDispatch } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import { changeLoginState } from '../../redux/LoginSlice'

enum NavItem {
  HOME = 0,
  CHAT = 1,
  PROFILE = 2,
  SETTING = 3,
  LOG_OUT = 4,
}

const Navigation = () => {

  const [active, setActive] = useState<NavItem>(NavItem.HOME)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(changeLoginState(false))
    navigate('/welcome')
  }

  return (
    <div className='nav-wrapper'>
      <div className={`${active == NavItem.HOME ? 'nav-item active' : 'nav-item'}`} onClick={() => setActive(NavItem.HOME)}>
        <FontAwesomeIcon className='nav-icon' icon={faHouse} />
        <p>Trang chủ</p>
      </div>
      <div className={`${active == NavItem.CHAT ? 'nav-item active' : 'nav-item'}`} onClick={() => setActive(NavItem.CHAT)}>
        <FontAwesomeIcon className='nav-icon' icon={faComment} />
        <p>Tin nhắn</p>
      </div>
      <div className={`${active == NavItem.PROFILE ? 'nav-item active' : 'nav-item'}`} onClick={() => setActive(NavItem.PROFILE)}>
        <FontAwesomeIcon className='nav-icon' icon={faUser} />
        <p>Trang cá nhân</p>
      </div>
      <div className={`${active == NavItem.SETTING ? 'nav-item active' : 'nav-item'}`} onClick={() => setActive(NavItem.SETTING)}>
        <FontAwesomeIcon className='nav-icon' icon={faGear} />  
        <p>Cài đặt</p>
      </div>    
      <div className='nav-item' onClick={() => handleLogout()}>
        <FontAwesomeIcon className='nav-icon' icon={faArrowRightFromBracket} />
        <p>Đăng xuất</p>
      </div>    
    </div>
  )
}

export default Navigation
