import React from 'react';
import Header from '../components/Header/Header';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Footer from '../components/Footer/Footer';
import "./CustomTab.css";
import NFTCharacter from '../components/Marketplace/NFTCharacter';
import CustomToolbar from '../components/CustomToolbar/CustomToolbar';
import "./MyCharacters.css";

export default function MyCharacters(props) {

    return (
        <div className="MyCharacters">
            <Header selected="Marketplace" />
            <div className="mainContent">
                <div className="userInfo">
                    <img src="/image/avatar.png" alt="" />
                    <div className="infoPanel">
                        <div className="userName">user11</div>
                        <div className="buttonGroup">
                            <div className="copyAddressBtn">Copy address
                                <img src="/image/copy.png" alt=""/>
                            </div>
                            <div className="shareBtn">Share
                                <img src="/image/share.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Characters</Tab>
                        <Tab>Bubbles</Tab>
                    </TabList>
                    <TabPanel>
                        <CustomToolbar />
                        <div className="subtitle">4 Characters</div>
                        <div className="characterList">
                            <NFTCharacter type="Common" username="Lenin"/>
                            <NFTCharacter type="Epic" username="Sai"/>
                            <NFTCharacter type="Legendary" username="Stalin"/>
                            <NFTCharacter type="Legendary" username="Stalin"/>
                        </div>
                    </TabPanel>
                    <TabPanel>

                    </TabPanel>
                </Tabs>
            </div>
            <Footer />
        </div>
    )
}

