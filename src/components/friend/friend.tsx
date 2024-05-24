import './friend.scss'
import { FriendInterface, ReqAddFriendInterface, UserInterface } from '../../interface/Interface'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
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
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  // console.log(token);

  
  const IP_BACKEND = 'https://se-com-be.onrender.com'

  const reloadUser = async () => {
    const body = {
      idUser: fromUser.idUser
    }
    await axios.post(`${IP_BACKEND}/reloadUser`, body)
      .then((res) => {
        setUser(res.data.data)
      })
      .catch(() => {
        console.log('Error')
      })
  }
  const handleNotify = (receiverId:string, name:string) => {
    const data = {
      receiverId: receiverId,
      name : name
    }
    axios.post(`${IP_BACKEND}/ws/sendNotifyAddFriendToUser`, data)
    .then((response) => {
      console.log("notify")
      console.log(response.data);
    })
  }

  const unFriend = async () => {
    setLoading(true)
    const body = {
      idUser: fromUser.idUser,
      friendId: fr.idUser
    }
    await axios.post(`${IP_BACKEND}/unFriend`, body)
      .then((res) => {
        setLoading(false)
        handleNotify(body.friendId, "")
        let listRequest = Array()
        listRequest =  [...fromUser.listRequest]
        console.log("hahaha", listRequest)
        listRequest = [...fromUser.listRequest, res]
        dispatch(setUser({...fromUser, listRequest: listRequest}))
        reloadUser()
        
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
              >{loading?'Đang xóa':"Xóa bạn"}</button>
        </div>
  )
}
export default friend
