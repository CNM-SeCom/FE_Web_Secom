import { faArrowRightFromBracket, faComment, faUser } from '@fortawesome/free-solid-svg-icons'
import './Navigation.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import { changeLoginState } from '../../redux/LoginSlice'
import axios from 'axios'
import { setCurrentChatId, setCurrentMessage, setCurrentReceiver } from '../../redux/CurentChatSlice'

enum NavItem {
  HOME = 0,
  CHAT = 1,
  PROFILE = 2,
  SETTING = 3,
  LOG_OUT = 4,
  FRIENDS = 5,
// <!--   FRIENDS = 3,
//   SETTING = 4,
//   LOG_OUT = 5, -->
}

const Navigation = () => {

  const [active, setActive] = useState<number>(NavItem.CHAT)

  const dispatch = useAppDispatch()
  const token  = useAppSelector((state) => state.token.accessToken)
  
  const user = useAppSelector((state) => state.user.userInfo)

  const navigate = useNavigate()
  const IP_BACKEND = 'https://se-com-be.onrender.com'

  const handleLogout = async () => {
    const res = await axios.post(`${IP_BACKEND}/logout`, { idUser: user.idUser}, {headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Add null check for token
    }})
    // console.log(res)

    if(res.status == 200) {
      dispatch(setCurrentChatId(''))
      dispatch(setCurrentMessage([]))
      dispatch(setCurrentReceiver({idUser: '', name: '', avatar: ''}))
      dispatch(changeLoginState(false))
      navigate('/welcome')
    }
    else {
      console.log('Error when logout')
    }
  }

  return (
    <div className='nav-wrapper' 
         style={{ display: `${['/welcome', '/forgot-password', '/verify-otp', '/form-email', '/change-password', '/form-phone'].includes(window.location.pathname) ? 'none' : 'flex'}` }}>
      <div className={`${active === NavItem.CHAT ? 'nav-item active' : 'nav-item'}`} onClick={() => {
          setActive(NavItem.CHAT)
          dispatch(setCurrentReceiver({ idUser: '', name: '', avatar: '' }))
          navigate('/chat')
      }}>
        <FontAwesomeIcon className='nav-icon' icon={faComment} />
        <p>Tin nhắn</p>
      </div>
      <div className={`${active === NavItem.PROFILE ? 'nav-item active' : 'nav-item'}`} onClick={() => {
          navigate('/profile')
          dispatch(setCurrentReceiver({ idUser: '', name: '', avatar: '' }))
          setActive(NavItem.PROFILE)
      }}>
        <FontAwesomeIcon className='nav-icon' icon={faUser} />
        <p>Trang cá nhân</p>
      </div>
     

      <div className={`${active == NavItem.FRIENDS ? 'nav-item active' : 'nav-item'}`} onClick={() => {
        // navigate(`/profile/${user.idUser}`)
        navigate(`/friendS`)
        console.log(NavItem.FRIENDS)
        setActive(NavItem.FRIENDS)
      }}>
        <FontAwesomeIcon className='nav-icon' icon={faUser} />
        <p>Bạn bè</p>
      </div>
      <div className='nav-item' onClick={handleLogout}>
        <FontAwesomeIcon className='nav-icon' icon={faArrowRightFromBracket} />
        <p>Đăng xuất</p>
      </div>    
    </div>
  )
}

export default Navigation
