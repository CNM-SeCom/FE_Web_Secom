import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './findFriend.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/Store'

import axios from 'axios'
import User from './../user/user';
import { UserInterface } from '../../interface/Interface'
import { useRef } from 'react';


const findFriend = () => {

  const [name, setName] = useState('')
  const [flag, setFlag] = useState(false)

  const [list, setList] = useState([])
  const inputRef = useRef<HTMLInputElement>(null);

  const userData: UserInterface = useAppSelector((state) => state.user.userInfo)
  const IP_BACKEND = 'https://se-com-be.onrender.com'

  const handleNameFriend = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e.target.value)
  }

  const handleSubmitFindUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    await axios.post(`${IP_BACKEND}/getListUserByName`, {
      name: name,
    }).then((res) => {
      //bỏ đi chính mình
      const data = res.data.data.filter((user: UserInterface) => user.idUser !== userData.idUser);
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
    if (inputRef.current) {
      inputRef.current.focus();
    }

  }, [])

  return (

      // <div className="search-wrapper">
      //   <input type="text" placeholder='Tìm kiếm...' value={name} onChange={(e) => { handleNameFriend(e) }} />
      //   <button className='search-icon' onClick={(e) => handleSubmitFindUser(e)}>
      //     <FontAwesomeIcon icon={faMagnifyingGlass} />
      //   </button>
      // </div>

      // {flag && (list.map((item) => <User user={item} />))}
    
        <>
          <div className="search-wrapper">
            <input ref={inputRef} type="text" placeholder='Tìm kiếm...' value={name} onChange={(e) => {handleNameFriend(e)}} onKeyPress={(e) => {(e.key === 'Enter' ? handleSubmitFindUser(e) : null)}} />
            <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
          </div>

          {flag && (list.map((item) => <User user={item}/>))}
        
        </>
  )
}

export default findFriend
