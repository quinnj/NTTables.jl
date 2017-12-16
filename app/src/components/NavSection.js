import React from 'react';
import List from "./List"

export default function NavSection({ id, title, ...props }) {
    return (
        <div id={id} className="NavSection flexcol leftpad">
            <div className="NavTitle">{title}</div>
            <List {...props} />
        </div>
    );
}