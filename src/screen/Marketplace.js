import React from 'react';
import Header from '../components/Header/Header';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Footer from '../components/Footer/Footer';
import "./CustomTab.css";
import NFTCharacter from '../components/Marketplace/NFTCharacter';
import CustomToolbar from '../components/CustomToolbar/CustomToolbar';
export default function Marketplace() {
    return (
        <div className="Marketplace">
            <Header selected="Marketplace" />
            <div className="mainContent">
                <div className="title">Marketplace</div>
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