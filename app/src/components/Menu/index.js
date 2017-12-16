import React from 'react';
import '../globals.css';
import './index.css';

function MenuItem({inner}) {
    return <div className="MenuItem">{inner}</div>
}

function MenuText({text}) {
    return <div className="MenuText">{text}</div>
}

export default function Menu({ id, inner, menuItems = [], handleOnMenuClick }) {
    return (
        <div className="Menu highlight" tabIndex="0" data-id={id} onClick={handleOnMenuClick}>
            {typeof inner === "string" ? <MenuText text={inner} /> : inner}
            <div className="MenuItems flexcol">
                {menuItems.map((x, i) => <MenuItem key={i} inner={x} />)}
            </div>
        </div>
    );
}
