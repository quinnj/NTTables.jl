import React from 'react';
import '../globals.css';
import './index.css';

const identity = x => x

export default function TextInput({ divid = 0, id = 0, required = false, placeholder = "", value = "", handleOnChange, handleOnBlur = identity, handleOnKeyPress = identity}) {
    return (
        <div id={divid} className="TextInput">
            <input
                type="text"
                spellCheck="false"
                data-id={id}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                onKeyPress={handleOnKeyPress}
            />
        </div>
    );
}
