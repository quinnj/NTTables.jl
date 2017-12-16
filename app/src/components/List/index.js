import React from 'react';
import '../globals.css';
import './index.css';
import TextInput from "../TextInput"
import Button from "../Button.js"
import Menu from "../Menu"
import search from "../images/search.svg"

function SearchBar(props) {
    return (
        <div className="SearchBar flexrow bottompad">
            <img className="SearchIcon" src={search} style={{width: 16}}/>
            <TextInput {...props}/>
        </div>
    );
}

function ListItem({id, inner, handleOnDragStart, handleOnDragOver, handleOnDragLeave, handleOnDrop, handleOnClick}) {
    return (
        <div className="ListItem"
            data-id={id}
            draggable="true"
            onDragStart={handleOnDragStart}
            onDragOver={handleOnDragOver}
            onDragLeave={handleOnDragLeave}
            onDrop={handleOnDrop}
            onClick={handleOnClick}
        >
            {inner}
        </div>
    )
}

export function ListItemText({ text }) {
    return <div className="ListItemText">{text}</div>
}

// props
    // searchProps: {id: 0, required: false, placeholder: "", value: "",
    //                  handleOnChange: func, handleOnBlur: func, handleOnKeyDown: func}
    // listItems: list of components to be rendered inside each ListItem
    // listItemsProps: {handleOnDragStart: func, handleOnDragOver: func, handleOnDragLeave: func, handleOnDrop: func, handleOnClick: func,}
    // buttonProps: {text: 'DONE', handleOnClick: func}
    // menuProps: {menuItems: [], handleOnMenuClick: func}
export default function List({searchProps, listItems, listItemProps, buttonProps, menuProps, extraMenu = null}) {
    return (
        <div className="List flexcol bottompad">
            <SearchBar {...searchProps}/>
            <div className="ListItemsWrapper">
                <div className="ListItems bottompad">
                    {listItems.map((inner, i) => <ListItem key={i} id={inner.id} inner={inner.inner} {...listItemProps} />)}
                </div>
                {extraMenu}
            </div>
            <Menu inner={<Button {...buttonProps}/>} {...menuProps}/>
        </div>
    );
}
