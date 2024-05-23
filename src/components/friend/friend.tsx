import './friend.scss'
import { FriendInterface, ReqAddFriendInterface, UserInterface } from '../../interface/Interface'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { setUser } from '../../redux/UserSlice';



interface Props {
  fr: FriendInterface
}

const friend = ({fr} : Props) => {
  const navigate = useNavigate()
  const fromUser: UserInterface = useAppSelector((state) => state.user.userInfo)
  const [flag, setFlag] = useState(true)
  const token = useSelector((state) => state.token.token);
  // console.log(token);

  
  

  const reloadUser = async () => {
    const body = {
      idUser: fromUser.idUser
    }
    await axios.post('http://localhost:3000/reloadUser', body)
      .then((res) => {
        setUser(res.data.data)
      })
      .catch(() => {
        console.log('Error')
      })
  }

  const unFriend = async () => {
    const body = {
      idUser: fromUser.idUser,
      friendId: fr.idUser
    }
    await axios.post('http://localhost:3000/unFriend', body)
      .then((res) => {
        setUser(res.data.data)
        reloadUser()
        navigate("/friends")
      })
      .catch(() => {
        console.log('Error')
      })
  }

  useEffect(() => {
    //   if(!isLogin) {
    //     navigate('/welcome')
    //   }
    reloadUser()
  }, [])
  
   
  return (

        <div className={'conversation-wrapper1f'}>
            <img src={fr.avatar} alt='avatar-user' />
            <h4>{fr.name}</h4> 
            <button 
              className='btn1f'
              onClick={() => unFriend()}
              >Xóa bạn</button>
        </div>
  )
}
export default friend
