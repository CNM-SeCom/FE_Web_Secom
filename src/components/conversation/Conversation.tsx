import { ChatInterface } from '../../interface/Interface'
import { setCurrentChatId, setCurrentReceiver } from '../../redux/CurentChatSlice'
import { useAppDispatch, useAppSelector } from '../../redux/Store'
import './Conversation.scss'

interface Props {
  friendId: string,
  setActive: React.Dispatch<React.SetStateAction<string>>,
  active: string,
  name: string,
  avatar: string,
  chats: ChatInterface[],
}

const Conversation = ({ friendId, setActive, active, name, avatar, chats } : Props) => {

  const dispatch = useAppDispatch()
  const userId: string = useAppSelector((state) => state.user.userInfo.idUser)

  const setCurrentChatID = () => {
    chats.forEach((c) => {
      let flag: number = 0

      c.participants.forEach((p) => {
        if(p.idUser === friendId || p.idUser === userId) {
          flag++
        }
        if(p.idUser === friendId) {
          dispatch(setCurrentReceiver(p))
        }
      })

      if(flag === 2) {
        dispatch(setCurrentChatId(c.id))
        flag = 0
      }
    })
  }

  return (
    <div className={`${active === friendId ? 'conversation-wrapper active' : 'conversation-wrapper'}`}
          onClick={() => {
            setActive(friendId)
            setCurrentChatID()
          }}>
      <img src={avatar} alt='avatar-user' />
      <div className="conversation-info">
        <h4>{name}</h4>
        <p>gsdjkljgdslkjglksjkldsjglksdjlkgjdskljgldksjgldfskksdgjl</p>
      </div>
      <div className="time-wrapper">
        <p className='time'>12:34</p>
        <p className='num-of-message'>29</p>
      </div>
    </div>
  )
}

export default Conversation
