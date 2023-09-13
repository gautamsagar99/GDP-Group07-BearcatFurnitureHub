import React from 'react';

function ImageComponent(props) {
    const imageSize = {
        width: '500px', 
        height: '200px', 
      };

  return <img src={props.src} alt={props.alt} style={imageSize}/>;
}

export default ImageComponent;
