import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './findFriend.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import User from './../user/user';
import { UserInterface } from '../../interface/Interface'


const findFriend = () => {

    const [name, setName] = useState('')
    const [flag, setFlag] = useState(false)
    const [user, setUser] = useState({})
    const [list, setList] = useState([])

  const [active, setActive] = useState<number>(0)

  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)

  const navigate = useNavigate()
  const userData: UserInterface = useAppSelector((state) => state.user.userInfo)
  const IP_BACKEND = 'https://se-com-be.onrender.com'

const handleNameFriend = async (e:  React.ChangeEvent<HTMLInputElement>) =>{
    e.preventDefault();
    setName(e.target.value)
}

const handleSubmitFindUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault()
  await axios.post(`${IP_BACKEND}/getListUserByName`, {
      name: name,
  }).then((res) => {
    const userIds = userData.listFriend.map(user => user.idUser);
    let data = res.data.data.filter((item) => {
      // bỏ đi item có idUser nằm trong listFriend
      return !userIds.includes(item.idUser);    
    })
      setList(data)
      setFlag(true)
  })
  .catch(() => {
      console.log('Error')
  })
}    

  useEffect(() => {
    //   if(!isLogin) {
    //     navigate('/welcome')
    //   }
    
  }, [])

  return (
    
        <>
          <div className="search-wrapper">
            <input type="text" placeholder='Tìm kiếm...' value={name} onChange={(e) => {handleNameFriend(e)}}/>
            <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} onClick={(e) => {handleSubmitFindUser(e)}}/>
          </div>

          {flag && (list.map((item) => <User user={item}/>))}
        
        </>
  )
}

export default findFriend
