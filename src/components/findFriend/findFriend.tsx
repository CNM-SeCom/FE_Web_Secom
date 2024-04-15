import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './findFriend.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import User from './../user/user';

const findFriend = () => {

    const [name, setName] = useState('')
    const [flag, setFlag] = useState(false)
    const [user, setUser] = useState({})
    const [list, setList] = useState([])

  const [active, setActive] = useState<number>(0)

  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)

  const navigate = useNavigate()

const handleNameFriend = async (e:  React.ChangeEvent<HTMLInputElement>) =>{
    e.preventDefault();
    setName(e.target.value)
}

const handleSubmitFindUser = async (e: React.KeyboardEvent<HTMLInputElement>) => {
  e.preventDefault()
  await axios.post('http://localhost:3000/getListUserByName', {
      name: name,
  }).then((res) => {
      setList(res.data.data)
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
            <input type="text" placeholder='Tìm kiếm...' value={name} onChange={(e) => {handleNameFriend(e)}} onKeyPress={(e) => {(e.key === 'Enter' ? handleSubmitFindUser(e) : null)}}/>
            <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
          </div>

          {flag && (list.map((item) => <User user={item}/>))}
        
        </>
  )
}

export default findFriend
