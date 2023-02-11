import React, {useState} from 'react';

import {QRCodeSVG} from 'qrcode.react';
import './QRCode.css'
import ClipLoader from 'react-spinners/ClipLoader';
import AgoraRTC from "agora-rtc-sdk-ng"
import { AgoraVideoPlayer } from "agora-rtc-react";
import AgoraUIKit from 'agora-react-uikit';

function QRcode() 
{
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [participantJoined, setparticipantJoined] = useState(false);
  const [remoteTrack, setremoteTrack] = useState(null);

  const CHANNEL_NAME = 'rtc8108';
  const TOKEN = '007eJxTYHA6GKXduFVt+ev3Ensl586c+dTtq9E9pmf7JnfMfd/38McTBYbUJAvLVHPzRLPkxFQT00RjyxTDZFMTc1NLi6RUC3PLVO5jz5MbAhkZZPW6GBkZIBDEZ2coKkm2MDSwYGAAAK7cIvg='; 
  const APP_ID = 'eb89e77a6cae45a39d1c547598be879e';
  const UID = 0;
  const rtcProps = {
    appId: APP_ID,
    channel: CHANNEL_NAME, // your agora channel
    token: TOKEN, // use null or skip if using app in testing mode
    role: 'audience',
    enableScreensharing: true
  };
  const agoraEngine = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
  agoraEngine.setClientRole('audience');

    React.useEffect( () =>{

        async function fetchData()
      {
      
          await agoraEngine.join(APP_ID, CHANNEL_NAME, TOKEN, UID);
          
          agoraEngine.on('user-joined',async (user)=>
          {
            await agoraEngine.unpublish(agoraEngine.localTracks);
  
            console.log('user joined', user);
            setparticipantJoined(true);
          });

          
        setIsLoading(true);

      setData(CHANNEL_NAME +'-'+TOKEN);
      console.log(`data is ${data}`)
    setIsLoading(false);  
    }
      fetchData();
      }, []);
      
      


    return(
    <div>
    {participantJoined? <div style={{display: 'flex', width: '50vw', height: '100vh'}}> 
    <AgoraUIKit rtcProps={rtcProps} connectionData={agoraEngine.remoteUsers[0]} />

    
    </div>:
    <div  className='QRCodeContainer'>{isLoading?<ClipLoader/>:<QRCodeSVG className='QRCodeStyle' value={data} />}</div>
    }
    
    </div>
    );
}

export default QRcode;