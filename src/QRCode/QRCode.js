import React, {useState} from 'react';

import {QRCodeSVG} from 'qrcode.react';
import './QRCode.css'
import ClipLoader from 'react-spinners/ClipLoader';
      import Video from 'twilio-video';
      import jwt_decode from "jwt-decode";
      import ReactPlayer from 'react-player'

function QRcode() 
{
    
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [track, setTrack] = useState(null);
  const [participantJoined, setparticipantJoined] = useState(false);
  
  


    React.useEffect( () =>{
        async function fetchData()
      {
        setIsLoading(true);
       let temp = await fetch('http://localhost:3001/api')
          .then((res) =>{
            var data = res.json();
            console.log('resjson is ',data)
            
            return data;
        
        });
        ;
      setToken(JSON.stringify(temp)); 
            console.log('token is is ',temp.accessTokenReceiver)

                 await Video.connect(temp.accessTokenReceiver, { name: temp.roomName}).then(room => {
                  room.localParticipant.audioTracks.forEach(publication => {
                    publication.unpublish();
                    publication.track.stop();
                  });
                  
                  room.localParticipant.videoTracks.forEach(publication => {
                    publication.unpublish();
                    publication.track.stop();
                  });
                  console.log(`Successfully joined a Room: ${room}`);
                  room.once('participantDisconnected', participant => {
                    setparticipantJoined(false);
                    console.log(`Participant "${participant.identity}" has disconnected from the Room`);
                  });
        room.on('participantConnected', participant => {
          setparticipantJoined(true);
          console.log(`A remote Participant connected: ${participant}`);
          participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
              console.log('i am subscribed');
              const track = publication.track;
              setTrack(track);
              
          //     // document.getElementById('remote-media-div').appendChild(track.attach());
            }
          })
        });
      }, error => {
        console.error(`Unable to connect to Room: ${error.message}`);
      });
      
    setIsLoading(false);  
    }
      fetchData();
      }, []);
      
      


    return(
    <div>
    {participantJoined?<div className='videoContainer'>
      {/* <video width="750" height="500" controls >
     {track}  */}
     {/* <ReactPlayer url={track} playing/> */}
     {track.attach()}
     {/* <source src={track} type="video/mp4"/> */}
{/* </video> */}
</div>:
    <div  className='QRCodeContainer'>{isLoading?<ClipLoader/>:<QRCodeSVG className='QRCodeStyle' value={token} />}</div>
    }
    
    </div>
    );
}

export default QRcode;