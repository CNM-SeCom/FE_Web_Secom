import './Messages.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Message from '../message/Message'
import { useAppSelector } from '../../redux/Store'
import { FriendInterface } from '../../interface/Interface'
import { useEffect, useState, useRef } from 'react'
import { useAppDispatch } from '../../redux/Store'
import axios from 'axios'
import { setCurrentMessage, setCurrentReceiver, setCurrentTyping, setGroupName, setListParticipant } from '../../redux/CurentChatSlice'
import { faPaperclip, faCancel, faVideo, faPhone, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import Modal from 'react-modal'


interface Message {
  user: string;
  message: string;
}

const Messages = () => {
  const [txtMessage, setTxtMessage] = useState<string>('')
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const receiver: FriendInterface = useAppSelector((state) => state.currentChat.receiver)
  const userId = useAppSelector((state) => state.user.userInfo.idUser)
  const currentReceiverId = useAppSelector((state) => state.currentChat.receiver.idUser)
  const currentChatId = useAppSelector((state) => state.currentChat.chatId)
  const currentChatType = useAppSelector((state) => state.currentChat.currentChatType)
  const messagesCurrent = useAppSelector((state) => state.currentChat.messages)
  const listParticipant = useAppSelector((state) => state.currentChat.listParticipant)
  const dispatch = useAppDispatch()
  const stringeeToken = useAppSelector((state) => state.token.stringeeToken)
  const user = useAppSelector((state) => state.user.userInfo)
  const [loadingSend, setLoadingSend] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [typing, setTyping] = useState(false)
  const currentTyping = useAppSelector((state) => state.currentChat.currentTyping)
  useEffect(() => { }, [currentTyping])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalAddVisible, setIsModalAddVisible] = useState(false)
  const [listFriends, setListFriends] = useState([])
  const [isModalOptionVisible, setIsModalOptionVisible] = useState(false)
  const [listSearch, setListSearch] = useState([]); 
  const [listSearchAdd, setListSearchAdd] = useState([]); 
  const [memberSelected, setMemberSelected] = useState({});
  const [loadingDeleteMember, setLoadingDeleteMember] = useState(false)
  const [loadingAddMember, setLoadingAddMember] = useState(false)
  const [loadingLeaveGroup, setLoadingLeaveGroup] = useState(false)
  const [loadingSetAdmin, setLoadingSetAdmin] = useState(false)
  const name = useAppSelector((state) => state.currentChat.groupName)
  const [nameGroup, setNameGroup] = useState(name)
  console.log(name)
  console.log(nameGroup)
  const [tracking, setTracking] = useState(false)
  const [fileAvatar, setFileAvatar] = useState<File | null>(null)
  const avatarGroup = useAppSelector((state) => state.currentChat.avatarGroup)
  const [avt, setAvt] = useState(avatarGroup)
  const [loadingChangeAvatar, setLoadingChangeAvatar] = useState(false)
  const IP_BACKEND = 'https://se-com-be.onrender.com'

  useEffect(() => {}, [listParticipant])
  useEffect(() => {setNameGroup(name)}, [name])
  useEffect(() => {}, [nameGroup])
  useEffect(() => {}, [avatarGroup])

  const getFriend = async () => {
    const data = {
      idUser: user.idUser
    }
    await axios.post(`${IP_BACKEND}/getListFriendByUserId`, data).then((res) => {
      setListFriends(res.data.data)
    }).catch(() => {
    })
  }
  //check chức vụ hiện tại trong nhóm
  const checkRole = () => {
    if (currentChatType === 'group') {
      const role = listParticipant.find((participant) => participant.idUser === userId)?.role
      return role
    }
    return null
  }
  const countAdmin = () => {
    if (currentChatType === 'group') {
      const count = listParticipant.filter((participant) => participant.role === 'admin').length
      return count
    }
    return 0
  }

  const getMessage = async () => {
    const data = {
      chatId: currentChatId
    }
    await axios.post(`${IP_BACKEND}/getMessageByChatId`, data)
      .then((res) => {
        dispatch(setCurrentMessage(res.data.data))
      })
      .catch(() => {
        console.log('Error when get message')
      })
  }
  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messagesCurrent, currentTyping]);
  useEffect(() => { }, [typing]);
  useEffect(() => { }, [messagesCurrent])

  const sendMessage = async () => {
    let data = {}
    if (file?.type.includes("image")) {
      const formData = new FormData();
      formData.append('file', file);
      data = {
        listReceiver: listParticipant,
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: '',
          type: "image",
          chatId: currentChatId,
        }
      }
      const newMessages = [...messagesCurrent, data.message]
      dispatch(setCurrentMessage(newMessages))
      await axios.post(`${IP_BACKEND}/uploadImageMessageWeb`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {

        data = {
          listReceiver: listParticipant,
          message: {
            receiverId: currentReceiverId,
            user: {
              idUser: user.idUser,
              name: user.name,
              avatar: user.avatar
            },
            text: '',
            type: "image",
            chatId: currentChatId,
            image: res.data.uri
          }
        }
      })
    }
    else if (file?.type.includes("video")) {
      const formData = new FormData();
      formData.append('file', file);
      data = {
        listReceiver: listParticipant,
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: '',
          type: "video",
          chatId: currentChatId,
        }
      }
      const newMessages = [...messagesCurrent, data.message]
      dispatch(setCurrentMessage(newMessages))
      await axios.post(`${IP_BACKEND}/cloudinary/uploadVideoWeb`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
        console.log(res.data.url)
        data = {
          listReceiver: listParticipant,
          message: {
            receiverId: currentReceiverId,
            user: {
              idUser: user.idUser,
              name: user.name,
              avatar: user.avatar
            },
            text: '',
            type: "video",
            chatId: currentChatId,
            video: res.data.url.url
          }
        }
      })
    }
    else if (file?.type.includes("document") || file?.type.includes("pdf")) {
      const formData = new FormData();
      formData.append('file', file);
      data = {
        listReceiver: listParticipant,
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: file.name,
          type: "file",
          chatId: currentChatId,
          file: ''
        }
      }
      const newMessages = [...messagesCurrent, data.message]
      dispatch(setCurrentMessage(newMessages))

      await axios.post(`${IP_BACKEND}/uploadFile`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((res) => {
          data = {
            listReceiver: listParticipant,
            message: {
              receiverId: currentReceiverId,
              user: {
                idUser: user.idUser,
                name: user.name,
                avatar: user.avatar
              },
              text: file.name,
              type: "file",
              chatId: currentChatId,
              file: res.data.uri
            }
          }
        }
        ).catch((err) => {
          const newMessagesWithoutData = messagesCurrent.filter((message) => message !== data.message);
          dispatch(setCurrentMessage(newMessagesWithoutData));
        })
    }
    else {
      data = {
        listReceiver: listParticipant,
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: txtMessage,
          type: "text",
          chatId: currentChatId

        }
      }
    }
    setLoadingSend(true)

    const newMessages = [...messagesCurrent, data.message]
    dispatch(setCurrentMessage(newMessages))
    setFile(null)
    setTxtMessage('')
    if (currentChatType === 'single') {
      await axios.post(`${IP_BACKEND}/ws/send-message-to-user`, data).then((res) => {
        //xóa đi data.message trong mảng messagesCurrent
        const newMessagesWithoutData = messagesCurrent.filter((message) => message !== data.message);
        dispatch(setCurrentMessage(newMessagesWithoutData));
        const newMessagesHasId = [...messagesCurrent, res.data.data]
        dispatch(setCurrentMessage(newMessagesHasId))
        setLoadingSend(false)
      }).catch(() => {
        console.log('Error when send message')
        setLoadingSend(false)
      })
    }
    else {
      await axios.post(`${IP_BACKEND}/ws/send-message-to-group/${currentChatId}`, data).then((res) => {
        //xóa đi data.message trong mảng messagesCurrent
        const newMessagesWithoutData = messagesCurrent.filter((message) => message !== data.message);
        dispatch(setCurrentMessage(newMessagesWithoutData));
        const newMessagesHasId = [...messagesCurrent, res.data.data]
        dispatch(setCurrentMessage(newMessagesHasId))
        setLoadingSend(false)
      }).catch(() => {
        console.log('Error when send message')
        setLoadingSend(false)
      })
    }

  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (txtMessage||file) {
        sendMessage();
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filee = e.target.files?.[0];
    if (filee) {
      setFile(filee);
    }
  };
  const handleFileChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filee = e.target.files?.[0];
    if (filee) {
      setFileAvatar(filee);
      setAvt(URL.createObjectURL(filee))
    }
  }
  const changeAvatarGroup = async () => {
    const result = window.confirm('Bạn có chắc chắn muốn thay đổi ảnh đại diện nhóm không?')
    if(result&&fileAvatar){
      setLoadingChangeAvatar(true)
      const formData = new FormData();
    formData.append('file', fileAvatar);
    await axios.post(`${IP_BACKEND}/uploadImageMessageWeb`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
    const data = {
        chatId: currentChatId,
        avatar: res.data.uri
      }
      const update={
        listReceiver: listParticipant,
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: user.name + ' đã thay đổi ảnh đại diện nhóm',
          type: "CHANGE_AVATAR",
          chatId: currentChatId,
          avatar: res.data.uri
        }
      }
      axios.post(`${IP_BACKEND}/changeAvatarGroup`, data).then((res) => {
        setFileAvatar(null)
        setAvt(data.avatar)
        setLoadingChangeAvatar(false)
        axios.post(`${IP_BACKEND}/ws/send-message-to-group/${currentChatId}`, update).then((res) => {
          const newMessagesHasId = [...messagesCurrent, res.data.data]
          dispatch(setCurrentMessage(newMessagesHasId))
        }).catch(() => {
          console.log('Error when send message')
        })

      }).catch(() => {
        console.log('Error when change avatar')
      })
    }).catch(() => {
      console.log('Error when upload avatar')
    })
    }
  }
  
  const handleAvatarClick = () => {
    if (!fileAvatar) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
    else {
      setFileAvatar(null)
    }
  };
  const sendTyping = async (b) => {
    if (currentChatType === 'single') {
      const data = {
        chatId: currentChatId,
        typing: b,
        receiverId: currentReceiverId,
        userId: userId
      }
      await axios.post(`${IP_BACKEND}/ws/sendTypingToUser`, data).then(() => {
        console.log('Send typing')
      }).catch(() => {
        console.log('Error when send typing')
      })
    }
    else {
      const data = {
        chatId: currentChatId,
        typing: b,
        listReceiver: listParticipant,
        userId: userId
      }
      await axios.post(`${IP_BACKEND}/ws/sendTypingToGroup`, data).then(() => {
        console.log('Send typing')
      }).catch(() => {
        console.log('Error when send typing')
      })
    }
  }

  const handleButtonClick = () => {
    if (!file) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
    else {
      setFile(null)
    }
  };
  //search tên trong ô tìm kiếm thành viên và hiển thị ra trong 1 list

  useEffect(() => {
    setListSearchAdd(listFriends)
  }, [listFriends]);
  useEffect(() => {
    setListSearch(listParticipant)
  }, [listParticipant]);
  // Hàm xử lý sự kiện khi người dùng thay đổi nội dung input
  const searchName = (name: string) => {
    if (name === '') {
      setListSearch(listParticipant)
    }
    // Lọc danh sách theo tên
    const filteredList = listParticipant.filter(participant =>
      participant.name.toLowerCase().includes(name.toLowerCase())
    );
    // Cập nhật state listSearch với danh sách đã lọc
    setListSearch(filteredList);
  };
  const searchNameAdd = (name: string) => {
    if (name === '') {
      //bỏ đi firend đã có trong participant
      const listFriendsNotInParticipant = listFriends.filter((friend) => listParticipant.includes(friend))
      setListSearchAdd(listFriendsNotInParticipant)
    }
    // Lọc danh sách theo tên
    const filteredList = listFriends.filter(participant =>
      participant.name.toLowerCase().includes(name.toLowerCase())
    );
    // Cập nhật state listSearch với danh sách đã lọc
    //bỏ đi firend đã có trong participant
    const filteredListNotInParticipant = filteredList.filter((friend) => listParticipant.includes(friend))
    setListSearchAdd(filteredListNotInParticipant);
  };
  // sự kiện rời nhóm 
  const leaveGroup = async () => {

    if (checkRole() === 'admin' && countAdmin() === 1&&listParticipant.length>1) {
      alert('Bạn phải chọn 1 người làm trưởng nhóm trước khi rời nhóm')
    }
    else if(listParticipant.length===1){
      alert('Nhóm sẽ bị xóa sau khi bạn rời nhóm')
    }
    else{
    setLoadingLeaveGroup(true)
      const data = {
        chatId: currentChatId,
        idUser: userId
      }
      const update ={
        listReceiver: listParticipant.filter((participant) => participant.idUser !== userId),
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: user.name + " đã rời khỏi nhóm",
          type: "LEAVE_GROUP",
          chatId: currentChatId,
          participants: listParticipant.filter((participant) => participant.idUser !== userId)
        }
      }
      const newMessages = [...messagesCurrent, update.message]
      dispatch(setCurrentMessage(newMessages))
      await axios.post(`${IP_BACKEND}/leaveOrKickoutGroupChat`, data).then(() => {
        setLoadingLeaveGroup(false)
        setIsModalOptionVisible(false)
        dispatch(setCurrentReceiver({name: '', idUser: '', avatar: ''}))
        dispatch(setCurrentMessage([]))
        dispatch(setListParticipant([]))
        setIsModalVisible(false)
        axios.post(`${IP_BACKEND}/ws/send-message-to-group/${currentChatId}`, update).then((res) => {
          const newMessagesWithoutData = messagesCurrent.filter((message) => message !== update.message);
          dispatch(setCurrentMessage(newMessagesWithoutData));
          const newMessagesHasId = [...messagesCurrent, res.data.data]
          dispatch(setCurrentMessage(newMessagesHasId))
        }).catch(() => {
          console.log('Error when send message')
        })
      }
      ).catch(() => {
        console.log('Error when delete member')
      })

    }

    const data = {
      userId: userId,
      chatId: currentChatId
    }
    // await axios.post('${IP_BACKEND}/leaveGroup', data).then(() => {
    //   console.log('Leave group')
    // }).catch(() => {
    //   console.log('Error when leave group')
    // })
  }
  //sự kiện thêm thành viên
  const addMemberToGroupChat= async () => {
    setLoadingAddMember(true)
    const data = {
      chatId: currentChatId,
      listMember: selectedUsers
    }
    let content
    if(selectedUsers.length>1){
        content = selectedUsers.length + ' thành viên'
    }
    else if(selectedUsers.length===1){
      content = selectedUsers[0].name
    }
    const update ={
      listReceiver: [...listParticipant, ...selectedUsers],
      message: {
        receiverId: currentReceiverId,
        user: {
          idUser: user.idUser,
          name: user.name,
          avatar: user.avatar
        },
        text: user.name + ' thêm ' + content + ' vào nhóm',
        type: "ADD_MEMBER",
        chatId: currentChatId,
        participants: [...listParticipant, ...selectedUsers]
      }
    }
    const newMessages = [...messagesCurrent, update.message]
    dispatch(setCurrentMessage(newMessages))
    await axios.post(`${IP_BACKEND}/addMemberToGroupChat`, data).then(() => {
      setLoadingAddMember(false)
      setIsModalAddVisible(false)
      setIsModalVisible(false)
      const listParticipantAfterAdd = [...listParticipant, ...selectedUsers]
      dispatch(setListParticipant(listParticipantAfterAdd))
      axios.post(`${IP_BACKEND}/ws/send-message-to-group/${currentChatId}`, update).then((res) => {
        const newMessagesWithoutData = messagesCurrent.filter((message) => message !== update.message);
        dispatch(setCurrentMessage(newMessagesWithoutData));
        const newMessagesHasId = [...messagesCurrent, res.data.data]
        dispatch(setCurrentMessage(newMessagesHasId))
      }).catch(() => {
        console.log('Error when send message')
      })
    }
    ).catch(() => {
      console.log('Error when add member')
    })
  }
  //sự kiện giải tán nhóm
  const deleteGroup = async () => {
    const result = window.confirm('Bạn có chắc chắn muốn giải tán nhóm không?')
    if(result){
      const data = {
        chatId: currentChatId
      }
      const update ={
        listReceiver: listParticipant,
        message: {
          receiverId: currentReceiverId,
          user: {
            idUser: user.idUser,
            name: user.name,
            avatar: user.avatar
          },
          text: user.name + ' đã giải tán nhóm',
          type: "DELETE_CHAT",
          chatId: currentChatId,
          participants: listParticipant
        }
      }
      await axios.post(`${IP_BACKEND}/deleteChat`, data).then(() => {
        setIsModalOptionVisible(false)
        setIsModalVisible(false)
        axios.post(`${IP_BACKEND}/ws/send-message-to-group/${currentChatId}`, update).then((res) => {
        }).catch(() => {
          console.log('Error when send message')
        })
      }
      ).catch(() => {
        console.log('Error when delete group')
      })
    }
  }
  const [selectedUsers, setSelectedUsers] = useState<FriendInterface[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userId = event.target.value;
    const isChecked = event.target.checked;

    // Tìm người dùng tương ứng với checkbox được chọn
    const sUser = listFriends.find(user => user.idUser === userId);
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
  const handleDeleteMember = async () => {
    const result = window.confirm('Bạn có chắc chắn muốn xóa thành viên này không?')
    if(result){
      setLoadingDeleteMember(true)
    const data = {
      chatId: currentChatId,
      idUser: memberSelected?.idUser
    }
    const update ={
      
      listReceiver: listParticipant,
      message: {
        receiverId: currentReceiverId,
        user: {
          idUser: user.idUser,
          name: user.name,
          avatar: user.avatar
        },
        text: user.name + ' đã đuổi ' + memberSelected?.name + ' khỏi nhóm',
        type: "KICKOUT_MEMBER",
        chatId: currentChatId,
        participants: listParticipant.filter((participant) => participant.idUser !== memberSelected?.idUser),
        idKickOut: memberSelected?.idUser
      }
    }
    const newMessages = [...messagesCurrent, update.message]
    dispatch(setCurrentMessage(newMessages))
    await axios.post(`${IP_BACKEND}/leaveOrKickoutGroupChat`, data).then(() => {
      setLoadingDeleteMember(false)
      setIsModalOptionVisible(false)
      const listParticipantAfterDelete = listParticipant.filter((participant) => participant.idUser !== memberSelected?.idUser)
      dispatch(setListParticipant(listParticipantAfterDelete))
      axios.post(`${IP_BACKEND}/ws/send-message-to-group/${currentChatId}`, update).then((res) => {
        const newMessagesWithoutData = messagesCurrent.filter((message) => message !== update.message);
        dispatch(setCurrentMessage(newMessagesWithoutData));
        const newMessagesHasId = [...messagesCurrent, res.data.data]
        dispatch(setCurrentMessage(newMessagesHasId))
      }).catch(() => {
        console.log('Error when send message')
      })
    }
    ).catch(() => {
      console.log('Error when delete member')
    })
    }
  }
  const setAdminForMember = async () => {
    //update thành viên vừa được chọn làm admin vào listparticipant
    if (memberSelected) {
      setLoadingSetAdmin(true)
      const newAdmin = {
        idUser: memberSelected.idUser,
        name: memberSelected.name,
        avatar: memberSelected.avatar,
        role: 'admin'
      }
      const oldAdmin = {
        idUser: user.idUser,
        name: user.name,
        avatar: user.avatar,
        role: 'member'
      }
      const index = listParticipant.findIndex((participant) => participant.idUser === memberSelected.idUser);
      //bỏ đi admin cũ
      const adminIndex = listParticipant.findIndex((participant) => participant.idUser === user.idUser)

      const updatedListParticipant = [...listParticipant]; // Create a copy of the listParticipant array
      updatedListParticipant[index] = newAdmin;
      updatedListParticipant[adminIndex] = oldAdmin;
       // Assign the newAdmin object to the corresponding index
      dispatch(setListParticipant(updatedListParticipant)); 
      console.log(updatedListParticipant)
      console.log(listParticipant)
    const data = {
      chatId: currentChatId,
      listParticipant: updatedListParticipant,
    }
    const update ={
      listReceiver: listParticipant,
      message: {
        receiverId: currentReceiverId,
        user: {
          idUser: user.idUser,
          name: user.name,
          avatar: user.avatar
        },
        text: user.name + ' đã đặt ' + memberSelected?.name + ' làm quản trị viên',
        type: "SET_ADMIN",
        chatId: currentChatId,
        participants: updatedListParticipant
      }
    }
    const newMessages = [...messagesCurrent, update.message]
    dispatch(setCurrentMessage(newMessages))
    await axios.post(`${IP_BACKEND}/setAdminForMember`, data).then(() => {
      setLoadingSetAdmin(false)
      setIsModalOptionVisible(false)
      axios.post(`${IP_BACKEND}/ws/send-message-to-group/${currentChatId}`, update).then((res) => {
        const newMessagesWithoutData = messagesCurrent.filter((message) => message !== update.message);
        dispatch(setCurrentMessage(newMessagesWithoutData));
        const newMessagesHasId = [...messagesCurrent, res.data.data]
        dispatch(setCurrentMessage(newMessagesHasId))
      }).catch(() => {
        console.log('Error when send message')
      })
    }
    ).catch(() => {
      console.log('Error when set admin')
    })
    }
  }
  const changeGroupName = async () => {
    const data = {
      chatId: currentChatId,
      groupName: nameGroup
    }
    const update ={
      listReceiver: listParticipant,
      message: {
        receiverId: currentReceiverId,
        user: {
          idUser: user.idUser,
          name: user.name,
          avatar: user.avatar
        },
        text: user.name + ' đã đổi tên nhóm thành ' + nameGroup,
        type: "CHANGE_NAME",
        chatId: currentChatId,
        groupName: nameGroup
      }
    }
    const newMessages = [...messagesCurrent, update.message]
    dispatch(setCurrentMessage(newMessages))
    await axios.post(`${IP_BACKEND}/changeGroupName`, data).then(() => {
      setIsModalVisible(false)
      axios.post(`${IP_BACKEND}/ws/send-message-to-group/${currentChatId}`, update).then((res) => {
        const newMessagesWithoutData = messagesCurrent.filter((message) => message !== update.message);
        dispatch(setCurrentMessage(newMessagesWithoutData));
        const newMessagesHasId = [...messagesCurrent, res.data.data]
        dispatch(setCurrentMessage(newMessagesHasId))
      }).catch(() => {
        console.log('Error when send message')
      })
    }
    ).catch(() => {
      console.log('Error when change group name')
    })
  }
  
  const handleCallVideo =()=>{
    const stringeeData = {
      token: stringeeToken,
      callerId: user.idUser,
      calleeId: receiver.idUser,
      calleeName: receiver.name,
      checkCall: true
    }
    localStorage.setItem('myName', user.name)
    localStorage.setItem('dataCall', JSON.stringify(stringeeData))
  //   async function notifyCallVideo() {
  //     const data ={
  //         receiverId: receiver.idUser,
  //         callerId:  user.idUser,
  //         name:  user.name,
         
  //     }
  //     await axios.post('${IP_BACKEND}/ws/sendNotifyCallVideo', data ).then(res => {
  //         console.log(res)
  //     }).catch(err => {
  //         console.log(err)
  //     }
  //     )
  // }
  // notifyCallVideo()
    window.open('/src/components/call/Call.html', '_blank')
  }
 
  return (

    <div className='messages-wrapper'>
      <div className="messages-header">
        <div className="mh-left">
          <img src={receiver.avatar} alt="avatar-user" />
          <h4 className='name-user'>{currentChatType==="group" ? name : receiver.name }</h4>
        </div>
        <div className="mh-right">
          <button className='btnCall'>
            <FontAwesomeIcon icon={faPhone} />
          </button>
          <button className='btnCall' onClick={handleCallVideo}>
            <FontAwesomeIcon icon={faVideo} />
          </button>
        {currentChatType === 'group' &&
          <button className='btnCall' onClick={() => {
            setIsModalVisible(true)
          }}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>}
        </div>
      </div>
      <hr />
      <div className="chat-content-wrapper" ref={messagesContainerRef}>
        {messagesCurrent.map((message, index) => (
          <Message key={index} message={message} chatType={currentChatType} />
        ))}
        {!currentTyping ? null : <p style={{ color: 'gray', marginLeft: 10 }}>Đang soạn tin nhắn...</p>}
      </div>
      <hr />
      <div className="input-message-wrapper">
        {
          file ? (<div className='show-file-name'>
            <p>File đã chọn: {file.name.toString()}</p>

          </div>)
            :
            (<div><input type="text" value={txtMessage} placeholder='Nhập để gửi tin nhắn...' onFocus={() => {
              sendTyping(true)
            }} onBlur={() => {

              sendTyping(false)
            }} onChange={(e) => setTxtMessage(e.target.value)} onKeyDown={handleKeyDown} /></div>)

        }
        <div className='btnChooseFile'>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}

            accept="image/*, video/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleFileChange}
          />
          <button onClick={handleButtonClick}>{!file ? (<FontAwesomeIcon icon={faPaperclip} />) : (<FontAwesomeIcon icon={faCancel} />)}</button>
        </div>
        <div className='btnSendMessage'>
          <button onClick={() => {
            if (txtMessage||file) {
              sendMessage()

              
            }

          }}>Gửi</button>
        </div>

      </div>
      <Modal
        isOpen={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        contentLabel="tùy chọn"
        className="modal-group-option"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            width: 550,
            height: '100%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: 'white',
            color: 'black',
            borderRadius: '10px',
            padding: '10px',
            border: 'none',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
          }

        }}
      >
        <div className='avtGroup'>
        <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}

            accept="image/*"
            onChange={handleFileChangeAvatar}
          />
          <img onClick={()=>{
            if(checkRole()&&checkRole()==='admin'){
              handleAvatarClick()
            }
          }} src={avt} alt="avatar-user" style={{ height: 80, width: 80, borderRadius: 50 }} />
        </div>
        <div className='nameGroup' style={{ width: '100%', textAlign: 'center' }}>
          {
            checkRole()&&checkRole()==='admin'?
            <div style={{marginTop:-20}}>
              <input onChange={(e)=>{
                setTracking(true)
                setNameGroup(e.target.value)
              }}   type="text" value={nameGroup} style={{ height:50,width: '100%', textAlign: 'center', fontSize: 20, fontWeight: 'bold', border: 'none'}} />
          {tracking&&
           <div style={{width:'100%',display:'flex', justifyContent:'center', marginBottom:30}}>
           <button style={{backgroundColor:'#1CA1C1'}} onClick={()=>{
            changeGroupName()
           }}>Lưu tên</button>
          </div>
          }
              </div>
            : <p style={{ height: 80, width: "100%", padding: 10, fontWeight: 'bold', fontSize: 20 }}>{nameGroup}</p>
          }
        </div>
        {currentChatType === "group" &&
          <div style={{ width: '100%', marginTop: -20 }}>
            <div style={{ width: '100%', cursor: 'pointer' }} onClick={() => {
              getFriend()
              setIsModalAddVisible(true)
            }}>
              <p style={{ fontSize: 18, borderBottom: '1px solid black', marginBottom: 10 }}>Thêm thành viên</p>
            </div>
            <div style={{ width: '100%', cursor: loadingLeaveGroup?"not-allowed":'pointer' }} onClick={() => { leaveGroup() }}>
              <p style={{ fontSize: 18, borderBottom: '1px solid black', marginBottom: 10 }}>{loadingLeaveGroup?"Đang rời nhóm...":"Rời nhóm"}</p>
            </div>
            {checkRole() && checkRole() === 'admin' && (
              <div style={{ width: '100%', cursor: 'pointer' }} onClick={() => {deleteGroup()}}>
                <p style={{ fontSize: 18, borderBottom: '1px solid black', marginBottom: 10 }}>Giải tán nhóm</p>
              </div>
            )}
          </div>}
        <div style={{ width: '100%', }}>
          {currentChatType === 'group' &&
            <div>
              <input type="text" onChange={(e) => { searchName(e.target.value) }} placeholder="Tìm kiếm thành viên trong nhóm" style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid black', marginBottom: 10 }} />
              <div style={{ overflowY: 'auto', height: 230 }}>
                {listSearch.map((participant, index) => (
                  <div key={index} style={{ width: '100%', padding: 10, borderRadius: 10, borderBottom: '1px  black', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex' }}>
                      <img src={participant.avatar} alt="avatar-user" style={{ height: 40, width: 40, borderRadius: 50 }} />
                      <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ marginLeft: 10, fontWeight: 'bold' }}>{participant.name}</p>
                      </div>
                      {participant.role === 'admin' && <p style={{ marginLeft: 10, fontWeight: 'bold', color: 'red',display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Quản trị viên</p>}
                    </div>
                    {checkRole()&&checkRole()==='admin'&&
                    <div>
                    {participant.idUser === userId || participant.role==='admin'? null : 
                    <div onClick={() => {
                      setMemberSelected(participant)
                      setIsModalOptionVisible(true)
                    }}>
                      <FontAwesomeIcon icon={faEllipsisH} style={{ marginLeft: 10 }} />
                    </div>}
                  </div>}
                  </div>
                ))
                }
              </div>
            </div>}
          <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
            <button className='btnClose' onClick={() => 
              {
                setIsModalVisible(false)
                setTracking(false)
                setFileAvatar(null)
                setAvt(receiver.avatar)
              }
            }
              style={{
                fontSize: 18,
                color: 'white',
                backgroundColor: '#1CA1C1',
              }}
            >Đóng</button>
            {fileAvatar?
              <button className='btnClose' onClick={() => 
                { 
                  changeAvatarGroup()
                  setTracking(false)
                }
              }
                style={{
                  fontSize: 18,
                  color: 'white',
                  backgroundColor: '#1CA1C1',
                  cursor: loadingChangeAvatar?'not-allowed':'pointer'
                }}
              >{loadingChangeAvatar?'Đang thay đổi ảnh nhóm...':'Đổi ảnh nhóm'}</button> : null
          }
          </div>
        </div>

      </Modal>
      <Modal
        isOpen={isModalAddVisible}
        onRequestClose={() => setIsModalAddVisible(false)}
        contentLabel="Thêm thành viên"
        className="modal-group-option"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            width: 550,
            height: '100%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: 'white',
            
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
          }

        }}
      >
        <div style={{ width: '100%', }}>
          <input type="text" onChange={(e) => { searchNameAdd(e.target.value) }} placeholder="Tìm bạn bè để thêm vào nhóm" style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid black', marginBottom: 10 }} />
          <div style={{ overflowY: 'auto', height: 520 }}>
            {listSearchAdd.filter(participant => !listParticipant.some(p => p.idUser === participant.idUser)).map((participant, index) => (
              <div key={index} style={{ width: '100%', padding: 10, borderRadius: 10, borderBottom: '1px  black', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex' }}>
                  <img src={participant.avatar} alt="avatar-user" style={{ height: 40, width: 40, borderRadius: 50 }} />
                  <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ marginLeft: 10, fontWeight: 'bold', color: 'black'}}>{participant.name}</p>
                  </div>
                </div>
                <div>
                  <input type='checkbox' id={participant.idUser} name={participant.name} value={participant.idUser} className='checkBox' onChange={handleCheckboxChange} />
                </div>
              </div>
            ))
            }
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <button className='btnClose' onClick={() => {
            setSelectedCount(0)
            setSelectedUsers([])
            setIsModalAddVisible(false)
          }}>Hủy</button>
          {selectedCount > 0 && (
            <button onClick={()=>{
              addMemberToGroupChat()
              setSelectedCount(0)
              setSelectedUsers([])
              
            }} style={{ width: 150, backgroundColor: '#1CA1C1', cursor: loadingAddMember?'not-allowed':'pointer'}}>{loadingAddMember?'Đang thêm...':'Thêm'}</button>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={isModalOptionVisible}
        onRequestClose={() => setIsModalOptionVisible(false)}
        contentLabel="Tùy chọn"
        className="modal-group-option"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            width: 350,
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: 'white',
            color: 'black',
            borderRadius: '10px',
            padding: '10px',
            border: 'none',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            marginTop: 200
          }

        }}
      >
        <div style={{ width: '100%', }}>
          <div style={{ width: '100%', cursor: loadingSetAdmin?'not-allowed':'pointer' }} onClick={() => {setAdminForMember()}}>
            <p style={{ fontWeight: 'bold', fontSize: 18, borderBottom: '1px solid black', marginBottom: 10 }}>{loadingSetAdmin?'Đang thăng '+memberSelected.name+"thành QTV":"Thăng làm quản trị viên"}</p>
          </div>
          <div style={{ width: '100%', cursor: 'pointer' }} onClick={() => { handleDeleteMember() }}>
            <p style={{ fontWeight: 'bold', fontSize: 18, borderBottom: '1px solid black', marginBottom: 10 }}>{loadingDeleteMember?'Đang xóa '+memberSelected.name:'Đuổi ra khỏi nhóm'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <button className='btnClose' onClick={() => {
            setIsModalOptionVisible(false)
          }}>Đóng</button>
        </div>
      </Modal>
    </div>
  )
}

export default Messages
