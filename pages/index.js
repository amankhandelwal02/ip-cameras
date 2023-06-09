import { Inter } from "next/font/google";
import MainHome from "../components/mainHome";
import PopUp from "../components/popUp";
import { useState } from "react";
import Cam from "../components/cam";
import { FiPlus } from "react-icons/Fi";
import Sidebar from "../components/sidebar";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [camName, setCamName] = useState([]);
  const [camUrl, setCamUrl] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  return (
    <div className="font-extrabold">
      {!isButtonClicked ? (
        <MainHome setVisible={setVisible} camName={camName} />
      ) : (
        <div className="flex">
          <Sidebar camName={camName}/>
          <div className="grid grid-cols-2 grid-rows-2 gap-0">
          {isButtonClicked && (
            <>
            <Cam/>
            <Cam/>
            <Cam />
            <Cam/>
            </>
          )}
            <div
              className="fixed bottom-1 right-[600px] box-content cursor-pointer duration-700 mx-auto my-10 flex items-center justify-center w-10 h-10 rounded-full p-2 bg-green-900"
              onClick={() => setVisible(true)}>
              <FiPlus className="text-2xl" />
            </div>
          </div>
        </div>
      )}
      {visible && (
        <PopUp
          visible={visible}
          setVisible={setVisible}
          setCamName={setCamName}
          setCamUrl={setCamUrl}
          isButtonClicked={isButtonClicked}
          setIsButtonClicked={setIsButtonClicked}
        />
      )}
    </div>
  );
}
