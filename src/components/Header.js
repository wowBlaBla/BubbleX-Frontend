import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {setIsMate} from "../actions/projectSetting";
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Web3Lib from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

function Header(props) {
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [showHomeHover, setShowHomeHover] = useState(false);
    const [showMarketplaceHover, setShowMarketplaceHover] = useState(false);

    const [isOpen, setOpenModal] = useState(false);
    const [view, setView] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });
    const [errMsg, setErrorMsg] = useState('');


    const walletConnect = async () => {
        try {
            const providerOptions = {
                walletconnect: {
                  package: WalletConnectProvider,
                  options: {
                    infuraId: "b9719f5304ad4806b0e693943f308652"
                  }
                }
              }
            
              const web3Modal = new Web3Modal({
                network: "mainnet",
                cacheProvider: true,
                providerOptions
              })
          
              const provider = await web3Modal.connect();
              const web3 = new Web3Lib(provider);
              const accounts = await web3.eth.getAccounts();
              setWalletAddress(accounts[0]);
        } catch(err) {
            console.log(err);
        }
    }

    const loginSlamWallet = async() => {
        try {

            if (!loginInfo.email || !loginInfo.password) {
                return;
            }

            let _token = {};
            await axios.post(`${process.env.REACT_APP_SLAMBACKEND}api/signin`, loginInfo).then(res => {
                const { token, status, message } = res.data;
                if (status == 'error') setErrorMsg(message);
                else setErrorMsg('');
                if (status == 'success') _token = { token };
            }).catch(error1 => {

            });

            if (_token) {
                await axios.post(`${process.env.REACT_APP_SLAMBACKEND}api/token`, _token).then(res => {
                    const { address: _wallet } = res.data;
                    setWalletAddress(_wallet);
                    setLoginInfo({
                        email: '', password: ''
                    });
                    setOpenModal(false);
                }).catch(err1 => {
                    console.log(err1);
                })
            }
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className={"header " + (showMobileSidebar ? "mobileShow" : "")}>
            <div className="header_logo">
                <Link to="/"><img src="/image/header_logo.svg" alt="" /></Link>
                <Link to="/"><img src="/image/footer_logo.svg" alt="" /></Link>
            </div>
            <div className="modal-backdrop mobileSidebarBack"></div>
            <div className="mobileSidebar">
                <div className="header_group">
                    <div className="mobileHeader" >
                        <Link to="/"><img src="/image/header_logo.svg" alt="" /></Link>
                        <img src="/image/close1.png" alt="" onClick={() => setShowMobileSidebar(!showMobileSidebar)} />
                    </div>
                    <div className="header_menu" >
                        <div className="menuGroup" >
                            <div className="homeMenu" onMouseEnter={() => setShowHomeHover(true)} onMouseLeave={() => setShowHomeHover(false)}>
                                <Link to="/" className={props.selected == "Home" ? "selected" : ""} onClick={() => setShowMobileSidebar(false)}>
                                    Home

                                </Link>
                                <div data-toggle="collapse" href="#homePanel" role="button" area-expanded="true" area-controls="homePanel" ></div>
                                {showHomeHover ? <div className="homeHoverPanel desktopVersion">
                                    <div className="panel">
                                        <a href="/#metaverseDescription">Metaverse description</a>
                                        <a href="/#bubbleXMatch">BubbleX match mechanics</a>
                                        <a href="/#bubbleCoinMining">Bubblecoin mining mechanics</a>
                                        <div className="uparrow"></div>
                                    </div>
                                </div> : <></>}
                            </div>

                            <div className="homePanel collapse show mobileVersion" id="homePanel">
                                <a href="/#metaverseDescription1" onClick={() => setShowMobileSidebar(false)}>Metaverse description</a>
                                <a href="/#bubbleXMatch1" onClick={() => setShowMobileSidebar(false)}>BubbleX match mechanics</a>
                                <a href="/#bubbleCoinMining1" onClick={() => setShowMobileSidebar(false)}>Bubblecoin mining mechanics</a>
                            </div>
                        </div>
                        <div className="menuGroup">
                            <div className="homeMenu" onMouseEnter={() => setShowMarketplaceHover(true)} onMouseLeave = {() => setShowMarketplaceHover(false)}>
                                <Link to="/Marketplace" className={props.selected == "Marketplace" ? "selected" : ""}
                                >Marketplace</Link>
                                <div data-toggle="collapse" href="#marketplacePanel" role="button" area-expanded="true" area-controls="marketplacePanel" className="collapsed"></div>
                                {showMarketplaceHover ? <div className="homeHoverPanel desktopVersion">
                                    <div className="panel">
                                        <Link to="/Marketplace">Visit Marketplace</Link>
                                        <Link to="/Marketplace/sai" onClick={() => props.setIsMate(true)}>Mate Characters</Link>
                                        <Link to="/MyCharacters">Your Characters</Link>
                                        <div className="uparrow"></div>
                                    </div>
                                </div> : <></>}
                            </div>
                            <div className="homePanel collapse mobileVersion" id="marketplacePanel">
                                <Link to="/Marketplace">Visit Marketplace</Link>
                                <Link to="/Marketplace" onClick={() => props.setIsMate(true)}>Mate Characters</Link>
                                <Link to="/MyCharacters">Your Characters</Link>
                            </div>
                        </div>
                        <div className="menuGroup">
                            <Link to="Presale" className={props.selected == "Presale" ? "selected" : ""}>Presale</Link>
                            <img src="/image/down1.png" alt="" />
                        </div>
                    </div>
                    <div className="header_buttonGroup">
                        {
                            !walletAddress ?
                            <>
                                <div className="connectWallet" onClick={walletConnect}>Connect wallet</div>
                                <div className="connectSlamWallet" onClick={() => setOpenModal(true)}>Connect SlamWallet</div>
                            </>
                            : <div className="connectWallet">{walletAddress.substr(0, 6) + '...' + walletAddress.substr(-4)}</div>
                        }
                    </div>
                </div>
            </div>
            <div className="menuBtnGroup">
                <img src="/image/menu.png" alt="" onClick={() => setShowMobileSidebar(true)} />
                <img src="/image/menu1.png" alt="" onClick={() => setShowMobileSidebar(true)} />
            </div>
            <Modal show={isOpen} className="SlamWallet">
                <div className="Content">
                    <div className="subLoginTitle">Login</div>
                    {
                        errMsg && (
                            <Alert variant="danger">
                                <p>{errMsg}</p>
                            </Alert>
                        )
                    }
                    <div className="subDes">Log in with your data that you entered during your registration.</div>
                    <div className="inputGroup">
                        <div className="label">E-mail</div>
                        <div className="inputText">
                            <input
                                type="email"
                                placeholder="Enter your email "
                                value={loginInfo.email}
                                onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="inputGroup">
                        <div className="label">Password</div>
                        <div className="inputText">
                            <input
                                type={view ? "text" : "password"}
                                placeholder="At least 8 characters"
                                value={loginInfo.password}
                                onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
                            />
                            <img src="/image/eye.png" alt="" onClick={() => setView(!view)} />
                        </div>
                    </div>
                    <div
                        className="loginBtn"
                        onClick={loginSlamWallet}
                    >Log in</div>
                </div>
            </Modal>
        </div>
    )
}

Header.propTypes = {
    projectSetting: PropTypes.object.isRequired,
    setIsMate: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    projectSetting: state.projectSetting
})

export default connect(mapStateToProps, { setIsMate })(
    Header
)