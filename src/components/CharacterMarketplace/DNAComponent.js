import React from 'react';

export default function DNAComponent(props) {
    return (
        <div className="DNAComponent">
            <div className="section1">
                <img src={"/image/" + props.icon + ".png"} alt="" />
                <div className="dnaName">{props.dnaName}</div>
            </div>
            <div className="dnaCardano">{props.dnaCardano}</div>
            <div className="dnaPlasma">{props.dnaPlasma}</div>
        </div>
    )
}