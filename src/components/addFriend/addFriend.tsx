import './addFriend.scss'
import { ReqAddFriendInterface, SentAddFriendInterface, UserInterface } from '../../interface/Interface'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { setUser } from '../../redux/UserSlice'


interface Props {
  add: ReqAddFriendInterface
  sentI: SentAddFriendInterface
}

const addFriend = ({add, sentI} : Props) => {
  const navigate = useNavigate()
  const fromUser: UserInterface = useAppSelector((state) => state.user.userInfo)
  const [flag, setFlag] = useState(true)
  const token = useSelector((state) => state.token.token);
  const IP_BACKEND = 'https://se-com-be.onrender.com'
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  useEffect(() => {
    if (add != null) {
      setFlag(true)
    } else if (sentI != null) {
      setFlag(false)
    }
  }, [add, sentI])
  const handleNotify = (receiverId:string, name:string) => {
    const data = {
      receiverId: receiverId,
      name : name
    }
  
    axios.post(`${IP_BACKEND}/ws/sendNotifyAddFriendToUser`, data)
    .then((response) => {
      console.log(response.data);
    })
  }

  // console.log(token);
  
  // const config = {
  //   headers: { Authorization: `Bearer ${token.accessToken}` }
  // };

  // const handleNotify = (receiverId: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   const data = {
  //     receiverId: receiverId,
  //     name : name
  //   }
  
  //   axios.post(`${IP_BACKEND}/ws/sendNotifyAddFriendToUser', {data})
  //   .then((response) => {
  //     console.log(response.data);
  //   })
  
  // }

  const acceptRequestAddFriend = () => {
    const data = add
    setLoading(true)
    console.log(data);
    if(flag){ 
      
      axios.post(`${IP_BACKEND}/acceptRequestAddFriend`, data)
      .then((response) => {
        handleNotify(data.fromUser, data.nameToUser);
        setLoading(false)
        let listFriend = Array()
        if(fromUser.listFriend == null){
          listFriend = []
        }
        else{
          listFriend =  [...fromUser.listFriend]
        }
        const newFriend = { 
          idUser: data.fromUser,
          name: data.nameFromUser,
          avatar: data.avatarFromUser
        }
        listFriend.push(newFriend)
        dispatch(setUser({...fromUser, listFriend: listFriend}))
        // handleNotify(toIdUser, data.nameFromUser);
        // console.log(response.data);
        navigate("/friends")
      })
      .catch((error) => {
        console.log(error);
      }
      );
    }else{
      const data = sentI
      console.log(data);
      axios.post(`${IP_BACKEND}/cancelRequestAddFriend`, data)
      .then(() => {
        handleNotify(data.fromUser, data.nameFromUser);
        setLoading(false)
        let listRequest = Array()
        if(fromUser.listRequest == null){
          listRequest = []
        }
        else{
          listRequest =  [...fromUser.listRequest]
        }
        //bỏ đi phần tử được cancle
        listRequest = listRequest.filter((item) => item.toUser !== data.toUser&&item.fromUser !== data.fromUser)
        console.log("hihihi")
        console.log(listRequest)
        dispatch(setUser({...fromUser, listRequest: listRequest}))
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
    await axios.post(`${IP_BACKEND}/checkExistRequestAddFriend`, body)
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
    // checkExistRequestAddFriend()
  }, [])
  
   
  return (

        <div className={'conversation-wrapper1'}>
            <img src={add?add.avatarFromUser:sentI.avatarToUser} alt='avatar-user' />
            <h4>{add?add.nameFromUser:sentI.nameToUser}</h4> 
            <button 
              className={`${flag?'btnActiveaf':'btnaf'}`} 
              disabled={loading}
              onClick={() => (acceptRequestAddFriend())}
              >
              {flag ? loading?'Đang chấp nhận':'Chấp nhận': loading?'Đang từ chối':'Từ chối'}
              </button>
              {flag ? <button
              className='btnaf'
              onClick={() => {
                axios.post(`${IP_BACKEND}/cancelRequestAddFriend`, add)
                .then(() => {
                  handleNotify(add.fromUser, add.nameToUser);
                  let listRequest = Array()
                  listRequest =  [...fromUser.listRequest]
                  console.log("hahaha", listRequest)
                  listRequest = [...fromUser.listRequest, add]
                  dispatch(setUser({...fromUser, listRequest: listRequest}))
                })
                .catch((error) => {
                  console.log(error);
                }
                );
              }
              }
              >Từ chối</button> : null}

        </div>
    
  )
}

export default addFriend
