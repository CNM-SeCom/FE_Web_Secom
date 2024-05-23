import './user.scss'
import { FriendInterface, ReqAddFriendInterface, UserInterface } from '../../interface/Interface'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { setUser } from '../../redux/UserSlice';



interface Props {
  user: FriendInterface
}

const user = ({user} : Props) => {
  const navigate = useNavigate()
  const fromUser: UserInterface = useAppSelector((state) => state.user.userInfo)
  const [flag, setFlag] = useState(true)
  const token = useSelector((state) => state.token.token);
  // console.log(token);

  const handleAddFriend = (toIdUser: string, nameToUser: string, avatar: string) => {
    const data ={
      fromUser: fromUser.idUser,
      nameFromUser: fromUser.name,
      avatarFromUser: fromUser.avatar,
      toUser: toIdUser,
      nameToUser : nameToUser, 
      avatarToUser : avatar,
    }

    console.log(data);
    if(flag){
      axios.post('http://localhost:3000/sendRequestAddFriend', data)
      .then((response) => {
        setFlag(false)
      })
      .catch((error) => {
        console.log(error);
      }
      );
    }else{
      axios.post('http://localhost:3000/cancelRequestAddFriend', data)
      .then(() => {
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
    await axios.post('http://localhost:3000/reloadUser', body)
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
    await axios.post('http://localhost:3000/checkExistRequestAddFriend', body)
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

        <div className={'conversation-wrapper1'}>
            <img src={user.avatar} alt='avatar-user' />
            <h4>{user.name}</h4> 
            <button 
              className={`${flag? 'btnActive1' : 'btn1'}`} 
              onClick={() => handleAddFriend(user.idUser, user.name, user.avatar)}
              // onClick={() => checkExistRequestAddFriend()}
              >{flag ? '+': '-'}</button>
        </div>
  )
}
export default user
