import './Message.scss'
import avatar from  '../../assets/avatar.png'

const Message = () => {
  return (
    <div className='message-wrapper'>
        <img src={avatar} alt="avatar-user" />
        <div className="message-info">
            <div className="mc-header">
                <h4>Triet Kun</h4>
                <p>Ngày 14 tháng 3, 22:22</p>
            </div>
            <p className='message-content'>Greetings, fellow colleagues. I would like to share my insights on this task. I reckon we should deal with at least half of the points in the plan without further delays. I suggest proceeding from one point to the next and notifying the rest of us with at least short notices. This way is best to keep track of who is doing what.</p>
        </div>
    </div>
  )
}

export default Message
