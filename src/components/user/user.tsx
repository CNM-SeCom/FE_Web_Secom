import './user.scss'
import { UserInterface } from '../../interface/Interface'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'


interface Props {
  user: UserInterface
}

const user = ({user} : Props) => {
  const navigate = useNavigate()
  const fromUser: UserInterface = useAppSelector((state) => state.user.userInfo)
  const [flag, setFlag] = useState(true)
  const token = useSelector((state) => state.token.token);

  // console.log(token);
  
  const config = {
    headers: { Authorization: `Bearer ${token.accessToken}` }
  };

  const IP_BACKEND = 'https://se-com-be.onrender.com'
  const handleNotify = (receiverId: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const data = {
      receiverId: receiverId,
      name : name
    }
  
    axios.post(`${IP_BACKEND}/ws/sendNotifyAddFriendToUser`, {data})
    .then((response) => {
      console.log(response.data);
    })
  
  }

  const handleAddFriend = (toIdUser: React.MouseEvent<HTMLButtonElement, MouseEvent>, nameToUser: React.MouseEvent<HTMLButtonElement, MouseEvent>, avatar: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    
    
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
      axios.post(`${IP_BACKEND}/sendRequestAddFriend`, data, config)
      .then((response) => {
        handleNotify(toIdUser, data.nameFromUser);
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
              onClick={(toIdUser, nameToUser, avatar) => handleAddFriend(user.idUser, user.name, user.address)}>{flag ? '+': '-'}</button>
        </div>
    
  )
}

export default user
