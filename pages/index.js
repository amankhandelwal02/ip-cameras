import { Inter } from "next/font/google";
import MainHome from "../components/MainHome";
import PopUp from "../components/Popup";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import LiveStreamPage from "../components/LiveStream";
import PopUpMobile from "../components/PopUpMobile";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // POPUP
  const [visible, setVisible] = useState(false);
  const [camName, setCamName] = useState([]);
  const [camUrl, setCamUrl] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  //POPUPMOBILE
  const [isVisible, setIsVisible] = useState(false);
  // const [camName, setCamName] = useState([]);
  const [isCamUrl, setIsCamUrl] = useState("");
  const [ButtonClicked, setButtonClicked] = useState(false);

  return (
    <div className="font-extrabold">
       {!isButtonClicked ? (
        <MainHome setVisible={setVisible} camName={camName} />
      ) : (
        <div className="flex">
          <Sidebar camName={camName} />
          <div>
            {isButtonClicked && (
              <>
                <LiveStreamPage />
            
              </>
            )}
            <div
              className="fixed bottom-1 right-[600px] box-content cursor-pointer duration-700 mx-auto my-10 flex items-center justify-center w-10 h-10 rounded-full p-2 bg-teal-500 mix-blend-hard-light"
              onClick={() => setVisible(true)}
            >
              <FiPlus className="text-2xl" />
            </div>
          </div>
        </div>
      )}

      {visible && (
        <>
          <PopUp
            visible={visible}
            setVisible={setVisible}
            setCamName={setCamName}
            setCamUrl={setCamUrl}
            isButtonClicked={isButtonClicked}
            setIsButtonClicked={setIsButtonClicked}
          />

          <PopUpMobile
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            setCamName={setCamName}
            setIsCamUrl={setIsCamUrl}
            ButtonClicked={ButtonClicked}
            setButtonClicked={setButtonClicked}
          />
        </>
      )}
      {/* <VideoTimeline /> */}
    </div>
  );
}





















// import { Inter } from "next/font/google";
// import MainHome from "../components/mainHome";
// import PopUp from "../components/popUp";
// import { useState } from "react";
// import { FiPlus } from "react-icons/Fi";
// import Sidebar from "../components/sidebar";
// import LiveStreamPage from "../components/LiveStream";
// const inter = Inter({ subsets: ["latin"] });

// export default function Home() {
//   const [visible, setVisible] = useState(false);
//   const [camName, setCamName] = useState([]);
//   const [camUrl, setCamUrl] = useState("");
//   const [isButtonClicked, setIsButtonClicked] = useState(false);
//   return (
//     <div className="font-extrabold">
//       <MainHome setVisible={setVisible} camName={camName} />

//           {/* <div
//             className="fixed bottom-1 right-[600px] box-content cursor-pointer duration-700 mx-auto my-10 flex items-center justify-center w-10 h-10 rounded-full p-2 bg-teal-500 mix-blend-hard-light"
//             onClick={() => setVisible(true)}
//           >
//             <FiPlus className="text-2xl" />
//           </div> */}

//       {visible && (
//         <PopUp
//           visible={visible}
//           setVisible={setVisible}
//           setCamName={setCamName}
//           setCamUrl={setCamUrl}
//           isButtonClicked={isButtonClicked}
//           setIsButtonClicked={setIsButtonClicked}
//         />
//       )}
//     </div>
//   );
// }
