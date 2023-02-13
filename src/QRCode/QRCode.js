import React from 'react';

import {QRCodeSVG} from 'qrcode.react';
import './QRCode.css'
import ClipLoader from 'react-spinners/ClipLoader';
import AgoraRTC from "agora-rtc-sdk-ng"
import AgoraUIKit from 'agora-react-uikit';
import axios from 'axios';

class QRcode extends React.Component 
{
  //This is the main component that renders QR COde and video view
    constructor(props)
    {
      //initialization of all the attributes
      super(props);
      this.agoraEngine = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
      this.agoraEngine.setClientRole('audience');
      this.APP_ID = 'eb89e77a6cae45a39d1c547598be879e';

      this.agoraEngine.on('user-joined',async (user)=>
  {
    //Triggers when a user joins

    //The web-end removes its audio & vide streams
    await this.agoraEngine.unpublish(this.state.agoraEngine.localTracks);

    console.log('user joined', user);
    this.setState({participantJoined: true});
  });

  this.agoraEngine.on('user-left',async (user)=>
  {
    //Triggers when user leaves
    this.setState({participantJoined: false});
    // reloadQR();
  });
    
    this.state={
      data: '',
      isLoading: false,
      participantJoined:false,
      CHANNEL_NAME:'rtc8108',
      TOKEN: null,
      UID: 0,
      rtcProps:{},
    };
  }
  async componentDidMount()
  {
    //initialize loading of QR
   await  this.reloadQR();
  }

  generateChannelName()
  {
    //this function will generate a random channel name of length 7

    let channelName = '';
    let length = 7; //length of channel name
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
    channelName += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
}
    return channelName;
  }

  async reloadQR()
  { 
    //generate new channel name
    let channelName = this.generateChannelName();

    //change state of loader and assigne channel name
   this.setState({isLoading: true,CHANNEL_NAME: channelName},async ()=>
   {
    //once channel name is assigned enter here
    console.log(`CHANNEELLL NNNAAMMMEEE ISSSS ${this.state.CHANNEL_NAME}`);
    
    //make api call to generate new token
    await axios
    .get(`http://localhost:3001/rtc/${this.state.CHANNEL_NAME}/audience/userAccount/${this.state.UID.toString()}`)
    .then(res=>{
      let  newToken = res.data;

      //set new token value
      this.setState({TOKEN: newToken['rtcToken']},()=>
      {
        //when token is set, load QR with data
        this.setState({data: this.state.CHANNEL_NAME +'-'+this.state.TOKEN},async ()=>
      {
        //assign rtcProps
        Object.assign(this.state.rtcProps,{
          appId: this.APP_ID, //your app id
          channel: this.state.CHANNEL_NAME, // your agora channel
          token: this.state.TOKEN, // use null or skip if using app in testing mode
          role: 'audience',//role of client
          enableScreensharing: true //always true 
        });

        console.log('obj data is ',this.state.rtcProps);

        //joining the channels with the parameters defined above
        await this.agoraEngine.join(this.APP_ID, this.state.CHANNEL_NAME, this.state.TOKEN, this.state.UID);

        this.setState({isLoading:false});
        console.log(`data is ${this.state.data}`);
      });
      });
      
    }
      
      );
   });

  }
 
      render(){
    // return (<div  className='QRCodeContainer'>
    // {this.state.participantJoined? <div style={{display: 'flex', width: '20vw', height: '100vh'}}> 
    // <AgoraUIKit rtcProps={this.state.rtcProps} connectionData={this.agoraEngine.remoteUsers[0]} />

    
    // </div>:
    // <div  className='QRCodeContainer'>{this.state.isLoading?<ClipLoader/>:
    
    // <div>
    //   <h1>Scan the QR to start sharing screen  {this.state.CHANNEL_NAME}</h1>
    // <QRCodeSVG className='QRCodeStyle' value={this.state.data} />
    
    // </div>
    // }
    
    // </div>
    // }
    
    // </div>);

    return(<div className='QRCodeContainer'>
<div style={{display: 'flex', width: '50vw', height: '100vh'}}> 
     <AgoraUIKit rtcProps={this.state.rtcProps} connectionData={this.agoraEngine.remoteUsers[0]} />
     <label>{this.state.CHANNEL_NAME}</label>
     <QRCodeSVG className='QRCodeStyle' value={this.state.data} />
    </div>

    </div>);
    
  }
}

export default QRcode;