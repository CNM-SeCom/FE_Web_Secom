import './user.scss'
import { UserInterface } from '../../interface/Interface'
import axios from 'axios'
import { useAppSelector } from '../../redux/Store'
import { useState } from 'react'


interface Props {
  user: UserInterface
}

const user = ({user} : Props) => {

  const fromUser: UserInterface = useAppSelector((state) => state.user.userInfo)
  const [flag, setFlag] = useState(true)
  const token  = useAppSelector((state) => state.token.accessToken)

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
        setFlag(false)
      })
      .catch((error) => {
        console.log(error);
      }
      );
    }else{
      console.log('Đã gửi lời mời');
    }
    
  }
  
   
  return (
    <div className={'conversation-wrapper'}>
      <img src={user.avatar} alt='avatar-user' />
      <h4>{user.name}</h4> 
      <button 
        className={`${flag? 'btnActive' : 'btn'}`} 
        onClick={() => handleAddFriend(user.idUser, user.name, user.avatar)}>{flag ? '+': '-'}</button>
    </div>
  )
}

export default user
