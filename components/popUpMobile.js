import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { ImCross } from "react-icons/im";
import { BsCheck } from "react-icons/bs";
import ReactLoading from 'react-loading';
import axios from "axios";

const PopUpMobile = ({  setVisible, setCamName, setIsButtonClicked, color}) => {
  const [cameraName, setCameraName] = useState("");
  const [urlPath, setUrlPath] = useState("");
  const [port, setPort] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  
  const sendMessage = async () => {
    if (cameraName.length && urlPath.length && port.length > 0) {
      if (urlPath.startsWith("rtsp://")) {
        // setUrlPath((prevState) => [...prevState, urlPath]);
        setCamName((prevState) => [...prevState, cameraName]);
        // setPort((prevState) => [...prevState, port]);
      } else {
        alert("Not a valid RTSP url");
      }

      try {
        const rtspUrl = urlPath;
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
    <div className="md:hidden flex items-center justify-center relative z-10">
     {isLoading && ( 
      <div className="absolute -top-[500px] left-[100px] z-50" >
      <ReactLoading type="spinningBubbles" color={color} height={50} width={50}/>
      </div>
      )}
      <div
        className={`fixed top-3 z-10 bg-zinc-800 w-1/2 h flex-col justify-start items-center rounded-md flex-1 px-5 py-4 space-y-5`}
      >
        <div className="flex justify-between items-center ">
          <div className="flex justify-center items-center text-center sm:text-base text-sm font-medium space-x-4  ">
            <GoPlus className="text-xs sm:text-sm" />
            <p>New Monitor</p>
          </div>
          <ImCross
            className="text-zinc-500 w-2 sm:w-3 cursor-pointer"
            onClick={() => setVisible(false)}
          />
        </div>
        <div className="w-full h-[.4px] border border-zinc-700 "></div>
        <div className="flex-1  flex-col justify-center items-center text-center space-y-2 text-sm font-medium sm:space-x-14 space-x-5 mx-3 pt-5 py-5">
          <div className="flex-col justify-center items-center text-start space-y-4 ">
            <p className="sm:text-sm text-xs">Camera Name</p>
            <div className="w-full box-content border border-zinc-700 px-2 py-1 rounded-lg">
              <input
                type="text"
                maxLength={40}
                value={cameraName}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 40);
                  setCameraName(value);
                }}
                placeholder="Eg: Home-Porch"
                className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
              />
            </div>
            <p className="sm:text-sm text-xs">Full URL Path</p>
            <div className="w-full box-content border border-zinc-700 px-2 py-1 rounded-lg">
              <input
                type="text"
                value={urlPath}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setUrlPath(inputValue);
                }}
                placeholder="Eg: rtsp://admin:password@123.123.123.123/stream/1"
                className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
              />
            </div>
            <p className="sm:text-sm text-xs">Port </p>
            <div className="w-full box-content border border-zinc-700 px-2 py-1 rounded-lg">
              <input
                type="number"
                maxLength={4}
                value={port}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 4); // Only keep the first 4 characters
                  setPort(value);
                }}
                placeholder="Eg: 9999"
                className="w-full py-2 rounded-md mix-blend-color-dodge hover:bg-indigo-950 outline-none placeholder-zinc-400 px-5"
              />
            </div>
          </div>
        </div>
       
        <div className="w-full h-[.4px] border border-zinc-700 "></div>
          <button
            className="flex-1 flex justify-center items-center w-32 mix-blend-hard-light bg-teal-500 text-base font-medium py-2 px-3 rounded-md "
            onClick={sendMessage}
          >
            <BsCheck className="text-2xl" />
            <p> Save</p>
          </button>
       
      </div>
    </div>
  );
};

export default PopUpMobile;









