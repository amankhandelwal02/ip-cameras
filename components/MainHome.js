import React from 'react'
import Homee from './Home'
import Sidebar from './Sidebar'

const MainHome = ({setVisible, camName}) => {
  
  return (
    <div className='flex'>
        <Sidebar camName={camName}/>
        <Homee setVisible={setVisible}/>
    </div>
  )
}

export default MainHome