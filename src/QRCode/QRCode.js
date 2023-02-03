import React, {useState} from 'react';

import {QRCodeSVG} from 'qrcode.react';

function QRcode() 
{
    
  const [token, setToken] = useState('abc');
  


    React.useEffect( () =>{
        async function fetchData()
      {
       let temp = await fetch('http://localhost:3001/api')
          .then((res) =>{
            let data = res.json();
            return data;
        
        });
      setToken(temp['string']);
        
      }
      fetchData();
      }, []);
      
      


    return(
    <div className='QRCodeContainer'>
    <QRCodeSVG value={token} />,
    </div>
    );
}

export default QRcode;