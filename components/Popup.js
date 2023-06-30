import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { ImCross } from "react-icons/im";
import { BsCheck } from "react-icons/bs";
import ReactLoading from 'react-loading';
import axios from "axios";

const PopUp = ({ setVisible, setCamName, setIsButtonClicked, color }) => {
  const [cameraName, setCameraName] = useState("");
  const [urlPath, setUrlPath] = useState("");
  const [port, setPort] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  function isValidRTSPUrl(url) {
    const rtspUrlPattern = /^(rtsp:\/\/)((\w+):(\w+)@)?([\w.-]+)(:(\d+))?(\/\w+)*\/?$/;
    return rtspUrlPattern.test(url);
  }

  const sendMessage = async () => {
    if (cameraName.length && urlPath.length && port.length > 0) {
      let isValid = isValidRTSPUrl(urlPath);
      let rtspUrl;
      if (isValid) {
        setCamName((prevState) => [...prevState, cameraName]);
        rtspUrl = urlPath;
      } else {
        alert("Not a valid RTSP url, continue?");
      }

      try {
        await axios.post("/api/hls", { rtspUrl: rtspUrl });

        setIsLoading(true);
        setShowLoader(true);

        setTimeout(() => {
          setIsButtonClicked(true);
          setVisible(false);
        }, 7000);

      } catch (error) {
        console.error("Failed to send RTSP URL:", error);
      } finally {
        setShowLoader(false);
      }

    } else {
      alert("Please fill the required fields");
    }
  };
  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    }
  }, [isLoading, setIsLoading]);
  return (
    <div className="hidden md:flex items-center justify-center relative z-10">
      {isLoading && (
        <div className="absolute -top-[500px] left-[700px] z-50" >
          <ReactLoading type="spinningBubbles" color={color} height={50} width={50} />
        </div>
      )}
      <div
        className={`fixed top-3 z-10 bg-zinc-800 w-1/2 h flex-col justify-start items-center rounded-md flex-1 px-5 py-4 space-y-5`}
      >
        <div className="flex justify-between items-center ">
          <div className="flex justify-center items-center text-base font-medium space-x-4  ">
            <GoPlus />
            <p>New Monitor</p>
          </div>
          <ImCross
            className="text-zinc-500 w-3 cursor-pointer"
            onClick={() => setVisible(false)}
          />
        </div>
        <div className="w-full h-[.4px] border border-zinc-700 "></div>
        <div className=" flex justify-start items-center text-sm font-medium sm:space-x-20 space-x-5 mx-3 pt-5 py-10">
          <div className="flex-col justify-center items-center text-start space-y-14">
            <p>Camera Name</p>
            <p>Full URL Path</p>
            <p>Port </p>
          </div>
          <div className="flex-1  flex-col justify-center items-center text-center space-y-5">
            <div className="w-full box-content border border-zinc-700 px-2 py-2 rounded-lg">
              <input
                type="text"
                maxLength={40}
                value={cameraName}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 40);
                  setCameraName(value);
                }}
                placeholder="Example: Home-Porch"
                className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
              />
            </div>
            <div className="w-full box-content border border-zinc-700 px-2 py-2 rounded-lg">
              <input
                type="text"
                value={urlPath}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setUrlPath(inputValue);
                }}
                placeholder="Example: rtsp://admin:password@123.123.123.123/stream/1"
                className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
              />
            </div>
            <div className="w-full box-content border border-zinc-700 px-2 py-2 rounded-lg">
              <input
                type="number"
                maxLength={4}
                value={port}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 4); // Only keep the first 4 characters
                  setPort(value);
                }}
                placeholder="Example: 9999"
                className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
              />
            </div>
          </div>
        </div>
        <div className="w-full h-[.4px] border border-zinc-700 "></div>
        <div>
          <button
            className=" flex justify-center sm:mx-auto mx-32 items-center w-40 mix-blend-hard-light bg-teal-500 text-base font-medium py-3 px-5 rounded-md mt-10"
            onClick={sendMessage}
          >
            <BsCheck className="text-2xl" />
            <p> Save</p>
          </button>
        </div>
      </div>

    </div>
  );
};

export default PopUp;
















// import React, { useState, useEffect } from "react";
// import { GoPlus } from "react-icons/Go";
// import { ImCross } from "react-icons/Im";
// import { BsCheck } from "react-icons/Bs";
// import axios from "axios";

// const PopUp = ({ visible, setVisible, setCamName }) => {
//   // console.log("visible", visible);
//   const [cameraName, setCameraName] = useState("");
//   const [urlPath, setUrlPath] = useState("");
//   const [port, setPort] = useState("");

//   const sendMessage = async () => {
//     if (cameraName.length && urlPath.length && port.length > 0) {
//       setCamName((prevState) => [...prevState, cameraName]);
//       setUrlPath((prevState) => [...prevState, urlPath]);
//       setPort((prevState) => [...prevState, port]);
//       setVisible(false);

//       try {
//         const rtspUrl = urlPath;
//         console.log("object",rtspUrl)
//         await axios.post("/api/server", { params:  rtspUrl  });
//         console.log("RTSP URL sent to the server");
//       } catch (error) {
//         console.error("Failed to send RTSP URL:", error);
//       }
//     } else {
//       alert("Please fill the required fields");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center">
//       <div
//         className={`fixed top-3 z-10 bg-zinc-800 w-1/2 h flex-col justify-start items-center rounded-md flex-1 px-5 py-4 space-y-5`}
//       >
//         <div className="flex justify-between items-center ">
//           <div className="flex justify-center items-center text-base font-medium space-x-4  ">
//             <GoPlus />
//             <p>New Monitor</p>
//           </div>
//           <ImCross
//             className="text-zinc-500 w-3 cursor-pointer"
//             onClick={() => setVisible(false)}
//           />
//         </div>
//         <div className="w-full h-[.4px] border border-zinc-700 "></div>
//         <div className=" flex justify-start items-center text-sm font-medium sm:space-x-20 space-x-5 mx-3 pt-5 py-10">
//           <div className="flex-col justify-center items-center text-start space-y-14">
//             <p>Camera Name</p>
//             <p>Full URL Path</p>
//             <p>Port </p>
//           </div>
//           <div className="flex-1  flex-col justify-center items-center text-center space-y-5">
//             <div className="w-full box-content border border-zinc-700 px-2 py-2 rounded-lg">
//               <input
//                 type="text"
//                 onChange={(e) => {
//                   setCameraName(e.target.value);
//                 }}
//                 placeholder="Example: Home-Porch"
//                 className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
//               />
//             </div>
//             <div className="w-full box-content border border-zinc-700 px-2 py-2 rounded-lg">
//               <input
//                 type="text"
//                 value={urlPath}
//                 onChange={(e) => {
//                   setUrlPath(e.target.value);
//                 }}
//                 placeholder="Example: rtsp://admin:password@123.123.123.123/stream/1"
//                 className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
//               />
//             </div>
//             <div className="w-full box-content border border-zinc-700 px-2 py-2 rounded-lg">
//               <input
//                 type="text"
//                 onChange={(e) => {
//                   setPort(e.target.value);
//                 }}
//                 placeholder="Example: 9999"
//                 className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
//               />
//             </div>
//           </div>
//         </div>
//         <div className="w-full h-[.4px] border border-zinc-700 "></div>
//         {/* <div className="mx-auto flex justify-center items-center w-28"> */}

//         <button
//           className=" flex justify-center sm:mx-auto mx-32 items-center w-40 mix-blend-hard-light bg-teal-500 text-base font-medium py-3 px-5 rounded-md mt-10"
//           onClick={sendMessage}
//         >
//           <BsCheck className="text-2xl" />
//           <p> Save</p>
//         </button>

//         {/* </div> */}
//       </div>
//     </div>
//   );
// };

// export default PopUp;

// import React, { useState, useEffect } from "react";
// import { GoPlus } from "react-icons/Go";
// import { ImCross } from "react-icons/Im";
// import { BsCheck } from "react-icons/Bs";
// import axios from "axios";

// const PopUp = ({ visible, setVisible, setCamName }) => {
//   // console.log("visible", visible);
//   const [cameraName, setCameraName] = useState("");
//   const [urlPath, setUrlPath] = useState("");
//   const [port, setPort] = useState("");

//   const sendMessage = async () => {
//     if (cameraName.length && urlPath.length && port.length > 0) {
//       setCamName((prevState) => [...prevState, cameraName]);
//       setUrlPath((prevState) => [...prevState, urlPath]);
//       setPort((prevState) => [...prevState, port]);
//       setVisible(false);

//       try {
//         const rtspUrl = urlPath;
//         console.log("object",rtspUrl)
//         await axios.post("/api/server", { params:  rtspUrl  });
//         console.log("RTSP URL sent to the server");
//       } catch (error) {
//         console.error("Failed to send RTSP URL:", error);
//       }
//     } else {
//       alert("Please fill the required fields");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center">
//       <div
//         className={`fixed top-3 z-10 bg-zinc-800 w-1/2 h flex-col justify-start items-center rounded-md flex-1 px-5 py-4 space-y-5`}
//       >
//         <div className="flex justify-between items-center ">
//           <div className="flex justify-center items-center text-base font-medium space-x-4  ">
//             <GoPlus />
//             <p>New Monitor</p>
//           </div>
//           <ImCross
//             className="text-zinc-500 w-3 cursor-pointer"
//             onClick={() => setVisible(false)}
//           />
//         </div>
//         <div className="w-full h-[.4px] border border-zinc-700 "></div>
//         <div className=" flex justify-start items-center text-sm font-medium sm:space-x-20 space-x-5 mx-3 pt-5 py-10">
//           <div className="flex-col justify-center items-center text-start space-y-14">
//             <p>Camera Name</p>
//             <p>Full URL Path</p>
//             <p>Port </p>
//           </div>
//           <div className="flex-1  flex-col justify-center items-center text-center space-y-5">
//             <div className="w-full box-content border border-zinc-700 px-2 py-2 rounded-lg">
//               <input
//                 type="text"
//                 onChange={(e) => {
//                   setCameraName(e.target.value);
//                 }}
//                 placeholder="Example: Home-Porch"
//                 className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
//               />
//             </div>
//             <div className="w-full box-content border border-zinc-700 px-2 py-2 rounded-lg">
//               <input
//                 type="text"
//                 value={urlPath}
//                 onChange={(e) => {
//                   setUrlPath(e.target.value);
//                 }}
//                 placeholder="Example: rtsp://admin:password@123.123.123.123/stream/1"
//                 className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
//               />
//             </div>
//             <div className="w-full box-content border border-zinc-700 px-2 py-2 rounded-lg">
//               <input
//                 type="text"
//                 onChange={(e) => {
//                   setPort(e.target.value);
//                 }}
//                 placeholder="Example: 9999"
//                 className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
//               />
//             </div>
//           </div>
//         </div>
//         <div className="w-full h-[.4px] border border-zinc-700 "></div>
//         {/* <div className="mx-auto flex justify-center items-center w-28"> */}

//         <button
//           className=" flex justify-center sm:mx-auto mx-32 items-center w-40 mix-blend-hard-light bg-teal-500 text-base font-medium py-3 px-5 rounded-md mt-10"
//           onClick={sendMessage}
//         >
//           <BsCheck className="text-2xl" />
//           <p> Save</p>
//         </button>

//         {/* </div> */}
//       </div>
//     </div>
//   );
// };

// export default PopUp;
