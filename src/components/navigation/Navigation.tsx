import { faArrowRightFromBracket, faComment, faGear, faUser } from '@fortawesome/free-solid-svg-icons'
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
}

const Navigation = () => {

  const [active, setActive] = useState<number>(NavItem.CHAT)

  const dispatch = useAppDispatch()
  const token: string | null = useAppSelector((state) => state.token.token)
  const user = useAppSelector((state) => state.user.userInfo)

  const navigate = useNavigate()

  const handleLogout = async () => {
    const res = await axios.post('http://localhost:3000/logout', { idUser: user.idUser}, {headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.accessToken}`
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
         style={{display: `${window.location.href == 'http://localhost:5173/welcome' || window.location.href == 'http://localhost:5173/forgot-password' || window.location.href == 'http://localhost:5173/verify-otp' || window.location.href == 'http://localhost:5173/form-email' || window.location.href == 'http://localhost:5173/change-password' || window.location.href == 'http://localhost:5173/form-phone' ? 'none' : 'flex'}`}}>
      {/* <div className={`${active == NavItem.HOME ? 'nav-item active' : 'nav-item'}`} onClick={() => {
          setActive(NavItem.HOME)
          navigate('')
      }}>
        <FontAwesomeIcon className='nav-icon' icon={faHouse} />
        <p>Trang chủ</p>
      </div> */}
      <div className={`${active == NavItem.CHAT ? 'nav-item active' : 'nav-item'}`} onClick={() => {
          setActive(NavItem.CHAT)
          dispatch(setCurrentReceiver({idUser: '', name: '', avatar: ''}))
          navigate('/chat')
      }}>
        <FontAwesomeIcon className='nav-icon' icon={faComment} />
        <p>Tin nhắn</p>
      </div>
      <div className={`${active == NavItem.PROFILE ? 'nav-item active' : 'nav-item'}`} onClick={() => {
        // navigate(`/profile/${user.idUser}`)
      
        navigate(`/profile`)
        dispatch(setCurrentReceiver({idUser: '', name: '', avatar: ''}))
        setActive(NavItem.PROFILE)
      }}>
        <FontAwesomeIcon className='nav-icon' icon={faUser} />
        <p>Trang cá nhân</p>
      </div>
      <div className={`${active == NavItem.SETTING ? 'nav-item active' : 'nav-item'}`} onClick={() => {
        navigate('/setting')
        dispatch(setCurrentReceiver({idUser: '', name: '', avatar: ''}))
        setActive(NavItem.SETTING)
      }}>
        <FontAwesomeIcon className='nav-icon' icon={faGear} />  
        <p>Cài đặt</p>
      </div>    
      <div className='nav-item' onClick={() =>
        
        handleLogout()}>
        <FontAwesomeIcon className='nav-icon' icon={faArrowRightFromBracket} />
        <p>Đăng xuất</p>
      </div>    
    </div>
  )
}

export default Navigation
