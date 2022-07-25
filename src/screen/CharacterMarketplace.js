import React from 'react';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import DNAComponent from '../components/CharacterMarketplace/DNAComponent';
import HistoryComponent from '../components/CharacterMarketplace/HistoryComponent';
import CustomCalendar from "../components/CharacterMarketplace/CustomCalendar";
import MakeCharacterModal from '../components/CharacterMarketplace/MakeCharacterModal';
import SelectCharacterModal from '../components/CharacterMarketplace/SelectCharacterModal';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Chart } from "react-charts";
import UseDemoConfig from "../config/useDemoConfig";
import ResizableBox from "../config/ResizableBox";
// import CanvasJSChart from '../components/canvaschart/canvasjs.react';
// import ReactApexChart from "../components/apexcharts/apexcharts";
import "./CustomTab.css";
import { setIsMate } from "../actions/projectSetting";
import TokenChartComponent from '../components/CharacterMarketplace/TokenChartComponent';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
function CharacterMarketplace(props) {
    const [btnIndex, setBtnIndex] = useState(0);
    const [calendarShow, setCalendarShow] = useState(false);
    const [showMakeCharacterModal, setShowMakeCharacterModal] = useState(false);
    const [showSelectCharacterModal, setShowSelectCharacterModal] = useState(false);
    const [startPrice, setStartPrice] = useState(0.15);
    const [endPrice, setEndPrice] = useState(0.15);
    const [duration, setDuration] = useState(1);
    const [showTutorial, setShowTutorial] = useState(0);
    const [buttonIndex, setButtonIndex] = useState(0);

    const calendarRef = useRef(null);

    useEffect(() => {
        if (props.projectSetting.isMate) {
            setBtnIndex(1);
            props.setIsMate(false);
        }
    }, [props.projectSetting.isMate]);

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setCalendarShow(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [calendarRef]);
    const onSetShowMakeCharacterModal = () => {
        setShowMakeCharacterModal(!showMakeCharacterModal);
    }

    const onSetShowSelectCharacterModal = () => {
        setShowSelectCharacterModal(!showSelectCharacterModal);
    }
    const onSetDate = (date) => {
        console.log(date);
        setDuration(Math.ceil((new Date(date) - new Date()) / (1000 * 3600 * 24)));
        setCalendarShow(false);
    }
    const fixNumber = (value) => {
        return parseFloat(parseInt(value * 100)) / 100;
    }

    return (
        <div className="CharacterMarketplaceScreen">
            <Header selected="Marketplace" />
            <div className={"modal-backdrop CharacterMarketplaceScreenTutorial " + (showTutorial == 0 ? "done" : "")}></div>
            {btnIndex == 1 ?
                <div className="mateContent">
                    <div className="content">
                        <div className="title">Mate Characters</div>
                        <div className="text">These two lovely Characters will soon be parents!</div>
                        <div className="heartGroup">
                            <img src="/image/heart_left.png" alt="" />
                            <img src="/image/heart1.png" alt="" />
                            <img src="/image/heart_right.png" alt="" />
                        </div>
                        <div className="charaterGroup">
                            <div className="characterItem">
                                <img src="/image/sai1.png" alt="" />
                                <div className="userId">#421</div>
                                <div className="name">Lenin</div>
                                <div className="commonBtn">Common</div>
                                <img src="/image/male.png" alt="" />
                            </div>
                            <div className="characterItem1" onClick={onSetShowSelectCharacterModal} >
                                <img src="/image/plus.png" alt="" />
                                <div className="text">Select your Character</div>
                                <img src="/image/female.png" alt="" />
                            </div>
                        </div>
                        <div className="tokenContent">
                            <div className="title">Mating fee</div>
                            <div className="value">0.0215 $SLM</div>
                        </div>
                        <div className="tokenContent">
                            <div className="title">Transactiong gas cost</div>
                            <div className="value">0.00543 $SLM</div>
                        </div>
                        <div className="tokenContent tokenContent1">
                            <div className="title">Total</div>
                            <div className="value">0.0215 $SLM</div>
                        </div>
                        <div className="detail">This is our best estimation. By clicking the button below, you will be prompted with the final transaction costs.</div>
                        <div className="confirmBtn" onClick={() => { setBtnIndex(0); setButtonIndex(0) }}>Okay, let them be alone for a while</div>
                    </div>
                </div>
                :
                <div className="characterContent">
                    {btnIndex != 2 ? <div><div className="userId">#421</div>
                        <div className="name">Sai</div>
                        <div className="epicBtn">Epic</div></div> :
                        <div className="selltitle">Buy</div>
                    }
                    <div className="content">
                        {btnIndex == 2 ?
                            <div className="sellContent">

                                <div className={"inputContent " + (showTutorial == 4 ? "tutorial" : "")}>
                                    <div className="content1">
                                        <div className="text">Enter Start Price</div>
                                        <div className="inputGroup">
                                            <input type="text" value={startPrice} onChange={(e) => setStartPrice(e.target.value)} />
                                            <div className="inputControl">
                                                <div className="inputUp" onClick={() => setStartPrice(fixNumber(startPrice + 0.01))}></div>
                                                <div className="inputDown" onClick={() => setStartPrice(fixNumber(startPrice - 0.01))}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content1">
                                        <div className="text">Enter End Price</div>
                                        <div className="inputGroup">
                                            <input type="text" value={endPrice} onChange={(e) => setEndPrice(e.target.value)} />
                                            <div className="inputControl">
                                                <div className="inputUp" onClick={() => setEndPrice(fixNumber(endPrice + 0.01))}></div>
                                                <div className="inputDown" onClick={() => setEndPrice(fixNumber(endPrice - 0.01))}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content1 content2">
                                        <div className="text">Duration</div>
                                        <div className="inputGroup">
                                            <div className="">
                                                <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} />
                                                <img src="/image/Calendar.png" alt="" onClick={() => setCalendarShow(true)} />
                                            </div>
                                            <div className="inputControl">
                                                <div className="inputUp" onClick={() => setDuration(fixNumber(duration + 1))}></div>
                                                <div className="inputDown" onClick={() => setDuration(fixNumber(duration - 1))}></div>
                                            </div>
                                            {calendarShow ? <CustomCalendar onSetDate={onSetDate} calendarRef={calendarRef} /> : ""}
                                        </div>
                                    </div>
                                    {showTutorial == 4 ? <div className="tutorialPanel">
                                        <div className="arrow"></div>
                                        <div className="title">Auction</div>
                                        <div className="text">To start the auction, you are setting three values. The price will change from “Start price” to “End price” during the “Duration” time. After the duration expires, the auction WILL NOT end authomatically, but the price will not change anymore. The auction ends when the character is removed from auction by you (it costs gas) or when another player agrees and buys/mates the character</div>
                                        <div className="btnGroup">
                                            <div className="nextBtn" onClick={() => setShowTutorial(0)}>Got it</div>
                                        </div>
                                    </div> : <></>}
                                </div>
                                <div className="content1">
                                    <div className="cancelBtn" onClick={() => { setBtnIndex(0); setButtonIndex(0) }}>Cancel</div>
                                    <div className="confirmBtn" onClick={() => { setBtnIndex(0); setButtonIndex(0) }}>Confirm</div>
                                </div>
                            </div>
                            :

                            <div className="content1">
                                {buttonIndex == 0 ?
                                    <div className="buttonGroup">
                                        <div className={"sellBtn " + (showTutorial == 1 ? "tutorial" : "")}>
                                            <div className="group1" onClick={() => setButtonIndex(1)}>
                                                <img src="/image/sell.svg" alt="" />
                                                <div>Buy</div>
                                            </div>
                                            {showTutorial == 1 ? <div className="tutorialPanel">
                                                <div className="arrow"></div>
                                                <img src="/image/close.png" alt="" />
                                                <div className="step">Step 1 of 3</div>
                                                <div className="title">Selling</div>
                                                <div className="text">You can sell your character to other players. Press “Sell” button in case you’d like to do it</div>
                                                <div className="btnGroup">
                                                    <div className="skipBtn" onClick={() => setShowTutorial(0)}>Skip all</div>
                                                    <div className="nextBtn" onClick={() => setShowTutorial(2)}>Next</div>
                                                </div>
                                            </div> : <></>}
                                        </div>
                                        <div className={"mateBtn " + (showTutorial == 2 ? "tutorial" : "")} >
                                            <div className="group1" onClick={() => setButtonIndex(2)}>
                                                <img src="/image/mate.png" alt="" />
                                                <div>Mate</div>
                                            </div>
                                            {showTutorial == 2 ? <div className="tutorialPanel">
                                                <div className="arrow"></div>
                                                <img src="/image/close.png" alt="" />
                                                <div className="step">Step 2 of 3</div>
                                                <div className="title">Mating</div>
                                                <div className="text">You can let other players to mate their characters with your for a fee. Pess “Mate” button in case you’d like to do it.</div>
                                                <div className="btnGroup">
                                                    <div className="skipBtn" onClick={() => setShowTutorial(0)}>Skip all</div>
                                                    <div className="nextBtn" onClick={() => { setShowTutorial(4); setBtnIndex(2) }}>Next</div>
                                                </div>
                                            </div> : <></>}
                                        </div>
                                        {/* <div className={"makeBtn " + (showTutorial == 3 ? "tutorial" : "")} >
                                        <div className="group1" onClick={onSetShowMakeCharacterModal}>
                                            <img src="/image/make.png" alt="" />
                                            <div>Make 3D</div>
                                        </div>
                                        {showTutorial == 3 ? <div className="tutorialPanel">
                                            <div className="arrow"></div>
                                            <img src="/image/close.png" alt="" />
                                            <div className="step">Step 3 of 3</div>
                                            <div className="title">3D Character</div>
                                            <div className="text">You can get your own 3D copy of your characterm that will allow you to use it in BubbleX Metaverse as your avatar. You just need to pay gas fee and wait till it’ll be ready.</div>
                                            <div className="btnGroup">
                                                <div className="skipBtn" onClick={() => setShowTutorial(0)}>Skip all</div>
                                                <div className="nextBtn" onClick={() => { setShowTutorial(4); setBtnIndex(2) }}>Next</div>
                                            </div>
                                        </div> : <></>}
                                    </div> */}
                                    </div>
                                    :
                                    <div className="chartPanel">
                                        <div className="topPanel">
                                            <div className="item1">
                                                <div className="text">Buy now price</div>
                                                <div className="value">143 $SLM</div>
                                            </div>
                                            <div className="item1">
                                                <div className="text">Duration</div>
                                                <div className="value">133hours</div>
                                            </div>
                                            {buttonIndex == 1 ? <div className="sellBtn" >
                                                <div className="group1">
                                                    <img src="/image/sell.svg" alt="" />
                                                    <div>Buy</div>
                                                </div>
                                            </div> : <div className="mateBtn" onClick={() => setBtnIndex(1)}>
                                                <div className="group1" >
                                                    <img src="/image/mate.png" alt="" />
                                                    <div>Mate</div>
                                                </div></div>}
                                        </div>
                                        <TokenChartComponent />
                                        <div className="bottomPanel">
                                            <div className="item1">
                                                <div className="text">Start Price:</div>
                                                <div className="value"> 1 $SLM</div>
                                            </div>
                                            <div className="item1">
                                                <div className="text">End Price:</div>
                                                <div className="value">100 $SLM</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="aboutUser">
                                    <img src="/image/avatar.png" alt="" />
                                    <div className="userGroup">
                                        <div className="userInfo">Owner</div>
                                        <div className="user">user11(you)</div>
                                        <div className="walletAddress">
                                            <div className="text">Address</div>
                                            <div className="address"> 0xa89932359eef0a325..</div>
                                        </div>
                                    </div>
                                </div>

                                <Tabs>
                                    <TabList>
                                        <Tab>Info</Tab>
                                        <Tab>Family</Tab>
                                        <Tab>History</Tab>
                                        <Tab>DNA</Tab>
                                    </TabList>
                                    <TabPanel>
                                        <div className="attributeComponent">
                                            <div className="title">Stats</div>
                                            <div className="statGroup">
                                                <div className="statItem">
                                                    <div className="text">HP</div>
                                                    <div className="item">
                                                        <img src="/image/health.png" alt="" />
                                                        <div>123</div>
                                                    </div>
                                                </div>
                                                <div className="statItem">
                                                    <div className="text">ATTTACK</div>
                                                    <div className="item">
                                                        <img src="/image/attack.png" alt="" />
                                                        <div>123</div>
                                                    </div>
                                                </div>
                                                <div className="statItem">
                                                    <div className="text">ARMOR</div>
                                                    <div className="item">
                                                        <img src="/image/armor.png" alt="" />
                                                        <div>123</div>
                                                    </div>
                                                </div>
                                                <div className="statItem">
                                                    <div className="text">SPEED</div>
                                                    <div className="item">
                                                        <img src="/image/speed.png" alt="" />
                                                        <div>123</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="title">Body Parts</div>
                                            <div className="bodyGroup">
                                                <div className="bodyItemGroup">
                                                    <div className="bodyItem">
                                                        <img src="/image/face.png" alt="" />
                                                        <div>Binance</div>
                                                    </div>
                                                    <div className="bodyItem">
                                                        <img src="/image/mouth.png" alt="" />
                                                        <div>Slamcoin</div>
                                                    </div>
                                                </div>
                                                <div className="bodyItemGroup">
                                                    <div className="bodyItem">
                                                        <img src="/image/body.png" alt="" />
                                                        <div>Lapidari</div>
                                                    </div>
                                                    <div className="bodyItem">
                                                        <img src="/image/leg.png" alt="" />
                                                        <div>Crocket</div>
                                                    </div>
                                                </div>
                                                <div className="bodyItemGroup">
                                                    <div className="bodyItem">
                                                        <img src="/image/stomach.png" alt="" />
                                                        <div>Eva</div>
                                                    </div>
                                                    <div className="bodyItem">
                                                        <img src="/image/foot.png" alt="" />
                                                        <div>Binance</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <div className="familyComponent">
                                            <div className="text">Parents</div>
                                            <div className="familyGroup">
                                                <div className="familyItem">
                                                    <img src="/image/lenin.png" alt="" />
                                                    <div className="userId">#421</div>
                                                    <div className="name">Lenin</div>
                                                    <div className="bottomGroup">
                                                        <div className="commonBtn">Common</div>
                                                        <div className="breedCount">Breed Count: 2</div>
                                                    </div>
                                                </div>
                                                <div className="familyItem">
                                                    <img src="/image/lenin.png" alt="" />
                                                    <div className="userId">#421</div>
                                                    <div className="name">Lenin</div>
                                                    <div className="bottomGroup">
                                                        <div className="epicBtn">Epic</div>
                                                        <div className="breedCount">Breed Count: 3</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text">Children</div>
                                            <div className="familyGroup">
                                                <div className="familyItem">
                                                    <img src="/image/lenin.png" alt="" />
                                                    <div className="userId">#421</div>
                                                    <div className="name">Lenin</div>
                                                    <div className="bottomGroup">
                                                        <div className="commonBtn">Common</div>
                                                        <div className="breedCount">Breed Count: 2</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <HistoryComponent date="01/21/2022" buyerName="GrannyHugs" sellerName="JohnyWalker" tokenCount="4,500 $SLM" buyeraddress="0xa89932359eef..." selleraddress="0xa89932359eef..." tokenMoney="$2,675.32" />
                                        <HistoryComponent date="01/21/2022" buyerName="GrannyHugs" sellerName="JohnyWalker" tokenCount="4,500 $SLM" buyeraddress="0xa89932359eef..." selleraddress="0xa89932359eef..." tokenMoney="$2,675.32" />
                                        <HistoryComponent date="01/21/2022" buyerName="GrannyHugs" sellerName="JohnyWalker" tokenCount="4,500 $SLM" buyeraddress="0xa89932359eef..." selleraddress="0xa89932359eef..." tokenMoney="$2,675.32" />
                                        <HistoryComponent date="01/21/2022" buyerName="GrannyHugs" sellerName="JohnyWalker" tokenCount="4,500 $SLM" buyeraddress="0xa89932359eef..." selleraddress="0xa89932359eef..." tokenMoney="$2,675.32" />
                                        <HistoryComponent date="01/21/2022" buyerName="GrannyHugs" sellerName="JohnyWalker" tokenCount="4,500 $SLM" buyeraddress="0xa89932359eef..." selleraddress="0xa89932359eef..." tokenMoney="$2,675.32" />
                                    </TabPanel>
                                    <TabPanel>
                                        <DNAComponent icon="face" dnaName="Binance" dnaCardano="Cardano" dnaPlasma="Plasma" />
                                        <DNAComponent icon="body" dnaName="Binance" dnaCardano="Cardano" dnaPlasma="Plasma" />
                                        <DNAComponent icon="stomach" dnaName="Binance" dnaCardano="Cardano" dnaPlasma="Plasma" />
                                        <DNAComponent icon="mouth" dnaName="Binance" dnaCardano="Cardano" dnaPlasma="Plasma" />
                                        <DNAComponent icon="leg" dnaName="Binance" dnaCardano="Cardano" dnaPlasma="Plasma" />
                                        <DNAComponent icon="foot" dnaName="Binance" dnaCardano="Cardano" dnaPlasma="Plasma" />
                                    </TabPanel>
                                </Tabs>
                            </div>

                        }
                        <div className="content2">
                            <img src="/image/sai1.png" alt="" />
                            <div className="desktopVersion">
                                <div className="userId">#421</div>
                                <div className="name">Sai</div>
                                <div className="epicBtn">Epic</div>
                            </div>
                            <div className="mobileVersion">
                                <div className="text">Breed Count: 3</div>
                                <div className="text">Breed Count: 3</div>
                            </div>
                        </div>
                    </div></div>}
            <MakeCharacterModal isShow={showMakeCharacterModal} hideModal={onSetShowMakeCharacterModal} />
            <SelectCharacterModal isShow={showSelectCharacterModal} hideModal={onSetShowSelectCharacterModal} />
            <Footer />
        </div>
    )
}

CharacterMarketplace.propTypes = {
    projectSetting: PropTypes.object.isRequired,
    setIsMate: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    projectSetting: state.projectSetting
})

export default connect(mapStateToProps, { setIsMate })(
    CharacterMarketplace
)