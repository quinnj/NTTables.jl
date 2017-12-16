import React from 'react';
import '../globals.css';
import './index.css';
import TextInput from "../TextInput"

export default function CodeBoxInput({ id, placeholder, value, handleOnBlur, handleOnChange }) {
    return (
        <div className={"CodeBoxInput"}>
            <TextInput id={id} placeholder={placeholder} value={value} handleOnBlur={handleOnBlur} handleOnChange={handleOnChange} />
        </div>
    );
}