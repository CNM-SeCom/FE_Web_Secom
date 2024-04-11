import './Message.scss'
import { useAppSelector } from '../../redux/Store'
import { FriendInterface } from '../../interface/Interface'

interface Props {
  message: {}
}

const Message = ({message}: Props) => {

  const receiver: FriendInterface = useAppSelector((state) => state.currentChat.receiver)
  const user : FriendInterface = useAppSelector((state) => state.user.userInfo)
  let info 
  let messageClass
  let formattedDate
if(message.createdAt){
  const date = new Date(message.createdAt);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  formattedDate= `${day}/${month}/${year} ${hours}:${minutes}`;
}
else{
  formattedDate="Đang gửi..."
}
  let messageContent: JSX.Element | null = null;
  if(user.idUser === message.user.idUser){
    info = user
    messageClass = 'user-message'
  }
  else{
    info = receiver
    messageClass = 'receiver-message'
  }
  switch (message.type) {
    case 'text':
      messageContent = <p className="message-content">{message.text}</p>;
      break;
    case 'image':
      messageContent = <img src={message.image} alt="message-image" className="message-image" />;
      break;
      case 'video':
      messageContent = <video src={message.video} controls className="message-video" />;
      break;
      case 'file':
      messageContent = <a href={message.file}>{message.text}</a>
        break;
    
    default:
      break;
  }


  return (
    <div className={`message-wrapper ${messageClass}`}>
        <img src={info.avatar} alt="avatar-user" className='user-image' />
        <div className="message-info">
            <div className="mc-header">
                <h4>{info.name}</h4>
                <p>{formattedDate}</p>
            </div>
            {messageContent}

        </div>
    </div>
  )
}

export default Message
