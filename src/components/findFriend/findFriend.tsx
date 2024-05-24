import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './findFriend.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/Store'

import axios from 'axios'
import User from './../user/user';
import { UserInterface } from '../../interface/Interface'


const findFriend = () => {

  const [name, setName] = useState('')
  const [flag, setFlag] = useState(false)

  const [list, setList] = useState([])

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
      const userIds = (userData.listFriend as { idUser: string }[]).map(user => user.idUser);
      let data = res.data.data.filter((item: { idUser: string }) => {
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

<!--     <>
      <div className="search-wrapper">
        <input type="text" placeholder='Tìm kiếm...' value={name} onChange={(e) => { handleNameFriend(e) }} />
        <button className='search-icon' onClick={(e) => handleSubmitFindUser(e)}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      {flag && (list.map((item) => <User user={item} />))}

    </> -->
    
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
