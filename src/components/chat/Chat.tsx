import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Messages from '../messages/Messages'
import FindFriend from '../findFriend/findFriend'
import './Chat.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Conversation from '../conversation/Conversation'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ChatInterface, FriendInterface, MessageInterface, UserInterface } from '../../interface/Interface'
import { useAppDispatch } from '../../redux/Store'
import { setAvatarGroup, setCurrentMessage, setCurrentReceiver, setCurrentTyping, setGroupName, setListParticipant } from '../../redux/CurentChatSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const Chat = () => {



  const [openModal, setOpenModal] = useState(false)

  const [openChat, setOpenChat] = useState(true)

  const [active, setActive] = useState<string>('')
  const [listFriends, setListFriends] = useState<FriendInterface[]>([])
  const [chats, setChats] = useState<ChatInterface[]>([])

  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)
  const userId: string = useAppSelector((state) => state.user.userInfo.idUser)
  const user: UserInterface = useAppSelector((state) => state.user.userInfo)
  const stringeeToken = useAppSelector((state) => state.token.stringeeToken)
  let receiver: FriendInterface = useAppSelector((state) => state.currentChat.receiver)

  const currentTyping = useAppSelector((state) => state.currentChat.currentTyping)
  const currentChatType = useAppSelector((state) => state.currentChat.currentChatType)
  const currentChatId = useAppSelector((state) => state.currentChat.chatId)
  const [openModalCreateGroup, setOpenModalCreateGroup] = useState(false)
  const [isCreateGroup, setIsCreateGroup] = useState(true)
  const [creating, setCreating] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<FriendInterface[]>([]);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [groupName, setGroupName2] = useState('Nhóm của ' + user.name);
  const currentMessage = useAppSelector((state) => state.currentChat.messages)
  const [tracking, setTracking] = useState(receiver)
  
 
  let listF = user.listFriend

  const showModalCreateGroup = () => {
    setOpenModalCreateGroup(true)
  }
  useEffect(() => {console.log(receiver)},[receiver])

  const dispatch = useAppDispatch()
  localStorage.setItem('myAvatar', user.avatar)
  localStorage.setItem('chatId', currentChatId)
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3001/?idUser=${userId}`);
  socket.addEventListener('open', function (event) {
    console.log("Connected to server")
  });
  //on message event
  socket.addEventListener('message', async function (event) {
    
    const data = JSON.parse(event.data)
    if (data.type === "RELOAD_MESSAGE") {
      if (data.chatId === currentChatId) {
        getMessage()
      }
    } else
      if (data.type === "text" || data.type === "video" || data.type === "image" || data.type === "file"||data.type==='video-call') {
        console.log("ahiahidahsid")
        console.log(data)
        getConversation()
        
        if (currentChatType==='single'&&receiver.idUser !== '' && receiver.idUser === data.user.idUser) { 
          dispatch(setCurrentMessage([...currentMessage, data]))
          toast(data.user.name + ": " + data.text);
        }
        else if(currentChatType==='group'&&currentChatId===data.chatId&&userId!==data.user.idUser){
          dispatch(setCurrentMessage([...currentMessage, data]))
          toast(data.user.name + ": " + data.text);
        }
        else if (data.type==="video-call" &&currentChatType==='single'&&receiver.idUser !== '') { 
          dispatch(setCurrentMessage([...currentMessage, data]))
        }
      }
      else if (data.type === "TYPING") {
        if (receiver !== null && currentChatId === data.chatId&&userId!==data.userId) {
          dispatch(setCurrentTyping(data.typing))
        }

      }
      else if(data.type==="RELOAD_CONVERSATION"){
        getConversation()
      }
      else if(data.type==="GROUP_MESSAGE"){
        getConversation()
        toast(data.groupName + ": có 1 tin nhắn mới trong nhóm" );
      }
      else if(data.type==='KICKOUT_MEMBER'||data.type==='ADD_MEMBER'||data.type==='LEAVE_GROUP'||data.type==='SET_ADMIN'||data.type==='DELETE_CHAT'){
        getConversation()
        if(data.type==='DELETE_CHAT'&&currentChatId===data.chatId){
          toast('Nhóm đã bị giải tán')
          dispatch(setCurrentMessage([]))
          dispatch(setListParticipant([]))
          dispatch(setCurrentReceiver({idUser: '', name: '', avatar: ''}))
          dispatch(setCurrentTyping(false))
        }
        if(data.type==='KICKOUT_MEMBER'&&userId===data.idKickOut){
          toast('Bạn đã bị đuổi khỏi nhóm')
          dispatch(setCurrentMessage([]))
          dispatch(setListParticipant([]))
          dispatch(setCurrentReceiver({idUser: '', name: '', avatar: ''}))
          dispatch(setCurrentTyping(false))
        }
        if(currentChatType==='group'&&currentChatId===data.chatId&&userId!==data.user.idUser){
          dispatch(setCurrentMessage([...currentMessage, data]))
          dispatch(setListParticipant(data.participants))
          console.log(data.participants)
          toast(data.user.name + ": " + data.text);
        }
      }
      else if(data.type==='CHANGE_NAME'){
        getConversation()
        if(currentChatType==='group'&&currentChatId===data.chatId){
          toast('Tên nhóm đã được thay đổi')
          dispatch(setGroupName(data.groupName))
        }
      }
      else if(data.type==='CHANGE_AVATAR'){
        getConversation()
        if(currentChatType==='group'&&currentChatId===data.chatId){
          toast('Ảnh nhóm đã được thay đổi')
          dispatch(setAvatarGroup(data.avatarGroup))
        }
      }
      else if(data.type==='CALL_VIDEO'){
        const sToken = await localStorage.getItem('stringeeToken')
        const dataCall = {
          token: sToken, 
          callerId: userId,
          calleeId: data.data,
          calleeName: data.name,
          checkCall: false
        }
        localStorage.setItem('myName', data.name)
        localStorage.setItem('dataCall', JSON.stringify(dataCall))
        window.open('/src/components/call/Call.html', '_blank')
      }
  });
  },[currentMessage])
  const getMessage = async () => {
    const data = {
      chatId: currentChatId
    }
    await axios.post('http://localhost:3000/getMessageByChatId', data)
      .then((res) => {
        dispatch(setCurrentMessage(res.data.data))
      })
      .catch(() => {
        console.log('Error when get message')
      })
  }

  const navigate = useNavigate()
  let friend = {
    idUser: '',
    name: '',
    avatar: ''
  }


  // console.log(userId)

  const getConversation = async () => {
    await axios.post('http://localhost:3000/getChatByUserId', { idUser: userId })
      .then((res) => {
        //sort theo lastMessageTime
        res.data.data.sort((a: ChatInterface, b: ChatInterface) => {
          if (a.lastMessageTime > b.lastMessageTime) {
            return -1;
          }
          if (a.lastMessageTime < b.lastMessageTime) {
            return 1;
          }
          return 0;
        });

        setChats(res.data.data)
      })
      .catch(() => {
        console.log('Error when get chat')
      })
  }

  useEffect(() => {
    if (!isLogin) {
      navigate('/welcome')
    }
    getConversation()
  }, [])
  useEffect(() => {
  }, [currentTyping, currentMessage])
  useEffect(() => {
    getConversation()
  }, [currentMessage])
  useEffect(() => {
    if(selectedCount >=2){
      setIsCreateGroup(true)
    }
    else{
      setIsCreateGroup(false)
    }
  }, [selectedCount])
  useEffect(() => {},[currentMessage])
  
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userId = event.target.value;
    const isChecked = event.target.checked;
  
    // Tìm người dùng tương ứng với checkbox được chọn
    const sUser = listF.find(user => user.idUser === userId);
    const selectedUser = {
      idUser: sUser?.idUser,
      name: sUser?.name,
      avatar: sUser?.avatar,
      role: 'member'
    }
  
    if (selectedUser) {
      // Nếu checkbox được chọn
      if (isChecked) {
        // Thêm người dùng vào mảng selectedUsers
        setSelectedUsers(prevState => [...prevState, selectedUser]);
        // Tăng số lượng người dùng được chọn lên 1
        setSelectedCount(prevCount => prevCount + 1);
      } else {
        // Nếu checkbox bị hủy chọn
        // Lọc ra những người dùng không phải là người dùng đã được chọn
        const updatedSelectedUsers = selectedUsers.filter(user => user.idUser !== userId);
        setSelectedUsers(updatedSelectedUsers);
        // Giảm số lượng người dùng được chọn đi 1
        setSelectedCount(prevCount => prevCount - 1);
      }
    }
  };
  const createGroupChat = async () => {
    setCreating(true)
    const admin = {
      idUser: userId,
      name: user.name,
      avatar: user.avatar,
      role: 'admin'
    }
    selectedUsers.unshift(admin)
    const data = {
      name: groupName,
      listParticipant: selectedUsers,
      type: 'group',
      idAdmin: userId
    }
    await axios.post('http://localhost:3000/createGroupChat', data)
      .then((res) => {
      setCreating(false)
        getConversation()
        setOpenModalCreateGroup(false)
        setIsCreateGroup(false)
        setSelectedCount(0)
        setSelectedUsers([])
      })
      .catch(() => {
        console.log('Error when create chat')
      })
  }
  const [listSearch, setListSearch] = useState([]); // State lưu trữ danh sách đã lọc
  useEffect(() => {
    setListSearch(listF)
  }, [listF]);
  // Hàm xử lý sự kiện khi người dùng thay đổi nội dung input
  const searchName = (name: string) => {
    if(name===''){
      setListSearch(listF)
    }
    // Lọc danh sách theo tên
    const filteredList = listF.filter(participant =>
      participant.name.toLowerCase().includes(name.toLowerCase())
    );
    // Cập nhật state listSearch với danh sách đã lọc
    setListSearch(filteredList);
  };

  return (

    <div className='chat-wrapper'>

      {openModal && (<div className="conversations-wrapper"><button onClick={() => { setOpenModal(false), setOpenChat(true) }}>Thoát</button><FindFriend /></div>)}
      {/* {openModalAddFriend && (<div className="conversations-wrapper"><button onClick={() => {setOpenModalAddFriend(false), setOpenChat(true)}}>Thoát</button><AddFriend list = {list}/></div>)} */}
      {openChat &&
        <div className="conversations-wrapper">
          <div className="conversations-header">
            <h4 style={{ color: 'black' }}>Đoạn chat: {chats.length}</h4>

            <button>Tin nhắn mới</button>
            {/* <button onClick={() => {setOpenChat(false)}}>!</button> */}

          </div>
          <div className="search-wrapper">
            <input type="text" placeholder='Tìm kiếm...' onClick={() => { setOpenModal(true), setOpenChat(false) }} />
            <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
          </div>
          <hr />
          <button className='btnCreateGroup' onClick={showModalCreateGroup}>Tạo nhóm</button>
          <div style={{height:'100%',width:'100%', overflowY:'auto'}}>
          {
            chats.map((c) => {
              {
               if(c.type==='single'){
                c.participants.forEach((p) => {
                  if (p.idUser !== userId) {
                    friend.idUser = p.idUser
                    friend.name = p.name
                    friend.avatar = p.avatar
                  }
                })
               }
               else{
                friend.idUser = c.id
                friend.name = c.groupName
                friend.avatar = c.avatar
               }
              }
              return (
                // <p>aaaa</p>
                <Conversation key={friend.idUser} friendId={friend.idUser} setActive={setActive} active={active} name={friend.name} avatar={friend.avatar} chats={c} />

              )
            })
          }
            </div>
          <div>
          </div>

        </div>
      }
      {receiver.idUser ? <Messages /> : null}
      <ToastContainer />
      <Modal
        isOpen={openModalCreateGroup}
        onRequestClose={() => setOpenModalCreateGroup(false)}
        contentLabel="tùy chọn"
        className="modal-create-group"
        style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
      >
        <div style={{backgroundColor:'#1CA1C1', height:50, justifyContent:'center', alignItems:'center', display:'flex'}}>
          <h2 style={{ textAlign: 'center', color:'white'}}>Tạo nhóm chat</h2>
        </div>

        <div style={{ display: 'flex' }}>
          <img src="https://res.cloudinary.com/dekjrisqs/image/upload/v1712977627/vljmvybzv0orkqwej1tf.png" alt='avatar-user' style={{ height: 50, width: 50, borderRadius: 50 }} />
          <input type='text' placeholder='Tên nhóm' required style={{
            textAlign: 'left', 

          }} onChange={(e) => setGroupName2(e.target.value)} />
        </div>
        <input
          type='text'
          placeholder='Tìm kiếm...'
          style={{ width: '100%', height: 40, marginTop: 20, marginBottom: 20, textAlign: 'left', border: '1px solid #ccc', borderRadius: 5}}
          onChange={(e) => {
            searchName(e.target.value)
          }}
          />
        <div style={{ overflowY: 'auto', height:300}}>
          
          {listSearch.map((f) => {
            return (
              <div className='line-friend'>
                <div className='friend-info'>
                  <img src={f.avatar} alt='avatar-user' style={{ height: 50, width: 50, borderRadius: 50 }} />
                  <p style={{ color: 'black', fontSize: 20, marginLeft: 20, height: '100%' }}>{f.name}</p>
                </div>
                <input type='checkbox' id={f.idUser} name={f.name} value={f.idUser} className='checkBox' onChange={handleCheckboxChange} />
              </div>
            )
          })}

        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <button className='btnClose' onClick={() => {
            setIsCreateGroup(false)
            setSelectedCount(0)
            setSelectedUsers([])
            setGroupName2('')
            setCreating(false)
            setOpenModalCreateGroup(false) }}>Hủy</button>
          {creating ? <button className={isCreateGroup ? 'btnCreate' : 'btnCreateDisable'} disabled={!isCreateGroup} >Đang tạo nhóm...</button> : <button className={isCreateGroup ? 'btnCreate' : 'btnCreateDisable'} disabled={!isCreateGroup} onClick={createGroupChat}>Tạo nhóm</button>}
        </div>

      </Modal>
    </div>
  )
}
export default Chat