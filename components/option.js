import React, { useEffect, useState, useRef } from "react";
import { AiFillCamera, AiFillTool } from "react-icons/Ai";
import { BiPause } from "react-icons/Bi";
import { FaCircle } from "react-icons/Fa";
import { MdOutlineZoomOutMap } from "react-icons/Md";
import { ImCross } from "react-icons/Im";

const Option = ({ videoRef }) => {
  // const videoRef = useRef(null);

  const [show, setShow] = useState(false); 
  const [text, setText] = useState("");

  const handlePlay = () => {
  
    if (videoRef.current) {
      videoRef.current.play();
    }
    setShow(true);
    setText("Play")
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShow(true);
    setText("Pause")
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setShow(true);
    setText("Stop");
  };

  const handleToggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
    setShow(true);
    setText("Full Screen")
  };

  const handleClose = () => {
    if (videoRef.current) {
      window.location.reload();
      setShow(true);
      setText("Close")
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 2500);
  }, [show]); 

  const Chip = ({ text }) => {
    return (
      <>
        <span>{text}</span>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {show && <Chip text={text} />}
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-6 gap-0 sm:w-80 w-44">
          <div
            className="bg-purple-400 hover:bg-purple-500 text-white flex justify-center items-center py-1 px-1"
            onClick={handlePlay}
          >
            <AiFillCamera className="text-xl" />
          </div>

          <div
            className="bg-orange-400 hover:bg-orange-500 text-white flex justify-center items-center py-1 px-1"
            onClick={handlePause}
          >
            <BiPause className="text-2xl" />
          </div>
          <div
            className="bg-red-600 hover:bg-red-700 text-white flex justify-center items-center py-1 px-1"
            onClick={handleStop}
          >
            <FaCircle />
          </div>
          <div
            className="bg-slate-400 hover:bg-slate-500 text-white flex justify-center items-center py-1 px-1"
            onClick={() => {
              /* handle tool icon click */
            }}
          >
            <AiFillTool className="text-xl" />
          </div>
          <div
            className="bg-slate-400 hover:bg-slate-500 text-white flex justify-center items-center py-1 px-1"
            onClick={handleToggleFullScreen}
          >
            <MdOutlineZoomOutMap />
          </div>
          <div
            className="bg-red-600 hover:bg-red-700 text-white flex justify-center items-center py-1 px-1"
           onClick={handleClose}
          >
            <ImCross className="text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Option;

// import React, { useRef, useState } from "react";
// import { AiFillCamera, AiFillTool } from "react-icons/Ai";
// import { BiPause } from "react-icons/Bi";
// import { FaCircle } from "react-icons/Fa";
// import { MdOutlineZoomOutMap } from "react-icons/Md";
// import { ImCross } from "react-icons/Im";

// const Option = () => {

// const videoRef = useRef(null);

//   return (
//     <div className="flex items-center justify-center" style={{ transform: `scale(${zoomLevel})` }}>
//       <div className="grid grid-cols-6 gap-0 sm:w-80 w-44">
//         <div className="bg-purple-400 hover:bg-purple-500 text-white flex justify-center items-center py-1 px-1">
//           <AiFillCamera className="text-xl" />
//         </div>
//         <div className="bg-orange-400 hover:bg-orange-500 text-white flex justify-center items-center py-1 px-1" >
//           <BiPause className="text-2xl" />
//         </div>
//         <div className="bg-red-600 hover:bg-red-700 text-white flex justify-center items-center py-1 px-1">
//           <FaCircle />
//         </div>
//         <div className="bg-slate-400 hover:bg-slate-500 text-white flex justify-center items-center py-1 px-1">
//           <AiFillTool className="text-xl" />
//         </div>
//         <div className="bg-slate-400 hover:bg-slate-500 text-white flex justify-center items-center py-1 px-1" >
//           <MdOutlineZoomOutMap />
//         </div>
//         {isOpen && (
//         <div className="bg-red-600 hover:bg-red-700 text-white flex justify-center items-center py-1 px-1" >
//           <ImCross className="text-sm"  />
//         </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Option;
