import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FindFriend from '../findFriend/findFriend'
import './friends.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ChatInterface, FriendInterface, UserInterface } from '../../interface/Interface'
import { useAppDispatch } from '../../redux/Store'
import AddFriend from './../addFriend/addFriend';
import { setUser } from '../../redux/UserSlice'
import Friend from '../friend/friend'

const friends = () => {

  const [openModal, setOpenModal] = useState(false)

  const [openChat, setOpenChat] = useState(true)

  const [openAddFriend, setOppenAddFriend] = useState(false)

  const [openListFriend, setOpenListFriend] = useState(true)

  const [listReqAF, setListReqAF] = useState([{}])

  const [listSentReqAF, setSentListReqAF] = useState([{}])

  const [flag, setFlag] = useState(false)

  const [listFriends, setListFriends] = useState([])

  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)
  const userId: string = useAppSelector((state) => state.user.userInfo.idUser)
  const user: UserInterface = useAppSelector((state) => state.user.userInfo)
  
  const IP_BACKEND = 'https://se-com-be.onrender.com'

  const getRequestAddFriendByUserId = async () => {
    const body = {
      idUser: userId
    }
    await axios.post(`${IP_BACKEND}/getRequestAddFriendByUserId`, body)

      .then((res) => {
        setListReqAF(res.data.data)
      })
      .catch(() => {
        console.log('Error when get message')
      })
  }

  const getListFriendByUserId = async () => {
    const body = {
      idUser: userId
    }
    await axios.post(`${IP_BACKEND}/getListFriendByUserId`, body)

      .then((res) => {
        setListFriends(res.data.data)
        console.log(res.data.data);
        
      })
      .catch(() => {
        console.log('Error when get message')
      })
  }

  const getSentRequestAddFriendByUserId = async () => {
    const body = {
      idUser: userId
    }
    await axios.post(`${IP_BACKEND}/getSentRequestAddFriendByUserId`, body)

      .then((res) => {
        setSentListReqAF(res.data.data)
        console.log(res.data.data);
      })
      .catch(() => {
        console.log('Error when get message')
      })
  }

  const navigate = useNavigate()
  
  const reloadUser = async () => {
    const body = {
      idUser: userId
    }
    await axios.post(`${IP_BACKEND}/reloadUser`, body)

      .then((res) => {
        setUser(res.data.data)
        console.log(res.data.data);
      })
      .catch(() => {
        console.log('Error')
      })
  }
  
  useEffect(() => {
    //   if(!isLogin) {
    //     navigate('/welcome')
    //   }
    getListFriendByUserId();
    getRequestAddFriendByUserId();
    getSentRequestAddFriendByUserId();
    console.log(listReqAF);
    console.log(listSentReqAF);
    console.log(listFriends);
    reloadUser();
  }, [])

  return (

    <div className='chat-wrapper'>

      {openModal && (<div className="conversations-wrapper"><button onClick={() => { setOpenModal(false), setOpenChat(true) }}>Thoát</button><FindFriend /></div>)}
      {/* {openModalAddFriend && (<div className="conversations-wrapper"><button onClick={() => {setOpenModalAddFriend(false), setOpenChat(true)}}>Thoát</button><AddFriend list = {list}/></div>)} */}
      {openChat &&
      <div className='chat-wrapper'>
        <div className="conversations-wrapper">
          <div className="search-wrapper">
            <input type="text" placeholder='Tìm kiếm...' onClick={() => { setOpenModal(true), setOpenChat(false) }} />
            <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
          </div>
            <button className={`${flag? 'btnCreateGroupf' : 'btnCreateGroupActive'}`} onClick={() => {setOpenListFriend(true), setOppenAddFriend(false), setFlag(false)}}>Danh sách bạn bè</button>
            <button className={`${flag? 'btnCreateGroupActive' : 'btnCreateGroupf'}`} onClick={() => {setOpenListFriend(false), setOppenAddFriend(true), setFlag(true)}}>Danh sách lời mời kết bạn</button>
        </div>
        {openAddFriend && 
          <div className='loadUser-wrapper'>
            <div className='reqAddFriend'>
              <p>Lời mời kết bạn</p>
              <div className='loadReqAF'>
                {listReqAF.map((item) => <AddFriend add={item}/>)}
              </div>
            </div>
            <div className='sendReqAddFriend'>
              <p>Lời mời đã gửi</p>
              <div className='sendReqAddFriend'>
                {listSentReqAF.map((item) => <AddFriend sentI={item}/>)}
              </div>
            </div>
          </div>
        }
        {openListFriend && 
          <div className='loadUser-wrapper'>
            <div className='reqAddFriend'>
              <p>Danh sách bạn bè</p>
              <div className='loadReqAF'>
                {listFriends.map((item) => <Friend fr={item}/>)}
              </div>
            </div>
            
          </div>
        }
        
      </div>
      }
      
      
    </div>
  )
}
export default friends
