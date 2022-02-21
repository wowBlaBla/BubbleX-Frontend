import React from 'react';
import { Modal } from 'react-bootstrap';
import CustomToolbar from '../CustomToolbar';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import "../../screen/CustomTab.css";
import "./SelectCharacterModal.css";
import NFTCharacter from '../Marketplace/NFTCharacter';
export default function SelectCharacterModal(props) {
    return (
        <Modal show={props.isShow} onHide={props.hideModal} className="SelectCharacterModal">
            <img src="/image/close.png" alt="" onClick={props.hideModal} />
            <div className="title">Select a Character to breed</div>
            <div className="subTitle">Parents and siblings can’t be bred together</div>
            <Tabs>
                <TabList>
                    <Tab>Characters</Tab>
                    <Tab>Bubbles</Tab>
                </TabList>
                <TabPanel>
                    <CustomToolbar />
                    <div className="subtitle">4 Characters</div>
                    <div className="characterList">
                        <NFTCharacter type="Common" username="Lenin" />
                        <NFTCharacter type="Epic" username="Sai" />
                        <NFTCharacter type="Legendary" username="Stalin" />
                        <NFTCharacter type="Legendary" username="Stalin" />
                        <NFTCharacter type="Common" username="Lenin" />
                        <NFTCharacter type="Epic" username="Sai" />
                        <NFTCharacter type="Legendary" username="Stalin" />
                        <NFTCharacter type="Legendary" username="Stalin" />
                    </div>
                </TabPanel>
                <TabPanel>

                </TabPanel>
            </Tabs>
        </Modal>
    )
}