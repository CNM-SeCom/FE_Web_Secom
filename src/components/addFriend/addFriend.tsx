import './addFriend.scss'
import { ReqAddFriendInterface, SentAddFriendInterface, UserInterface } from '../../interface/Interface'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'


interface Props {
  add: ReqAddFriendInterface
  sentI: SentAddFriendInterface
}

const addFriend = ({add, sentI} : Props) => {
  const navigate = useNavigate()
  const fromUser: UserInterface = useAppSelector((state) => state.user.userInfo)
  const [flag, setFlag] = useState(true)
  const token = useSelector((state) => state.token.token);

  // console.log(token);
  
  // const config = {
  //   headers: { Authorization: `Bearer ${token.accessToken}` }
  // };

  // const handleNotify = (receiverId: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   const data = {
  //     receiverId: receiverId,
  //     name : name
  //   }
  
  //   axios.post('http://localhost:3000/ws/sendNotifyAddFriendToUser', {data})
  //   .then((response) => {
  //     console.log(response.data);
  //   })
  
  // }

  const acceptRequestAddFriend = () => {
    const data = add
    console.log(data);
    if(flag){
      axios.post('http://localhost:3000/acceptRequestAddFriend', data)
      .then((response) => {
        // handleNotify(toIdUser, data.nameFromUser);
        // console.log(response.data);
        setFlag(false)
        navigate("/friends")
      })
      .catch((error) => {
        console.log(error);
      }
      );
    }else{
      const data = sentI
      console.log(data);
      axios.post('http://localhost:3000/cancelRequestAddFriend', data)
      .then(() => {
        setFlag(true)
        navigate("/friends")
      })
      .catch((error) => {
        console.log(error);
      }
      );
    }
    
  }

  const checkExistRequestAddFriend = async () => {
    const body = {
      fromUser: fromUser.idUser,
      avatarFromUser: fromUser.avatar,
      nameFromUser: fromUser.name,
      toUser: add?add.fromUser:sentI.toUser,
      avatarToUser: add?add.avatarFromUser:sentI.avatarToUser,
      nameToUser: name
    }
    await axios.post('http://localhost:3000/checkExistRequestAddFriend', body)
      .then((res) => {
        setFlag(res.data.success)
        // console.log(res.data.success);
        
      })
      .catch(() => {
        setFlag(false)
      })
  }
  

  useEffect(() => {
    //   if(!isLogin) {
    //     navigate('/welcome')
    //   }
    checkExistRequestAddFriend()
  }, [])
  
   
  return (

        <div className={'conversation-wrapper1'}>
            <img src={add?add.avatarFromUser:sentI.avatarToUser} alt='avatar-user' />
            <h4>{add?add.nameFromUser:sentI.nameToUser}</h4> 
            <button 
              className={`${flag? 'btnActiveaf' : 'btnaf'}`} 
              onClick={() => (acceptRequestAddFriend())}
              >
              {flag ? '+': '-'}
              </button>
        </div>
    
  )
}

export default addFriend
