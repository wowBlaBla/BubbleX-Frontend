import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { setIsMate } from "../../actions/projectSetting";
import { useDispatch, connect, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Web3Lib from 'web3';
import Web3Modal from "web3modal";
import { providers } from 'ethers'
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Foco from 'react-foco';
import { User_Address, Injected_Wallet } from '../../actions/types';

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

	const { provider, web3Provider, address, chainId, slamWallet } = state;
	const dispatch = useDispatch();

	const userAddress = useSelector(store => store.projectSetting.userAddress);

	const [showMobileSidebar, setShowMobileSidebar] = useState(false);
	const [showHomeHover, setShowHomeHover] = useState(false);
	const [showMarketplaceHover, setShowMarketplaceHover] = useState(false);

	const [isOpen, setOpenModal] = useState(false);
	const [view, setView] = useState(false);
	const [walletAddress, setWalletAddress] = useState('');
	const [fullName, setFullName] = useState('');
	const [balance, setBalance] = useState(0);
	const [recentTx, setRecentTx] = useState(false);
	const [loginInfo, setLoginInfo] = useState({
		email: '',
		password: ''
	});
	const [errMsg, setErrorMsg] = useState('');
	const [loginSlamFlg, setLoginSlamFlg] = useState(0);
	const [tokenPrice, setTokenPrice] = useState(0.18);
	const [loadingStatus, setLoadingStatus] = useState(0);

	const handleClose = () => setOpenModal(false);


	//const { provider, web3, address, chainId } = useState();
	const [showCopied, setShowCopied] = useState(false)
	const onClickCopyBtn = (text) => {
		console.log("Copy Test ==> ", text);
		addressCopy(text)
		setShowCopied(true);
	}

	const addressCopy = (address) => {
		const el = document.createElement('textarea');
		el.value = address;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}

	useEffect(async () => {
		if (showCopied == true) {
			const timer = setInterval(() => {
				setShowCopied(false);
				clearInterval(timer);
			}, 2000);
		}
	}, [showCopied]);

	// useEffect(() => {
	//     const isConnected = localStorage.getItem("walletAddress").length > 40 ? true : false;
	//     if (isConnected) {
	//         walletConnect();
	//     }
	// }, [])

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		const isConnected = localStorage.getItem("walletAddress")?.length > 32 ? true : false;
		if (isConnected) {
			walletConnect();
		}
		return () => {
			window.removeEventListener('scroll', handleScroll);
		}
	}, [])

	const handleScroll = (event) => {
		if (window.scrollY >= 50) {
			setFixedHeader(true);
		} else {
			setFixedHeader(false);
		}
	}

	const walletConnect = useCallback(async () => {
		try {
			const provider = await web3Modal.connect();
			//web3 = new Web3Lib(provider);
			const web3Provider = new providers.Web3Provider(provider);
			
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
				setWalletAddress(null);
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
			setLoadingStatus(1);
			await axios.post(`${process.env.REACT_APP_SLAMBACKEND}api/signin`, loginInfo).then(res => {
				const { token, status, message } = res.data;
				if (status == 'error') {
					toast.error(message, {pauseOnFocusLoss: false});
					setLoginSlamFlg(0);
				} else setErrorMsg('');
				if (status == 'success') _token = { token };
			}).catch(error1 => {
				
			});

			if (_token) {
				await axios.post(`${process.env.REACT_APP_SLAMBACKEND}api/token`, _token).then(res => {
					if(res.data.status !== 'false') {
						const { address: _wallet, name, slam } = res.data;
						setWalletAddress(_wallet);
						setFullName(name);
						setBalance(slam);
						setLoginSlamFlg(1);
						setLoginInfo({
							email: '', password: ''
						});
						dispatch({
							type: "RESET_WEB3_PROVIDER",
						});
						dispatch({ 
							type: 'SLAMWALLET_CONNECT',
							address: _wallet,
							slamWallet: res.data.guid,
							token: _token.token,
							userId: res.data.id
						})
						toast.success('Successfully Connected!', {pauseOnFocusLoss: false});
					} else {
						setLoginSlamFlg(0);
						dispatch({
							type: "RESET_WEB3_PROVIDER",
						});
					}
				}).catch(err1 => {
					setLoginSlamFlg(0);
				});
				const res = await axios.post(process.env.REACT_APP_SLAMBACKEND + 'api/transaction', _token);
				const titleArr = ['Random', 'Epic', 'Legend'];
				const priceArr = [5, 15, 25];
				let getResult = [];
				res.data.transactions.map((row, i) => {
					if(row.isNFT?.length > 2) {
						getResult.push({
							amount: row.isNFT.substr(2, 1) * priceArr[Number(row.isNFT.substr(3, 1))],
							title: titleArr[Number(row.isNFT.substr(3, 1))],
							txhash: "https://testnet.bscscan.com/tx/" + row.txhash,
							createDate: row.created_at
						});
					}
				});
				setRecentTx(getResult);
			}
		} catch (err) {
			console.log(err);
		}
		setLoadingStatus(0);
	}

	useEffect(() => {
		setRecentTx(props.updateTx);
	}, [props.updateTx]);

	const disconnectSlam = async () => {
		setLoginSlamFlg(0); 
		setWalletAddress(null); 
		setFullName(''); 
		setBalance(0);
		dispatch({
			type: "RESET_WEB3_PROVIDER",
		});
		localStorage.setItem('walletAddress', null);
	}

	useEffect(() => {
		if (provider?.on) {

			const handleAccountsChanged = (accounts) => {
				// eslint-disable-next-line no-console
				// console.log("accountsChanged", accounts);
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

	useEffect(() => {
		if(props.isReserveClicked) setOpenModal(true);
	}, [props.isReserveClicked]);

	return (
		<div className={"header " + (showMobileSidebar ? "mobileShow" : "") + (fixedHeader ? " fixedHeader" : "") + (props.isReserveClicked ? " isReserved" : "")}>
			{/* {
				props.isReserveClicked ?
					<div className="LoginModal">
						<img src="/image/close1.png" className='close' onClick={() => props.removeReserveClicked()} />
						<div>
							<div className='username'>{fullName ? fullName : 'No Slam Name'}</div>
							<div className='address'>{walletAddress.substr(0, 6) + '...' + walletAddress.substr(-4)}
								<CopyToClipboard text={walletAddress}>
									<img src="../image/copy.svg" alt="" className="icon_copy" onClick={() => onClickCopyBtn(walletAddress)} />
								</CopyToClipboard>
							</div>
							{(showCopied) ? <div className="sc-1u1vgpp-0 cVGhIP">
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="14px" width="14px" viewBox="0 0 24 24" className="sc-16r8icm-0 cfMRaw cmc-icon">
									<path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM16.7557 9.65493C17.1174 9.23758 17.0723 8.60602 16.6549 8.24431C16.2376 7.8826 15.606 7.92771 15.2443 8.34507L10.8 13.4731L8.75569 11.1143C8.39398 10.6969 7.76242 10.6518 7.34507 11.0135C6.92771 11.3752 6.8826 12.0068 7.24431 12.4242L10.0443 15.6549C10.2343 15.8741 10.51 16 10.8 16C11.09 16 11.3657 15.8741 11.5557 15.6549L16.7557 9.65493Z"></path>
								</svg>
								<span>Copied!</span>
							</div> : ""}
							<img className='slamIcon' src="/image/slam.svg" />
							<div className='slamAmount'>{balance} $SLM</div>
							<div className='money'>${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(balance * tokenPrice)}</div>
							<div className='slamdetail-panel'>
								<div className='Operation-title'><img src="/image/operation.svg" />Operation Cost</div>
								<div className='content-panel'>
									<div className='content-title'>Your operations costs<br /> (without transaction fee).</div>
									<div className='content-detail'>
										<div className='slamValue'>{props.iValue} $SLM</div>
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
			} */}
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
								<a href="/Marketplace" className={props.selected == "Marketplace" ? "selected" : ""}
								>Marketplace</a>
								<div data-toggle="collapse" href="#marketplacePanel" role="button" area-expanded="true" area-controls="marketplacePanel" className="collapsed"></div>
								{showMarketplaceHover ? <div className="homeHoverPanel desktopVersion">
									<div className="panel">
										<a href="/Marketplace">Visit Marketplace</a>
										<a href="/Marketplace/sai" onClick={() => props.setIsMate(true)}>Mate Characters</a>
										<a href="/MyCharacters">Your Characters</a>
										<div className="uparrow"></div>
									</div>
								</div> : <></>}
							</div>
							<div className="homePanel collapse mobileVersion" id="marketplacePanel">
								<a href="/Marketplace">Visit Marketplace</a>
								<a href="/Marketplace/sai" onClick={() => props.setIsMate(true)}>Mate Characters</a>
								<a href="/MyCharacters">Your Characters</a>
							</div>
						</div>
						<div className="menuGroup">
							<a href="/#reserveGroup" onClick={() => setShowMobileSidebar(false)}>Presale</a>
							<img src="/image/down1.png" alt="" />
						</div>
					</div>
					<div className="header_buttonGroup">
						{
							!web3Provider ?
								<>
									{ loginSlamFlg == 0 ? <div className="connectWallet" onClick={walletConnect}>Connect wallet</div> : "" }
									<div className="connectSlamWalletContent">
										<div className="connectSlamWallet" onClick={() => setOpenModal(true)}>{ loginSlamFlg == 0 ? "Connect" : "Connected" } SlamWallet</div>
										{isOpen ?
											<Foco 
												onClickOutside={() => {setOpenModal(false); props.removeReserveClicked();}}
											>
												<div className="LoginModal">
													{loadingStatus == 0 ? "" : <div className="loadingIcon"></div>}
													<img src="/image/close1.png" className='close' onClick={() => {setOpenModal(false); props.removeReserveClicked();}} />
													{loginSlamFlg == 0 ?
														<div>
															<img src="/image/slam.png" />
															<div className="subLoginTitle">Welcome back!</div>
															{
																errMsg && (
																	<Alert variant="danger">
																		<p>{errMsg}</p>
																	</Alert>
																)
															}
															<input
																type="email"
																placeholder="Enter your email "
																value={loginInfo.email}
																onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
																className="loginEmail"
															/>
															<input
																type={view ? "text" : "password"}
																placeholder="At least 8 characters"
																value={loginInfo.password}
																onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
																className="loginPassword"
															/>
															<div
																className="loginBtn"
																onClick={loginSlamWallet}
																// onClick={() => { setLoginSlamFlg(1) }}
															>Connect</div>
															<div className='loginfooter'>Don’t have an acсount yet? <a href="https://wallet.slamcoin.io/register" target="_blank" rel="noreferrer">Register</a></div>
														</div>
														:
													  <div>
															<div className='username'>{fullName ? fullName : 'No Slam Name'}</div>
															<div className='address'>{walletAddress.substr(0, 6) + '...' + walletAddress.substr(-4)}
																<CopyToClipboard text={walletAddress}>
																	<img src="../image/copy.svg" alt="" className="icon_copy" onClick={() => onClickCopyBtn(walletAddress)} />
																</CopyToClipboard></div>
															{(showCopied) ? <div className="sc-1u1vgpp-0 cVGhIP">
																<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="14px" width="14px" viewBox="0 0 24 24" className="sc-16r8icm-0 cfMRaw cmc-icon">
																	<path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM16.7557 9.65493C17.1174 9.23758 17.0723 8.60602 16.6549 8.24431C16.2376 7.8826 15.606 7.92771 15.2443 8.34507L10.8 13.4731L8.75569 11.1143C8.39398 10.6969 7.76242 10.6518 7.34507 11.0135C6.92771 11.3752 6.8826 12.0068 7.24431 12.4242L10.0443 15.6549C10.2343 15.8741 10.51 16 10.8 16C11.09 16 11.3657 15.8741 11.5557 15.6549L16.7557 9.65493Z"></path>
																</svg>
																<span>Copied!</span>
															</div> : ""}
															<img className='slamIcon' src="/image/slam.png" />
															<div className='slamAmount'>{balance} $SLM</div>
															<div className='money'>${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(balance * tokenPrice)}</div>
															{
																props.isReserveClicked ? 
																<>
																	<div className='slamdetail-panel'>
																		<div className='Operation-title'><img src="/image/operation.svg" />Operation Cost</div>
																		<div className='content-panel'>
																			<div className='content-title'>Your operations costs<br /> (without transaction fee).</div>
																			<div className='content-detail'>
																				<div className='slamValue'>{props.iValue} $SLM</div>
																				<div className='realValue'>${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(props.iValue * tokenPrice)}</div>
																			</div>
																		</div>
																	</div>

																	<div className='slamdetail-panel'>
																		<div className='Operation-title'><img src="/image/gas.svg" />BNB Balance</div>
																		<div className='content-panel'>
																			<div className='content-title'>For this operation you <br /> should pay gas fee with BNB.</div>
																			<div className='content-detail'>
																				<div className='slamValue'>{props.bnbBalance ? props.bnbBalance : '...'} BNB</div>
																			</div>
																		</div>
																	</div>

																	<div className='visitBtn' onClick={() => props.buyAction()}>Accept and Buy</div>
																	<div className='disconnectBtn' onClick={() => props.removeReserveClicked()}>Cancel</div>
																</>
																: 
																<>
																	<div className='slamdetail-panel'>
																		<div className='Operation-title'><img src="/image/gas.svg" />Recent Transactions</div>
																		
																			{
																				recentTx && (
																					recentTx.length === 0 ?
																						<div>You don't have recent history transaction.</div>
																					:
																					recentTx.map((row, i) => {
																						return (
																							<div className='content-panel' key={i}>
																								<div className='content-title'>Buy {row.title} BubbleX <br /> {row.createDate} </div>
																								<div className='content-detail'>
																									<div className='slamValue'>{row['amount']} $SLM</div>
																									<div className='realValue'><a href={row.txhash} target="_blank">View Trnasaction</a></div>
																								</div>
																							</div>
																						);
																					})
																				)
																			}
																		
																	</div>
																	<a href="https://wallet.slamcoin.io" target="_blank" className='visitBtn'>Visit SlamWallet</a>
																	<div className='disconnectBtn' onClick={ disconnectSlam }>Disconnect</div>
																</>
															}
														</div>
													 }
												</div>
											</Foco>
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
			<ToastContainer></ToastContainer>
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