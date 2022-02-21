import React from 'react';
import "./NFTCharacter.css";
import { Link } from 'react-router-dom';
export default function NFTCharacter(props) {
    return(
        <Link className={"NFTCharacter " + props.type} to="/Marketplace/sai">
            <img src={"/image/" + props.username.toLowerCase() + "2.png"} />
            <div className="userId">#421</div>
            <div className="userName">{props.username}</div>
            <div className="bottom">
                <div className={props.type}>{props.type}</div>
                <div className="price">0.084ETH</div>
            </div>
        </Link>
    );
}