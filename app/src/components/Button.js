import React from 'react';
import './globals.css';

const identity = x => x

export default function Button({id, text = "", style = null, handleOnClick = identity}) {
    return (
        <div data-id={id} className="Button highlight leftpad" style={style} onClick={handleOnClick}>
            {text}
        </div>
    );
}