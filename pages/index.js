import { Inter } from 'next/font/google'
import MainHome from '../component/mainHome'
import PopUp from '../component/popUp'
import { useState } from 'react'
import Cam from '../component/cam'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [visible, setVisible] = useState(false)
  const [camName,setCamName]=useState([]);
  const [camUrl, setCamUrl] = useState("");
  
  return (
 
   <div className='font-extrabold'>
   
	 <MainHome setVisible={setVisible} camName={camName}/>
	 {visible && (
	 <PopUp visible={visible} setVisible={setVisible} setCamName={setCamName} setCamUrl={setCamUrl}/>
	 )}
	 {/* {camUrl.length > 0 && ( */}
	 <Cam rtspUrl={camUrl}/> 
	 {/* )} */}
   </div>
  )
}

