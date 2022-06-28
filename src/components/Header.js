import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { setIsMate } from "../actions/projectSetting";
import { useDispatch, connect, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import Web3Lib from 'web3';
import Web3Modal from "web3modal";
import { providers } from 'ethers'
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

import { User_Address, Injected_Wallet } from '../actions/types';

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

function Header(props) {
    const state = useSelector(store => store.wallet);
    const [fixedHeader, setFixedHeader] = useState(false);
    const [isReserveClicked, setIsReserveClicked] = useState(props.isReserveClicked ? props.isReserveClicked : false);

    const { provider, web3Provider, address, chainId } = state;
    const dispatch = useDispatch();

    const userAddress = useSelector(store => store.projectSetting.userAddress);

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
    const [loginSlamFlg, setLoginSlamFlg] = useState(0);

    const handleClose = () => setOpenModal(false);


    //const { provider, web3, address, chainId } = useState();

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        const isConnected = localStorage.getItem("walletAddress") ? true : false;

        if (isConnected) {
            walletConnect();
        }
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    const handleScroll = (event) => {
        if (window.scrollY >= 100) {
            setFixedHeader(true);
        } else {
            setFixedHeader(false);
        }
    }

    const walletConnect = useCallback(async () => {
        try {
            console.log("First")
            const provider = await web3Modal.connect();
            //web3 = new Web3Lib(provider);
            console.log("Second")
            const web3Provider = new providers.Web3Provider(provider);

            console.log("Third")
            const network = await web3Provider.getNetwork();
            //const accounts = await web3.eth.getAccounts();

            const signer = web3Provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address);
            // setWalletAddress(accounts[0]);


            dispatch({ type: 'User_Address', payload: address })

            localStorage.setItem('walletAddress', address);
            dispatch({ type: Injected_Wallet, payload: true });

            dispatch({
                type: "SET_WEB3_PROVIDER",
                provider: provider,
                web3Provider: web3Provider,
                address: address,
                chainId: network.chainId,
            });

        } catch (err) {
            console.log(err);
        }
    }, [web3Provider]);

    const disconnectWallet = useCallback(
        async function () {

            // if (web3 && web3.currentProvider && web3.currentProvider.close) {
            //     await web3.currentProvider.close();
            // }
            await web3Modal.clearCachedProvider();
            if (provider?.disconnect && typeof provider.disconnect === "function") {
                alert()
                await provider.disconnect();
                //history.push('/');
                setWalletAddress('');
            }
            dispatch({
                type: "RESET_WEB3_PROVIDER",
            });
            localStorage.setItem('walletAddress', null);


        },
        [provider]
    );

    const loginSlamWallet = async () => {
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
                    setLoginSlamFlg(1);
                }).catch(err1 => {
                    console.log(err1);
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (provider?.on) {

            const handleAccountsChanged = (accounts) => {
                // eslint-disable-next-line no-console
                console.log("accountsChanged", accounts);
                dispatch({
                    type: "SET_ADDRESS",
                    address: accounts[0],
                });
            };

            const handleChainChanged = (chain) => {
                // eslint-disable-next-line no-console
                // console.log("accountsChanged--->", chain);
                dispatch({
                    type: "SET_CHAIN_ID",
                    chainId: chain,
                });
            };

            const handleDisconnect = (error) => {
                // eslint-disable-next-line no-console
                //disconnect();

            };

            provider.on("accountsChanged", handleAccountsChanged);
            provider.on("chainChanged", handleChainChanged);
            provider.on("disconnect", handleDisconnect);

            // Subscription Cleanup
            return () => {
                if (provider.removeListener) {
                    provider.removeListener("accountsChanged", handleAccountsChanged);
                    provider.removeListener("chainChanged", handleChainChanged);
                    //provider.removeListener("disconnect",);
                }
            };
        }

    }, [provider]);

    return (
        <div className={"header " + (showMobileSidebar ? "mobileShow" : "") + (fixedHeader ? " fixedHeader" : "") + (props.isReserveClicked ? " isReserved" : "")}>
            {
                props.isReserveClicked ?
                    <div className="LoginModal">
                        <img src="/image/close1.png" className='close' onClick={() => props.removeReserveClicked()} />
                        <div>
                            <div className='username'>Alex</div>
                            <div className='address'>0x...a37V<img src="/image/copy.svg" /></div>
                            <img className='slamIcon' src="/image/slam.svg" />
                            <div className='slamAmount'>13.123 $SLM</div>
                            <div className='money'>$15.23 USD</div>
                            <div className='slamdetail-panel'>
                                <div className='Operation-title'><img src="/image/operation.svg" />Operation Cost</div>
                                <div className='content-panel'>
                                    <div className='content-title'>Your operations costs<br /> (without transaction fee).</div>
                                    <div className='content-detail'>
                                        <div className='slamValue'>5 $SLM</div>
                                        <div className='realValue'>$5.00</div>
                                    </div>
                                </div>
                            </div>

                            <div className='slamdetail-panel'>
                                <div className='Operation-title'><img src="/image/gas.svg" />Gas fee</div>
                                <div className='content-panel'>
                                    <div className='content-title'>For this operation you<br /> should pay gas fee.</div>
                                    <div className='content-detail'>
                                        <div className='slamValue'>0.005 $SLM</div>
                                        <div className='realValue'>$0.005</div>
                                    </div>
                                </div>
                            </div>
                            <div className='visitBtn'>Accept and Buy</div>
                            <div className='disconnectBtn' onClick={() => props.removeReserveClicked()}>Cancel</div>
                        </div>
                    </div>
                    : <></>
            }
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
                                        <Link to="/ReservedBubbleX">Reserved bubbleX to you</Link>
                                        <div className="uparrow"></div>
                                    </div>
                                </div> : <></>}
                            </div>

                            <div className="homePanel collapse show mobileVersion" id="homePanel">
                                <a href="/#metaverseDescription1" onClick={() => setShowMobileSidebar(false)}>Metaverse description</a>
                                <a href="/#bubbleXMatch1" onClick={() => setShowMobileSidebar(false)}>BubbleX match mechanics</a>
                                <a href="/#bubbleCoinMining1" onClick={() => setShowMobileSidebar(false)}>Bubblecoin mining mechanics</a>
                                <Link to="/ReservedBubbleX">Reserved bubbleX to you</Link>
                            </div>
                        </div>
                        <div className="menuGroup">
                            <div className="homeMenu" onMouseEnter={() => setShowMarketplaceHover(true)} onMouseLeave={() => setShowMarketplaceHover(false)}>
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
                            !web3Provider ?
                                <>
                                    <div className="connectWallet" onClick={walletConnect}>Connect wallet</div>
                                    <div className="connectSlamWalletContent">
                                        <div className="connectSlamWallet" onClick={() => setOpenModal(true)}>Connect SlamWallet</div>
                                        {isOpen ?
                                            <div className="LoginModal">
                                                <img src="/image/close1.png" className='close' onClick={() => setOpenModal(false)} />
                                                {loginSlamFlg == 0 ?
                                                    <div>
                                                        <img src="/image/slam.svg" />
                                                        <div className="subLoginTitle">Welcome back!</div>
                                                        {
                                                            errMsg && (
                                                                <Alert variant="danger">
                                                                    <p>{errMsg}</p>
                                                                </Alert>
                                                            )
                                                        }
                                                        {/* <div className="subDes">Log in with your data that you entered during your registration.</div> */}
                                                        <input
                                                            type="email"
                                                            placeholder="Enter your email "
                                                            value={loginInfo.email}
                                                            onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
                                                            className="loginEmail"
                                                        />
                                                        {/* <div className="inputText">
                                                    
                                                </div> */}
                                                        {/* <div className="inputGroup">
                                                    <div className="label">E-mail</div>
                                                    
                                                </div> */}
                                                        <input
                                                            type={view ? "text" : "password"}
                                                            placeholder="At least 8 characters"
                                                            value={loginInfo.password}
                                                            onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
                                                            className="loginPassword"
                                                        />
                                                        {/* <div className="inputGroup">
                                                    <div className="label">Password</div>
                                                    <div className="inputText">
                                                        
                                                        <img src="/image/eye.png" alt="" onClick={() => setView(!view)} />
                                                    </div>
                                                </div> */}
                                                        <div
                                                            className="loginBtn"
                                                            // onClick={loginSlamWallet}
                                                            onClick={() => { setLoginSlamFlg(1) }}
                                                        >Connect</div>
                                                        <div className='loginfooter'>Don’t have an acсount yet? <div>Register</div></div>
                                                    </div>
                                                    :
                                                    (loginSlamFlg == 1
                                                        ?
                                                        <div>
                                                            <div className='username'>Alex</div>
                                                            <div className='address'>0x...a37V<img src="/image/copy.svg" /></div>
                                                            <img className='slamIcon' src="/image/slam.svg" />
                                                            <div className='slamAmount'>13.123 $SLM</div>
                                                            <div className='money'>$15.23 USD</div>
                                                            {/* <div className='slamdetail-panel'>
                                                                <div className='Operation-title'><img src="/image/operation.svg" />Operation Cost</div>
                                                                <div className='content-panel'>
                                                                    <div className='content-title'>Your operations costs<br /> (without transaction fee).</div>
                                                                    <div className='content-detail'>
                                                                        <div className='slamValue'>5 $SLM</div>
                                                                        <div className='realValue'>$5.00</div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='slamdetail-panel'>
                                                                <div className='Operation-title'><img src="/image/gas.svg" />Gas fee</div>
                                                                <div className='content-panel'>
                                                                    <div className='content-title'>For this operation you<br/> should pay gas fee.</div>
                                                                    <div className='content-detail'>
                                                                        <div className='slamValue'>0.005 $SLM</div>
                                                                        <div className='realValue'>$0.005</div>
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                            <div className='visitBtn'>Visit SlamWallet</div>
                                                            <div className='disconnectBtn' onClick={() => { setLoginSlamFlg(0) }}>Disconnect</div>
                                                        </div>
                                                        :
                                                        <div></div>
                                                    )
                                                }


                                            </div>
                                            :
                                            <></>
                                        }


                                    </div>

                                </>
                                :
                                <>
                                    <div className="connectWallet">{address.substr(0, 6) + '...' + address.substr(-4)}</div>
                                    <div className="disconnectWallet" onClick={disconnectWallet}>Disconnect Wallet</div>
                                </>
                        }
                    </div>
                </div>
            </div>
            <div className="menuBtnGroup">
                <img src="/image/menu.png" alt="" onClick={() => setShowMobileSidebar(true)} />
                <img src="/image/menu1.png" alt="" onClick={() => setShowMobileSidebar(true)} />
            </div>
            {/* <Modal show={isOpen} className="SlamWallet" onHide={handleClose}>

            </Modal> */}
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