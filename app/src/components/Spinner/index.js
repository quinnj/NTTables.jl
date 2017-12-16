import React from 'react';
import '../globals.css';
import './index.css';

export default function Spinner(props) {
    return <div id="spinner" className="Spinner hidden">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
    </div>
}