import React from 'react';
import { Modal } from 'react-bootstrap';
import "./VideoPlayModal.css";
export default function VideoPlayModal(props) {
    return (
        <Modal show={props.isShow} onHide={props.hideModal} className="videoPlayModal">
            <video controls autoPlay>
                <source src="/image/3.mp4" type="video/mp4"></source>
            </video>
        </Modal>
    );
}