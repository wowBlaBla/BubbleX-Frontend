import React from 'react';
import { Modal } from 'react-bootstrap';
import "./MakeCharacterModal.css";
export default function MakeCharacterModal(props) {
    return (
        <Modal show={props.isShow} onHide={props.hideModal} className="makeCharacterModal">
            <div className="title">Get 3D Character</div>
            <div className="convert3D">
                <div className="selectCharacter">
                    <img src="/image/selectCharacter.png" alt="" />
                </div>
                <img src="/image/convert.png" alt="" />
                <div className="convertedCharacter">
                    <div className="text">Your 3D Character</div>
                </div>
            </div>
            <div className="content1">
                <div className="text">Transactiong gas cost</div>
                <div className="tokenValue">0.0215 $SLM</div>
            </div>
            <div className="content1">
                <div className="text">Duration</div>
                <div className="duration">3 days</div>
            </div>
            <div className="bottom">
                <div className="acceptBtn" onClick={props.hideModal}>Accept</div>
            </div>
            <img src="/image/close.png" alt="" onClick={props.hideModal}/>
        </Modal>
    )
}