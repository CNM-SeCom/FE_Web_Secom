import './Conversation.scss'
import avatar from '../../assets/avatar.png'

interface Props {
  id: number,
  setActive: React.Dispatch<React.SetStateAction<number>>,
  active: number,
}

const Conversation = ({ id, setActive, active } : Props) => {

  return (
    <div className={`${active === id ? 'conversation-wrapper active' : 'conversation-wrapper'}`} onClick={() => {setActive(id)}}>
      <img src={avatar} alt='avatar-user' />
      <div className="conversation-info">
        <h4>Triet Kun</h4>
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
