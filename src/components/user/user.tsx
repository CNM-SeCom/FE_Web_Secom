import './user.scss'
import { FriendInterface, ReqAddFriendInterface, UserInterface } from '../../interface/Interface'
import axios from 'axios'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { setUser } from '../../redux/UserSlice';
import { useDispatch } from 'react-redux'
import Loading from '../loading/Loading'



interface Props {
  user: FriendInterface
}

const user = ({user} : Props) => {

  const fromUser: UserInterface = useAppSelector((state) => state.user.userInfo)
  console.log(fromUser)
  const [flag, setFlag] = useState(true)
  const token  = useAppSelector((state) => state.token.accessToken)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  // console.log(token);
  
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const IP_BACKEND = 'https://se-com-be.onrender.com'
  const handleNotify = (receiverId:string, name:string) => {
    const data = {
      receiverId: receiverId,
      name : name
    }
  
    axios.post(`${IP_BACKEND}/ws/sendNotifyAddFriendToUser`, {data})
    .then((response) => {
      console.log(response.data);
    })
  }

  const handleAddFriend = (toIdUser: string, nameToUser: string, avatar: string) => {
    setLoading(true)
    const data ={
      fromUser: fromUser.idUser,
      nameFromUser: fromUser.name,
      avatarFromUser: fromUser.avatar,
      toUser: toIdUser,
      nameToUser : nameToUser, 
      avatarToUser : avatar,
    }
    if(flag){
       
      axios.post(`${IP_BACKEND}/sendRequestAddFriend`, data, config)
      .then(() => {
        handleNotify(data.toUser, data.nameFromUser);
        // console.log(response.data);
        setLoading(false)
        let listRequest = Array()
        listRequest =  [...fromUser.listRequest]
        console.log("hahaha", listRequest)
        listRequest = [...fromUser.listRequest, data]
        dispatch(setUser({...fromUser, listRequest: listRequest}))
        setFlag(false)
      })
      .catch((error) => {
        console.log(error);
      }
      );
    }else{
      axios.post(`${IP_BACKEND}/cancelRequestAddFriend`, data)
      
      .then(() => {
        handleNotify(data.toUser, data.nameFromUser);
        setFlag(true)
      })
      .catch((error) => {
        console.log(error);
      }
      );
    }
  }
  

  const reloadUser = async () => {
    const body = {
      idUser: fromUser.idUser
    }
    await axios.post(`${IP_BACKEND}/reloadUser`, body)
      .then((res) => {
        setUser(res.data.data)
        navigate("/friends")
        
      })
      .catch(() => {
        console.log('Error')
      })
  }

  
  
  const checkExistRequestAddFriend = async () => {
    const body = {
      fromUser: fromUser.idUser,
      avatarFromUser: fromUser.avatar,
      nameFromUser: fromUser.name,
      toUser: user.idUser,
      avatarToUser: user.avatar,
      nameToUser: user.name
    }
    await axios.post(`${IP_BACKEND}/checkExistRequestAddFriend`, body)
      .then((res) => {
        setFlag(res.data.success)
        console.log(res.data.success);
      })
      .catch(() => {
          setFlag(false)
      })
  }

  useEffect(() => {
    //   if(!isLogin) {
    //     navigate('/welcome')
    //   }
    reloadUser()
    checkExistRequestAddFriend()

  }, [])
  
   
  return (
    // <div className={'conversation-wrapper'}>
    //   <img src={user.avatar} alt='avatar-user' />
    //   <h4>{user.name}</h4> 
    //   <button 
    //     className={`${flag? 'btnActive' : 'btn'}`} 
    //     onClick={() => handleAddFriend(user.idUser, user.name, user.avatar)}>{flag ? 'Thêm bạn': 'Thu hồi'}</button>
    // </div>
// <!-- 
        <div className={'conversation-wrapper1'}>
            <img src={user.avatar} alt='avatar-user' />
            <h4>{user.name}</h4> 
            {flag ? 
            <button 
            className={!loading?'btnActive1':'btn1'}
            disabled={loading}
            onClick={() => handleAddFriend(user.idUser, user.name, user.avatar)}
            // onClick={() => checkExistRequestAddFriend()}
            >{loading?'Đang gửi':'Thêm bạn'}</button>:null}
        </div> 
  )
}
export default user
