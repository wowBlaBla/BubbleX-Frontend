import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import Modal from 'react-bootstrap/Modal';
import Web3 from "web3";
import { ethers } from "ethers";
import axios from "axios";
import { connect, useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import { Toast } from "react-bootstrap";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import 'react-toastify/dist/ReactToastify.css';

import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import VideoPlayModal from "../components/VideoPlayModal/VideoPlayModal";
import BubblexABI from '../contract/BubbleXPresale.json';

const ethChainID = process.env.REACT_APP_ETH_CHAIN_ID;
const bnbChainID = process.env.REACT_APP_BNB_CHAIN_ID;

export default function Home() {
	const [mintTokenCount, setMintTokenCount] = useState(100000);
	const [sliderBackground, setSliderBackground] = useState({ background: "linear-gradient(to right, #FF79FF 0%, #EEEEEE 0%)" });
	const [randomCount, setRandomCount] = useState(1);
	const [epicCount, setEpicCount] = useState(1);
	const [legendaryCount, setLegendaryCount] = useState(1);
	const [nowSelect, setNowSelect] = useState(0);
	const [itemValue, setItemValue] = useState(0);
	const [itemCount, setItemCount] = useState(1);
	const [adminWallet, setAdminWallet] = useState("");
	const [priceInETH, setPriceInETH] = useState(['0.1', '1', '5']);
	const [priceInBNB, setPriceInBNB] = useState(['0.1', '1', '5']);
	const [priceInSLAM, setPriceInSLAM] = useState(['5', '15', '25']);
	const [userBalance, setBNBBalance] = useState(0);
	const [userSlamBalance, setSLAMBalance] = useState(0);
	const [showVideo, setShowVideo] = useState(false);
	const [showVideo1, setShowVideo1] = useState(false);
	const [showVideoPlayModal, setShowVideoPlayModal] = useState(false);
	const [showFaqMore, setShowFaqMore] = useState(false);
	const [isReserveClicked, setIsReserveClicked] = useState(false);
	const [recentTx, setRecentTx] = useState();
	const videoRef = useRef(null);
	const [scrollY, setScrollY] = useState(window.scrollY);
	const [smShow, setSmShow] = useState(false);

	const wallet = useSelector(store => store.wallet);

	useEffect(async () => {
		setScrollY(window.scrollY);
		await axios.get(`${process.env.REACT_APP_SLAMBACKEND}api/settings`).then(res => {
			const { setting } = res.data;

			setAdminWallet(setting.admin_wallet);

			let price = [
				setting.price_eth_common, 
				setting.price_eth_epic, 
				setting.price_eth_legendary
			];
			setPriceInETH(price);

			price = [
				setting.price_bnb_common, 
				setting.price_bnb_epic, 
				setting.price_bnb_legendary
			];
			setPriceInBNB(price);

			price = [
				setting.price_slam_common, 
				setting.price_slam_epic, 
				setting.price_slam_legendary
			];
			setPriceInSLAM(price);
		}).catch(err => {
		});
	}, []);

	useEffect(async () => {
		console.log(wallet.address);
		if (!wallet.address) return;

		/*
		await axios.get(`${process.env.REACT_APP_SLAMBACKEND}api/getReservedCount/${wallet.address}`).then(res => {
			console.log(res);
		}).catch(err => {
		});
		*/
	}, [wallet.address])

	const onSetShowVideoPlayModal = () => {
		setShowVideoPlayModal(!showVideoPlayModal);
	}

	const onSetMintTokenCount = (event, newValue) => {
		setMintTokenCount(event.target.value);
		console.log(event);
		if (newValue == event.target.min)
			setSliderBackground({ background: "linear-gradient(to right, #FF79FF 0%, #EEEEEE 0%)" });
		else
			setSliderBackground({ background: "linear-gradient(to right, #FF79FF " + (parseFloat(event.target.value) - parseFloat(event.target.min)) / (parseFloat(event.target.max) - parseFloat(event.target.min)) * 100 + "%, #EEEEEE " + (parseFloat(event.target.value) - parseFloat(event.target.min)) / (parseFloat(event.target.max) - parseFloat(event.target.min)) * 100 + "%)" })
	}

	const onSetRandomReverse = async (iCount) => {
		setNowSelect(0);
		setItemCount(iCount);

		if (iCount == 0) return;
		
		reserveOnBubbleX(iCount, 0, priceInSLAM[0]);
	}

	const onSetEpicReverse = async (iCount) => {
		setNowSelect(1);
		setItemCount(iCount);

		if (iCount == 0) return;

		reserveOnBubbleX(iCount, 1, priceInSLAM[1]);
	}

	const onSetLegendaryReverse = async (iCount) => {
		setNowSelect(2);
		setItemCount(iCount);

		if (iCount == 0) return;

		reserveOnBubbleX(iCount, 2, priceInSLAM[2]);
	}

	const reserveOnBubbleX = async (iCount, mintType, slamAmount) => {
		if (wallet.address == null && wallet.web3Provider == null) {
			toast.warn("Please Connect Wallet!", {pauseOnFocusLoss: false});
			return;
		}

		if (wallet.slamWallet == null && Number(wallet.chainId) != Number(bnbChainID) && Number(wallet.chainId) != Number(ethChainID)) {
			toast.error("Please Change Network to ETH or BSC Testnet", {pauseOnFocusLoss: false});
			return;
		}

		if(wallet.slamWallet == null) {
			const web3 = wallet.web3;
			let price = ethers.utils.parseEther(Number(wallet.chainId) == Number(ethChainID) ? priceInETH[mintType].toString() : priceInBNB[mintType].toString());
			const amount = price.mul(iCount);
			const gasPrice = await web3.eth.getGasPrice();

			const tx = {
				'to': adminWallet, // faucet address to return eth
				'value': amount, // 1 ETH
				'gasPrice': ethers.utils.hexlify(Math.round(gasPrice * 1.3)),
				'gasLimit': ethers.utils.hexlify(21000)
			};

			const signer = await wallet.web3Provider.getSigner();
			const signedTx = await signer.sendTransaction(tx).then(async (result) => {
				const toastPending = toast.loading("1 transaction is pending....");
				const interval = setInterval(function() {
					web3.eth.getTransactionReceipt(result.hash, function(err, rec) {
						if (rec) {
							clearInterval(interval);

							axios.post(process.env.REACT_APP_SLAMBACKEND + 'api/cryptoTx', {
								user_id: -1,
								amount: ethers.utils.formatEther(amount.toString()),
								transactionHash: result.hash,
								from: result.from,
								to: result.to,
								isNFT: '0x' + itemCount + mintType,
								nativeCoin: Number(wallet.chainId) == Number(ethChainID) ? 'ETH' : 'BNB',
								txMethod: 2
							}).then(res => {
								if(res.data.status === 'success') {
									toast.update(toastPending, {render: "Successfully Minted.", type: "success", isLoading: false, autoClose: 3000, className: 'rotateY animated', closeButton: true, pauseOnFocusLoss: false});
								} else {
									toast.update(toastPending, {render: "Some Error occured.", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
								}
							}).catch(err => {
								toast.update(toastPending, {render: "Some Error occured.", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
							})
						}
					});
				}, 1000);
			});
		} else {
			setItemValue(iCount * slamAmount);
			setIsReserveClicked(true);
			const web3 = new Web3(process.env.REACT_APP_BSC);
			const bnbBalance = await web3.eth.getBalance(wallet.address);
			setBNBBalance(web3.utils.fromWei(bnbBalance, 'ether'));
		}
	}

	const removeReserveClicked = () => {
		setIsReserveClicked(false);
	}

	const buyAction = async () => {
		removeReserveClicked();
		const toastPending = toast.loading("1 transaction is pending....");
		const web3 = wallet.web3;
		const tokenContract = wallet.slamContract;
		const result = await tokenContract.methods.balanceOf(wallet.address).call();
		const balance = web3.utils.fromWei(result, 'ether');

		if(balance * 1 < itemValue) {
			toast.update(toastPending, {render: "Insufficient SLAM TOKEN", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
			return;
		}

		const amount = web3.utils.toWei(itemValue + '');
		const transferTx = tokenContract.methods.transfer(adminWallet, amount);
		const gas = await transferTx.estimateGas({from: wallet.address});
		const gasPrice = await web3.eth.getGasPrice();

		const txData = {
			to: transferTx._parent._address,
			data: transferTx.encodeABI(),
			gas: ethers.utils.hexlify(Number(gas)),
			gasPrice: ethers.utils.hexlify(Math.round(gasPrice * 1.3))
		};

		const signedTx = await web3.eth.accounts.signTransaction(txData, wallet.slamWallet);
		const finalResult = await web3.eth.sendSignedTransaction(signedTx.rawTransaction).catch(err => {
			toast.update(toastPending, {render: "Insufficient BNB Balance For gas fee. You have to deposit some BNB to SlamWallet Address.", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
		});

		if(finalResult) {
			axios.post(process.env.REACT_APP_SLAMBACKEND + 'api/cryptoTx', {
				user_id: wallet.userId,
				amount: itemValue * -1,
				transactionHash: finalResult.transactionHash,
				from: finalResult.from,
				to: adminWallet,
				isNFT: '0x' + itemCount + nowSelect,
				nativeCoin: 'SLAM',
				txMethod: 1
			}).then(res => {
				if(res.data.status === 'success') {
					toast.update(toastPending, {render: "Successfully Minted.", type: "success", isLoading: false, autoClose: 3000, className: 'rotateY animated', closeButton: true, pauseOnFocusLoss: false});
				} else {
					toast.update(toastPending, {render: "Some Error occured.", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
				}

				getTransactionHis();
			}).catch(err => {
				toast.update(toastPending, {render: "Some Error occured.", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
			})
		} else {
			toast.update(toastPending, {render: "Failed Mint.", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
		}

		/*
		const finalTx = BubbleContract.methods.ReserveWithSLAM(itemCount, nowSelect);
		const finalGas = await finalTx.estimateGas({from: wallet.address});
		const finalTxData = {
			to: finalTx._parent._address,
			data: finalTx.encodeABI(),
			gas: finalGas,
			gasPrice: gasPrice
		}

		const finalSignedTx = await web3.eth.accounts.signTransaction(finalTxData, wallet.slamWallet);
		const finalResult = await web3.eth.sendSignedTransaction(finalSignedTx.rawTransaction).catch(err => {
			toast.update(toastPending, {render: "Insufficient BNB Balance For gas fee. You have to deposit some BNB to SlamWallet Address.", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
		});

		if(finalResult) {
			axios.post(process.env.REACT_APP_SLAMBACKEND + 'api/cryptoTx', {
				token: wallet.token, user_id: wallet.userId, amount: itemValue * -1, transactionHash: finalResult.transactionHash, txType: 2, isNFT: '0x' + itemCount + nowSelect
			}).then(res => {
				if(res.data.status === 'success') {
					toast.update(toastPending, {render: "Successfully Minted.", type: "success", isLoading: false, autoClose: 3000, className: 'rotateY animated', closeButton: true, pauseOnFocusLoss: false});
				} else {
					toast.update(toastPending, {render: "Some Error occured.", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
				}

				getTransactionHis();
			}).catch(err => {
				toast.update(toastPending, {render: "Some Error occured.", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
			})
		} else {
			toast.update(toastPending, {render: "Failed Mint.", type: "error", isLoading: false, closeButton: true, autoClose: 3000});
		}
		*/
	}

	const getTransactionHis = async () => {
		const res = await axios.post(process.env.REACT_APP_SLAMBACKEND + 'api/transaction', {token: wallet.token});
		const titleArr = ['Random', 'Epic', 'Legend'];
		let getResult = [];
		res.data.transactions.map((row, i) => {
			if(row.isNFT?.length > 2) {
				getResult.push({
					amount: row.isNFT.substr(2, 1) * priceInSLAM[Number(row.isNFT.substr(3, 1))],
					title: titleArr[Number(row.isNFT.substr(3, 1))],
					txhash: `${process.env.REACT_APP_BLOCK_EXPLORER_BASEURL}/${row.txhash}`,
					createDate: row.created_at
				});
			}
		});
		setRecentTx(getResult);
		setSLAMBalance(res.data.slam);
	}

	return (
		<div className="HomeScreen">
			<div className="top">
				<div className="background">
					<Header 
						selected="Home" 
						isReserveClicked = {isReserveClicked} 
						removeReserveClicked = {removeReserveClicked} 
						buyAction = {buyAction}
						iValue={itemValue} 
						bnbBalance = {userBalance}
						slamBalance = {userSlamBalance}
						updateTx = {recentTx}
						priceInETH = {priceInETH}
						priceInBNB = {priceInBNB}
						priceInSLAM = {priceInSLAM}
						setPriceInETH = {setPriceInETH}
						setPriceInBNB = {setPriceInBNB}
						setPriceInSLAM = {setPriceInSLAM}
					/>
					<div className="top_main">
						<div className="top_content">
							<div className="content_title">Collect and earn on <font color="#216AF5">NFT<img src="/image/top_img1.png" /></font> bubbles</div>

							<div className="content_text">Make money in the BubbleX Metaverse by collecting and combining your Bubbles to create one high quality Bubble with higher rewards. Raise the statistics and price of your BubbleX character by collecting different accessories and clothes to make it more fashionable.</div>
							<div className="content_btnGroup">
								<a className="purchaseBtn" href="/#reserveGroup">Purchase</a>
								<a className="learnMore" href="/pdf/SLAMCOIN WHITEPAPER .pdf" target="_blank">Learn More</a>
								<img src="/image/top_img2.png" />
							</div>
						</div>
						<div className="bubble_video">
							<div className="video_img">
								<img src="/image/Group.png" alt="" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="content1">
				<div className="content1_item">
					<div className="content_icon">
						<img src="/image/brush.svg" alt="" />
					</div>
					<div className="title">Art & Technology</div>
					<div className="content">BubbleX Metaverse is based on 10,000 limited collections of one-of-a-kind NFT bubble characters that are classified as Common, Epic, or Legendary. The bubbles contain whole worlds and random stuff that depend on the user’s choice. </div>
				</div>

				<div className="content1_item">
					<div className="content_icon">
						<img src="/image/discount-circle.svg" alt="" />
					</div>
					<div className="title">50% to NFT owners forever</div>
					<div className="content">DNA of each bubble consists of 12000  attributes. The result is billions of unique characters</div>
				</div>

				<div className="content1_item">
					<div className="content_icon">
						<img src="/image/vs_img.png" alt="" />
					</div>
					<div className="title">First NFT battles</div>
					<div className="content">We have introduced a gene modification attribute on the BubbleX characters that will allow members to chat and mate with a character by purchasing premium likes on the platform. These characters will be worth more than others on the platform. Mating with the genetically modified characters will produce babies that are worth more. </div>
				</div>
			</div>

			<div className="content2">
				<div className="video_img">
					<img src="/image/bubble_video.png" alt="" style={{ opacity: (showVideo ? 0 : 1) }} />
					{showVideo ? <video autoPlay controls onEnded={() => setShowVideo(false)}>
						<source src="/image/1.mp4" type="video/mp4"></source>
					</video> : <></>}
					{!showVideo ? <img src="/image/videoPlay.png" alt="" onClick={() => setShowVideo(true)} /> : <></>}
				</div>
				<div className="content">
					<div className="title">Our advertise was shown on Times Square</div>
					<div className="text">Recently we rented banners in Times Square and showed our product to thousands of people. So, hurry up! There’re plenty of customers willing to buy Bubbles.<br /><br />Become one of the luckiest!</div>
				</div>
				<img src="/image/img2.png" alt="" />
			</div>

			<div className="buyContent">
				<div className="buyContent1">
					<div className="title">Special prices for $SLM buyers</div>
					<div className="text">For now we accept different crypto tokens, but for those who pays with $SLM, we’ll offer special prices and discounts.<br /><br />
						If you’re interested in purchasing of few bubbles, you can visit <font color="#216AF5">SlamWallet</font> and get some $SLM.<br /><br />
						Hurry up, they’re growing up extremely fast!</div>
					<div className="getSLM">Get $SLM</div>
				</div>
				<div className="buyContent2">
					<img src="/image/iphone.png" alt="" />
				</div>
			</div>

			<div className="content2">
				<div className="video_img">
					<img src="/image/img1.png" alt="" style={{ opacity: (showVideo1 ? 0 : 1) }} />
					{showVideo1 ? <video autoPlay controls onEnded={() => setShowVideo1(false)}>
						<source src="/image/2.MOV" type="video/mp4"></source>
					</video> : <></>}
					{!showVideo1 ? <img src="/image/videoPlay.png" alt="" onClick={() => setShowVideo1(true)} /> : <></>}
				</div>
				<div className="content">
					<div className="title">Our advertise was shown on Times Square</div>
					{/* <div className="text">Recently we rented banners in Times Square and showed our product to thousands of people. So, hurry up! There’re plenty of wishing customers to buy Bubbles.<br /><br />Become one of the luckiest!</div> */}
				</div>
				<img src="/image/img2.png" alt="" />
			</div>

			<div className="bubbleContent">
				<div className="title">How the BubbleCharacters Metaverse works</div>
				<div className="content1">
					<div className="bubbleContent">
						<div className="bubbleImg">
							<img src="/image/bubble.png" alt="" />
							<img src="/image/line4.png" alt="" className="line4" />
						</div>
						<div className="circle">
							<img src="/image/circle1.png" alt="" />
							<img src="/image/line1.png" className="line1" alt="" />
						</div>
						<div className="title">Get a Bubble today</div>
						<div className="text">Slamcharacters start with 10k limited collection of one-of-a-kind NFT Bubbles.</div>
					</div>
					<div className="bubbleContent">
						<div className="bubbleImg">
							<img src="/image/bubble2.gif" alt="" />
							<img src="/image/line5.png" alt="" className="line5" />
						</div>
						<div className="circle">
							<img src="/image/circle2.png" alt="" />
							<img src="/image/line2.png" alt="" className="line2" />
						</div>
						<div className="title">Hatch your Character on December 27th</div>
						<div className="text">Upon hatching your bubble, you get a character who's class is determined by the rarity of your mated characters.</div>
					</div>
					<div className="bubbleContent">
						<div className="bubbleImg">
							<img src="/image/farm.png" alt="" />
							<img src="/image/line6.png" alt="" className="line6" />
						</div>
						<div className="circle">
							<img src="/image/circle3.png" alt="" />
							<img src="/image/line3.png" alt="" className="line3" />
						</div>
						<div className="title">There are 3 classes of the Characters</div>
						<div className="text">
							<div className="Common">Common</div>
							<div className="Epic">Epic</div>
							<div className="Legendary">Legendary</div>
						</div>
					</div>
				</div>
				<div className="bubbleContent">
					<div className="bubbleImg">
						<img src="/image/bubble3.png" alt="" />
						<img src="/image/play.png" alt="" onClick={onSetShowVideoPlayModal} />
					</div>
					<div className="circle">
						<img src="/image/circle4.png" alt="" />
					</div>
					<div className="title">Meet the BubbleCharacters Metavers</div>
					<div className="text">In the BubbleX Metaverse, characters will have specific genes and their combinations. The number of genes per character influence their class</div>
				</div>
			</div>

			<div className="content3">
				<img src="/image/img3.png" alt="" />
				<div className="content">
					<div className="title">How much your Legendary Character may earn?</div>
					<div className="mintContent">
						<div className="title">Legendary Character earning calculator</div>
						<div className="text">All breeding number in the system</div>
						<div className="tokenCount">{mintTokenCount}</div>
						<input type="range" min="100000" max="5000000" value={mintTokenCount} className="mintSlider" onChange={onSetMintTokenCount} style={sliderBackground} />
						{/* <img src="/image/img4.png" alt="" /> */}
						<img src="/image/img5.png" alt="" />
						<div className="valueGroup">
							<div>100K</div>
							<div>200K</div>
							<div>500K</div>
							<div>1M</div>
							<div>2M</div>
							<div>2.5M</div>
							<div>3M</div>
							<div>4M</div>
							<div>5M</div>
						</div>
						<div className="text">Earnings</div>
						<div className="tokenValue">$25,564.56</div>
						<div className="ethValue">18.3 ETH</div>
						<div className="mintBtn">Mint a Bubble</div>
					</div>
				</div>
			</div>

			<div className="content4">
				<div className="title">Bubblex Evolution</div>
				<div className="text">BubbleX includes 10,000 NFTs, of which 20% comprises real people. The game includes male and female characters that produce babies upon matching. BubbleX NFTs primarily offer you networking and marketing opportunities
				</div>
				<div className="desktopVersion">
					<div className="content1">
						<div className="subtitle" id="metaverseDescription">Metaverse</div>
						<div className="roadmapItem">
							<div>
								<img src="/image/roadmap1.gif" alt="" />
							</div>
							<div className="itemText">Members are introduced to the generation of <div>BubbleX Metaverse</div> and the steps to its evolution.</div>
						</div>

						<div className="roadmapItem">
							<img src="/image/roadmap2.png" alt="" />
							<div className="itemText">The presented bubble contains whole worlds and while members cannot predict what is inside the bubble in the presale, you are presented the chance to <div>buy</div> what you want later on in the BubbleX Metaverse.</div>
						</div>
						<div className="roadmapItem">
							<img src="/image/roadmap3_1.png" alt="" />
							<img src="/image/roadmap3_2.png" alt="" />
							<div className="itemText">You can make <div>more money</div> in the BubbleX Metaverse by combining bubbles to form one bubble that is characterized by higher quality and high rewards.</div>
						</div>
						<div className="roadmapItem">
							<img src="/image/roadmap4.png" alt="" />
							<div className="itemText">You are presented the opportunity to make your character more fashionable and raise the statistics and <div>price</div> of your character by collecting different accessories and clothes for your character.</div>
						</div>
						<div className="subtitle subtitle1" id="bubbleXMatch">Matching</div>
						<div className="roadmapItem">
							<img src="/image/roadmap5.png" alt="" />
							<div className="itemText">You have the chance to <div>match</div> or <div>mate</div> your character with other characters of the opposite sex based on the rarity of the characters.</div>
						</div>
						<div className="roadmapItem">
							<img src="/image/roadmap6.png" alt="" />
							<div className="itemText">A mated pair of characters get their baby, but the <div>duration</div> of birth is determined by the rarity of the parents.</div>
						</div>
						<div className="roadmapItem">
							<img src="/image/roadmap7.png" alt="" />
							<div className="itemText">With BubbleX, you are at liberty to collect your <div>earnings</div> at your own discretion. We do not impose waiting periods or thresholds for your withdrawals.</div>
						</div>
					</div>
					<img src="/image/roadmap.png" alt="" />
					<div className="content2">
						<div className="roadmapItem">
							<img src="/image/roadmap8.png" alt="" />
							<div className="itemText">Members are <div>presented</div> with the first bubble, which marks the inception of the BubbleX Metaverse. The bubble contains random stuff that depend on the user’s choice.</div>
						</div>

						<div className="roadmapItem">
							<img src="/image/roadmap9.png" alt="" />
							<div className="itemText">Members are presented the opportunity to create their own <div>worlds</div> or companies in the BubbleX Metaverse. Other marketplaces inside the BubbleX Metaverse include Meta, Xerox, and Apple.</div>
						</div>
						<div className="roadmapItem">
							<img src="/image/roadmap10.png" alt="" />
							<div className="itemText">Rewards from the bubble are presented in <div>3D</div> and members can rotate their characters to view them from different angles.</div>
						</div>
						<div className="roadmapItem">
							<img src="/image/roadmap11.png" alt="" />
							<div className="itemText"><div>Marketing</div> and <div>networking</div> are a big part of BubbleX. You are thus allowed to attend parties, meet new friends,
								chat and listen to music together to become
								a member of the larger BubbleX family/community.</div>
						</div>
						<div className="roadmapItem">
							<img src="/image/roadmap12.png" alt="" />
							<div className="itemText">It is  possible to match or mate your characters with other people’s characters. Upon matching, the characters will fall in <div>love.</div></div>
						</div>
						<div className="subtitle" id="bubbleCoinMining">Coin mining</div>
						<div className="roadmapItem">
							<img src="/image/roadmap13.png" alt="" />
							<div className="itemText">You are presented the opportunity to <div>mine coins</div> in BubbleX. Money invested does not necessarily need to be spent. Rather, you earn more money than your initial investment.</div>
						</div>
						<div className="roadmapItem">
							<img src="/image/roadmap14.png" alt="" />
							<div className="itemText">You are given the opportunity and freedom to either re-invest or withdraw your earnings. Our goal is for you to grow your investment. <div>Enjoy!</div> </div>
						</div>
					</div>
				</div>
				<div className="mobileVersion">
					<div className="subtitle" id="metaverseDescription1">Metaverse</div>
					<div className="roadmapItem">
						<div>
							<img src="/image/roadmap1.gif" alt="" />
						</div>
						<div className="itemText">Members are introduced to the generation of <div>BubbleX Metaverse</div> and the steps to its evolution.</div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap8.png" alt="" />
						<div className="itemText">Members are <div>presented</div> with the first bubble, which marks the inception of the BubbleX Metaverse. The bubble contains random stuff that depend on the user’s choice.</div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap2.png" alt="" />
						<div className="itemText">The presented bubble contains whole worlds and while members cannot predict what is inside the bubble in the presale, you are presented the chance to <div>buy</div> what you want later on in the BubbleX Metaverse.</div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap9.png" alt="" />
						<div className="itemText">Members are presented the opportunity to create their own <div>worlds</div> or companies in the BubbleX Metaverse. Other marketplaces inside the BubbleX Metaverse include Meta, Xerox, and Apple.</div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap3_1.png" alt="" />
						<img src="/image/roadmap3_2.png" alt="" />
						<div className="itemText">You can make <div>more money</div> in the BubbleX Metaverse by combining bubbles to form one bubble that is characterized by higher quality and high rewards.</div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap10.png" alt="" />
						<div className="itemText">Rewards from the bubble are presented in <div>3D</div> and members can rotate their characters to view them from different angles.</div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap4.png" alt="" />
						<div className="itemText">You are presented the opportunity to make your character more fashionable and raise the statistics and <div>price</div> of your character by collecting different accessories and clothes for your character.</div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap11.png" alt="" />
						<div className="itemText"><div>Marketing</div> and <div>networking</div> are a big part of BubbleX. You are thus allowed to attend parties, meet new friends,
							chat and listen to music together to become
							a member of the larger BubbleX family/community.</div>
					</div>

					<div className="subtitle subtitle1" id="bubbleXMatch1">Matching</div>
					<div className="roadmapItem">
						<img src="/image/roadmap5.png" alt="" />
						<div className="itemText">You have the chance to <div>match</div> or <div>mate</div> your character with other characters of the opposite sex based on the rarity of the characters.</div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap12.png" alt="" />
						<div className="itemText">It is  possible to match or mate your characters with other people’s characters. Upon matching, the characters will fall in <div>love.</div></div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap6.png" alt="" />
						<div className="itemText">A mated pair of characters get their baby, but the <div>duration</div> of birth is determined by the rarity of the parents.</div>
					</div>

					<div className="subtitle subtitle2" id="bubbleCoinMining1">Coin mining</div>
					<div className="roadmapItem">
						<img src="/image/roadmap13.png" alt="" />
						<div className="itemText">You are presented the opportunity to <div>mine coins</div> in BubbleX. Money invested does not necessarily need to be spent. Rather, you earn more money than your initial investment.</div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap7.png" alt="" />
						<div className="itemText">With BubbleX, you are at liberty to collect your <div>earnings</div> at your own discretion. We do not impose waiting periods or thresholds for your withdrawals.</div>
					</div>

					<div className="roadmapItem">
						<img src="/image/roadmap14.png" alt="" />
						<div className="itemText">You are given the opportunity and freedom to either re-invest or withdraw your earnings. Our goal is for you to grow your investment. <div>Enjoy!</div> </div>
					</div>
				</div>
			</div>

			<div className="characterMakeComponent">
				<div className="content">
					<img src="/image/charactermake.png" alt="" className="desktopVersion" />
					<img src="/image/charactermake_mobile.png" alt="" className="mobileVersion" />
					<div className="makeGroup">
						<div className="title">Get your 3D Character!</div>
						<div className="text">If you own 2D version of BubbleX Character, you can get 3D copy of that for abillity to use it in VR BubbleX Metaverse.</div>
					</div>

				</div>
				<img src="/image/img19.png" alt="" />
			</div>

			<div className="content5">
				<div className="title">Bubble reserve in several steps</div>
				<div className="text">We have developed reservation so there are no gas wars. Reserving a bubble today, means you already own it.</div>
				<div className="contentGroup">
					<div className="contentItem">
						<img src="/image/img7.png" alt="" />
						<div className="text">498 Random sold for <font color="#E539E5">0.15 ETH</font> each</div>
						<div className="text">1 Epic sold for <font color="#E539E5">1.5 ETH</font></div>
						<div className="text">1 Legendary sold for <font color="#E539E5">15 ETH</font></div>
					</div>
					<div className="contentItem disabled">
						<img src="/image/img8.png" alt="" />
						<div className="text">998 Random sold for <font color="#E539E5">0.15 ETH</font> each</div>
						<div className="text">1 Epic sold for <font color="#E539E5">1.5 ETH</font></div>
						<div className="text">1 Legendary sold for <font color="#E539E5">15 ETH</font></div>
					</div>
					<div className="contentItem disabled">
						<img src="/image/img9.png" alt="" />
						<div className="text">498 Random sold for <font color="#E539E5">0.15 ETH</font> each</div>
						<div className="text">1 Epic sold for <font color="#E539E5">1.5 ETH</font></div>
						<div className="text">1 Legendary sold for <font color="#E539E5">15 ETH</font></div>
					</div>
					<div className="contentItem contentItem1 disabled">
						<img src="/image/bubble3.gif" alt="" />
					</div>
				</div>
				<div className="roadMapGroup">
					<div className="roadMapItem">
						<img src="/image/roadMap_active.png" alt="" />
						<div className="roadMapText">Reservation step 1</div>
					</div>
					<img src="/image/roadMap_line.png" alt="" />
					<div className="roadMapItem disabled">
						<img src="/image/roadMap_disabled.png" alt="" />
						<div className="roadMapText">Reservation step 2</div>
					</div>
					<img src="/image/roadMap_line.png" alt="" />
					<div className="roadMapItem disabled">
						<img src="/image/roadMap_disabled.png" alt="" />
						<div className="roadMapText">Reservation step 3</div>
					</div>
					<img src="/image/roadMap_line.png" alt="" />
					<div className="roadMapItem disabled">
						<img src="/image/roadMap_disabled.png" alt="" />
						<div className="roadMapText">Reservation step 4</div>
					</div>
				</div>
			</div>

			<div className="content6">
				<div className="mainContent">
					<div className="title">A Bubble today,<br /> a <font color="#E539E5">Character</font> tomorrow</div>
					<div className="text">The whole SlamCharacters Metaverse will arise from 10Klimited NFT Eggs.</div>
					<div className="text">Everyone can buy Bubble
						<div className="buttonGroup">
							<div className="randomBtn">Random</div>
							<div className="epicBtn">Epic</div>
							<div className="legendaryBtn">Legendary</div>
						</div>
						with character inside
					</div>
					<div className="reserveGroup">
						<div className="reserveItem">
							<img src="/image/random.png" alt="" />
							<div className="titlePanel random" id="reserveGroup">Random</div>
							<div className="itemPanel">
								<div className="value">
									<div className="ethValue">{ Number(wallet.chainId) == Number(ethChainID) ? priceInETH[0] : priceInBNB[0] }</div>
									<div className="ethText">{ Number(wallet.chainId) == Number(ethChainID) ? 'ETH' : 'BNB'}</div>
									<div className="ethValue">/ { priceInSLAM[0] }</div>
									<div className="ethText">$SLM</div>
								</div>
								<div className="textGroup">
									<div className="text">From Random Bubbles you may get</div>
									<div className="text"><font color="#FFD53F">100</font> - Legendary Characters</div>
									<div className="text"><font color="#7AA8FF">1000</font> - Epic Characters</div>
									<div className="text"><font color="#CECECE">8,900</font> - Common Characters</div>
								</div>
								<div className="valueGroup">
									<img src="/image/minusBtn.png" alt="" onClick={() => { randomCount > 0 ? setRandomCount(randomCount - 1) : setRandomCount(randomCount) }} />
									<div className="value">{randomCount}</div>
									<img src="/image/plusBtn.png" alt="" onClick={() => { randomCount == 5 ? setRandomCount(randomCount) : setRandomCount(randomCount + 1) }} />
								</div>
								<div className="text">Maximum 5 bubbles can be reserved per wallet.</div>
								<div className="reserveBtn" onClick={() => {onSetRandomReverse(randomCount);}}>Reserve a Bubble</div>
								<div className="bubbleValueGroup">
									<div className="bubbleValue">0/1000</div>
									<div className="bubbleText">Bubbles</div>
								</div>
							</div>
						</div>
						<div className="reserveItem">
							<img src="/image/epic.png" alt="" />
							<div className="titlePanel epic">Epic</div>
							<div className="itemPanel">
								<div className="value">
									<div className="ethValue">{ Number(wallet.chainId) == Number(ethChainID) ? priceInETH[1] : priceInBNB[1] }</div>
									<div className="ethText">{ Number(wallet.chainId) == Number(ethChainID) ? 'ETH' : 'BNB'}</div>
									<div className="ethValue">/ { priceInSLAM[1] }</div>
									<div className="ethText">$SLM</div>
								</div>
								<div className="textGroup">
									<div className="text">An Epic Character will hatch from this Bubble. There are 20 Epic Bubbles available for sale.</div>
								</div>
								<div className="valueGroup">
									<img src="/image/minusBtn.png" alt="" onClick={() => { epicCount > 0 ? setEpicCount(epicCount - 1) : setEpicCount(epicCount) }} />
									<div className="value">{epicCount}</div>
									<img src="/image/plusBtn.png" alt="" onClick={() => { epicCount == 5 ? setEpicCount(epicCount) : setEpicCount(epicCount + 1) }} />
								</div>
								<div className="text">Maximum 5 bubbles can be reserved per wallet.</div>
								<div className="reserveBtn" onClick={() => {onSetEpicReverse(epicCount);}}>Reserve a Bubble</div>
								<div className="bubbleValueGroup">
									<div className="bubbleValue">0/1000</div>
									<div className="bubbleText">Bubbles</div>
								</div>
							</div>
						</div>
						<div className="reserveItem">
							<img src="/image/legendary.png" alt="" />
							<div className="titlePanel legendary">Legendary</div>
							<div className="itemPanel">
								<div className="value">
									<div className="ethValue">{ Number(wallet.chainId) == Number(ethChainID) ? priceInETH[2] : priceInBNB[2] }</div>
									<div className="ethText">{ Number(wallet.chainId) == Number(ethChainID) ? 'ETH' : 'BNB'}</div>
									<div className="ethValue">/ { priceInSLAM[2] }</div>
									<div className="ethText">$SLM</div>
								</div>
								<div className="textGroup">
									<div className="text">A Legendary Character will hatch from this Bubble. There are 10 Legendary Bubbles available for sale.</div>
								</div>
								<div className="valueGroup">
									<img src="/image/minusBtn.png" alt="" onClick={() => { legendaryCount > 0 ? setLegendaryCount(legendaryCount - 1) : setLegendaryCount(legendaryCount) }} />
									<div className="value">{legendaryCount}</div>
									<img src="/image/plusBtn.png" alt="" onClick={() => { legendaryCount == 5 ? setLegendaryCount(legendaryCount) : setLegendaryCount(legendaryCount + 1) }} />
								</div>
								<div className="text">Maximum 5 bubbles can be reserved per wallet.</div>
								{/* <div className="totalValueGroup">
									<div className="totalText">Total</div>
									<div className="ethValue">0.15ETH</div>
								</div> */}
								<div className="reserveBtn" onClick={() => {onSetLegendaryReverse(legendaryCount);}}>Reserve a Bubble</div>
								<div className="bubbleValueGroup">
									<div className="bubbleValue">0/1000</div>
									<div className="bubbleText">Bubbles</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="content7">
				<img src="/image/img11.png" alt="" className="desktopVersion" />
				<img src="/image/mobile_img11.png" alt="" className="mobileVersion" />
				<div className="content1">
					<div className="title">Few words about matching</div>
					<div className="text">Your characters will fall in love. You can mate your characters, but also you can mate it with characters of another people.</div>
				</div>
				<div className="content2">
					<div>
						<img src="/image/4.gif" alt="" />
					</div>
				</div>
			</div>

			<div className="buyWorldComponent">
				<div className="carouselPanel">
					<Carousel showThumbs={false} showStatus={false}>
						<div>
							<img src="/image/carousel.png" alt="" />
						</div>
						<div>
							<img src="/image/carousel.png" alt="" />
						</div>
						<div>
							<img src="/image/carousel.png" alt="" />
						</div>
						<div>
							<img src="/image/carousel.png" alt="" />
						</div>
					</Carousel>
					<div className="comingsoonBtn mobileVersion">Coming Soon</div>
				</div>
				<div className="content1">
					<div className="title">Buy your own world</div>
					<div className="text">You can purchase bubble landscape or mansion for BubbleX Metaverse. Become one of the most succesfull guy in our universe.</div>
					<div className="comingsoonBtn desktopVersion">Coming Soon</div>
				</div>
			</div>

			<div className="content9">
				<div className="content1">
					<div className="subContent">
						<div className="subContent1">
							<div className="title">7 smart <br /> contracts</div>
							<div className="text">CryptoCharacters is governed by 7 smart contracts interconnected with each through the logic of NFT creation.</div>
						</div>
						<img src="/image/uchiha.png" alt="" className="desktopVersion" />
						<img src="/image/uchiha.png" alt="" className="mobileVersion" />
					</div>
				</div>
				<div className="content2">
					<img src="/image/img13.png" alt="" />
					<div className="title">Limited <br />collection</div>
					<div className="text">Become the owner of a limited collection of Bubbles from which Characters hatch.</div>
				</div>
			</div>

			<div className="content10">
				<div className="content1 content">
					<img src="/image/img14.png" alt="" />
					<div className="title">Bubble<br /> Language<br /> Kassis</div>
					<div className="text">Networking and socializing are a bigger part of BubbleX, NFT holders can socialize, attend parties, listen to music, and engage with like-minded character owners. Members will be able to make money while socializing and networking with other character owners. </div>
				</div>
				<div className="content2 content">
					<img src="/image/img15.png" alt="" />
					<div className="title">Battle on <br />blockchain</div>
					<div className="text">Members will be able to match their characters (with own characters) or with other people’s characters and produce babies depending on the rarity of the matched characters.</div>
				</div>
				<div className="content3 content">
					<div className="textGroup">
						<div className="title">Uniqu gene<br /> combinations</div>
						<div className="text">Become the owner of a limited collection of Bubbles from which Characters hatch.</div>
					</div>
					<img src="/image/dogy.png" alt="" />
				</div>
			</div>

			<div className="slamTeam">
				<div className="title">Slam Team</div>
				<div className="description">We are a team of bubble lovers with 75+ members. Together we developed our SlamCharacter Metaverse, where advanced art and high-end technology meet. </div>
				<div className="adminGroup">
					<div className="adminItem">
						<div className="avatarBG">
							<img src="/image/milano.png" alt="" />
						</div>
						<div className="name">Milano</div>
						<div className="position">CEO</div>
						<div className="description">NFT and blockchain enthusiast,
							<br />experienced in social networking,
							<br />fintech and investments.</div>
					</div>
					<div className="adminItem">
						<div className="avatarBG">
							<img src="/image/alex.png" alt="" />
						</div>
						<div className="name">Alex</div>
						<div className="position">Co-founder</div>
						<div className="description">Collector and investor. Negotiating
							<br />and implementing partnerships,
							<br />leading NFT ventures partners
							<br />pipeline and management.</div>
					</div>
					<div className="adminItem">
						<div className="avatarBG">
							<img src="/image/dmitri.png" alt="" />
						</div>
						<div className="name">Dmitri</div>
						<div className="position">Head of Development</div>
						<div className="description">Experienced tech geek specializing
							<br />in smart contracts, web and mobile
							<br />apps development, AI and even
							<br />more.</div>
					</div>
					<div className="adminItem">
						<div className="avatarBG">
							<img src="/image/sonya.png" alt="" />
						</div>
						<div className="name">Sonya</div>
						<div className="position">Art Designer</div>
						<div className="description">Digital art enthusiast, master of
							<br />vector graphics with mind-blowing
							<br />ideas and design solutions.</div>
					</div>
				</div>
			</div>

			<div className="faqPanel">
				<div className="title">FAQ</div>
				<div className="faqItem">
					<div className="content">
						<div className="titleBar" data-toggle="collapse" href="#faq1" role="button" area-expanded="true" area-controls="faq1">
							<div className="title">What is SlamBubbles?</div>
							<div  ></div>
						</div>
						<div className="text collapse show" id="faq1">BubbleX is a unique NFT project that merges advanced art and high-end technology. The project is based on the ETH blockchain. </div>
					</div>

				</div>
				<div className="faqItem">
					<div className="content">
						<div className="titleBar collapsed" data-toggle="collapse" href="#faq2" role="button" area-expanded="true" area-controls="faq2" >
							<div className="title">Where can I buy BubbleX NFTs?</div>
							<div ></div>
						</div>
						<div className="text collapse" id="faq2">You can buy BubbleX NFTs from our official marketplace or from platforms such as OpenSea. </div>
					</div>

				</div>

				<div className="faqItem">
					<div className="content">
						<div className="titleBar collapsed" data-toggle="collapse" href="#faq3" role="button" area-expanded="true" area-controls="faq3">
							<div className="title">How do I get a character?</div>
							<div  ></div>
						</div>
						<div className="text collapse" id="faq3">You can get a character through any of the following means:
							<div><div></div>Get one from the Egg/Bubble</div>
							<div><div></div>Buy one on the Marketplace</div>
							<div><div></div>Mate two characters</div>
							<div><div></div>Win one in the battle arena</div> </div>
					</div>

				</div>

				<div className="faqItem">
					<div className="content">
						<div className="titleBar collapsed" data-toggle="collapse" href="#faq4" role="button" area-expanded="true" area-controls="faq4">
							<div className="title">How may I earn?</div>
							<div  ></div>
						</div>
						<div className="text collapse" id="faq4">You earn by collecting characters either from the bubble or through mating of characters and interacting with other users. The platform will divide half of all mating earnings equally among owners of the Legendary characters. You also earn when you rent your character or win in the battle arena and earn ETH. All earnings are subject to a play-to-earn model and we neither guarantee nor provide any expectations of profits. Kindly read all our guidelines to establish strategies and skills that will enhance your wins. </div>
					</div>

				</div>
				{!showFaqMore ? <div className="viewMoreBtn" onClick={() => setShowFaqMore(true)}>View More</div> :
					<div style={{ width: "100%" }}>
						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq5" role="button" area-expanded="true" area-controls="faq5">
									<div className="title">How many BubbleX characters are available?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq5">10,000 one-of-a-kind NFT bubbles will be available for minting. After the initial minting, new characters will only appear through mating two characters of the opposite sex.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq6" role="button" area-expanded="true" area-controls="faq6">
									<div className="title">When does the character minting start?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq6">All 10,000 characters will be listed for minting at once. Follow our news for the release date.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq7" role="button" area-expanded="true" area-controls="faq7">
									<div className="title">When will the characters be revealed?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq7">The ‘International hatching day’ is set at December 27th. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq8" role="button" area-expanded="true" area-controls="faq8">
									<div className="title">What are the benefits of holding the characters/bubbles?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq8">After hatching, owners can combine their bubbles/characters to make one bubble with a higher quality and fetch higher prices, boost the value of their characters by collecting accessories to make the characters more fashionable and members can mate their characters with other characters of the opposite sex.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq9" role="button" area-expanded="true" area-controls="faq9">
									<div className="title">How do I hatch the bubbles?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq9">Open the profile of your bubble/character
									<div><div></div>Click on hatch</div>
									<div><div></div>Confirm hatching on the BubbleX website</div>
									<div><div></div>Confirm hatching on the Blockchain</div>
									<div><div></div>You will see your NFT in your wallet </div> </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq10" role="button" area-expanded="true" area-controls="faq10">
									<div className="title">I have lost access to my wallet. Is it possible to recover my characters?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq10">Unfortunately if you lose access to your wallet, we can’t recover your characters. It is literally impossible.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq11" role="button" area-expanded="true" area-controls="faq11">
									<div className="title">How many characters can I mint?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq11">You are allowed a minimum of one and a maximum of 5 bubbles per wallet.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq12" role="button" area-expanded="true" area-controls="faq12">
									<div className="title">How do I know what class of characters will be hatched from my bubbles?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq12">It will mostly be a game of luck. You will not be able to predict the type of character that will be hatched from your bubble. Hatching is determined by the rarity of your mated characters. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq13" role="button" area-expanded="true" area-controls="faq13">
									<div className="title">Do I have to wait for all the characters to be minted to mate my bubbles?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq13">The ‘International Hatching Day’ is set for December 27th. You have the choice to either mate your bubbles on that day or wait.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq14" role="button" area-expanded="true" area-controls="faq14">
									<div className="title">How many out of 10,000 characters will be legendary?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq14">There will be a random distribution in which there will be 100 Legendary Characters, 1000 Epic Characters, and 8,900 Common characters. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq15" role="button" area-expanded="true" area-controls="faq15">
									<div className="title">How long can I keep my Egg unhatched?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq15">There will be no deadline. You are at liberty to keep your Egg unhatched for as long as you want. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq16" role="button" area-expanded="true" area-controls="faq16">
									<div className="title">Wait, is it true that I will have two NFTs when I hatch my Egg?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq16">Yes! Your characters will get a baby upon mating but the duration will depend on the rarity of your mated characters.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq17" role="button" area-expanded="true" area-controls="faq17">
									<div className="title">Why is it worth buying a random Bubble?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq17">A random Bubble can hatch into a Legendary character or (1% probability) or into an Epic character (10% probability). So, buying 100 random Bubbles increases the odds of getting a Legendary character and in a similar vein, buying 10 random Bubbles will almost certainly guarantee one Epic character. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq18" role="button" area-expanded="true" area-controls="faq18">
									<div className="title">I don’t have Chrome or Firefox, can I still get a character?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq18">We highly recommend sticking with either Chrome or Firefox and while it is technically possible to use other browsers, we cannot guarantee seamless performance. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq19" role="button" area-expanded="true" area-controls="faq19">
									<div className="title">How many characters do I need for the beginning?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq19">It is beneficial to have two characters in the beginning for the purposes of mating. However, you can also have one character in the beginning.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq20" role="button" area-expanded="true" area-controls="faq20">
									<div className="title">How many possible characters are there?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq20">There are no limitations. We literally have billions of available genetic combinations in that for each of the created characters, the DNA of the bubble consists of 12,000 attributes and the result is billions of characters. However, it is worth noting that the total number of characters released by the platform is 10,000 and these firstborns are characterized by several privileges. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq21" role="button" area-expanded="true" area-controls="faq21">
									<div className="title">Seems like I can’t find an answer to my question here. How do I contact the BubbleX team?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq21">You can reach us at slam_support@mail.com. We highly recommend that you describe your question or problem more precisely and include any relevant links or BubbleX related transactions so that our team can address your questions or issues promptly.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq22" role="button" area-expanded="true" area-controls="faq22">
									<div className="title">How do I stay up to date about BubbleX?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq22">Discord server in addition to our official Twitter channel are the best places for you to keep abreast with BubbleX news.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq23" role="button" area-expanded="true" area-controls="faq23">
									<div className="title">What are genes?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq23">In the BubbleX Metaverse, all our NFT characters have certain genes and their combinations. Similar to humans, genes determine the abilities and appearances of the characters. The number of genes affect the characters’ class, which is classified as Random, Epic, or Legendary. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq24" role="button" area-expanded="true" area-controls="faq24">
									<div className="title">Where can I find information about the roadmap?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq24">Follow the links on our web page for a more detailed information on the roadmap.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq25" role="button" area-expanded="true" area-controls="faq25">
									<div className="title">What are the classes of Characters?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq25">There are three total classes of characters namely
									<div><div></div>Common characters</div>
									<div><div></div>Epic characters</div>
									<div><div></div>Legendary characters</div> </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq26" role="button" area-expanded="true" area-controls="faq26">
									<div className="title">How can I buy a BubbleX character?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq26">There are two ways of buying characters:
									<div><div></div>You can purchase at the marketplace on our platform or </div>
									<div><div></div>You can buy from other users through third-party marketplaces such as OpenSeas </div> </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq27" role="button" area-expanded="true" area-controls="faq27">
									<div className="title">I can’t buy a character. What is the reason?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq27">Please ensure that you have sufficient funds and/or you are not blocked by our system.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq28" role="button" area-expanded="true" area-controls="faq28">
									<div className="title">Is my character a male or a female?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq28">Your character can either be a male or female. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq29" role="button" area-expanded="true" area-controls="faq29">
									<div className="title">Why do I have difficulties sending a gift?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq29">The gift option is unavailable on the platform.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq30" role="button" area-expanded="true" area-controls="faq30">
									<div className="title">I wanted to gift a character but I have a problem with payment. Why?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq30">The gift option is currently unavailable on the platform.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq31" role="button" area-expanded="true" area-controls="faq31">
									<div className="title">What is the maximum number of Characters available?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq31">The initial number of Characters is 10,000. However, we expect the BubbleX Metaverse to continuously evolve and expand due to mating. As such, the team is working on new updates. Stay tuned. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq32" role="button" area-expanded="true" area-controls="faq32">
									<div className="title">How rare is my character?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq32">Each of the characters in the BubbleX Metaverse is unique and there are no identical characters. However, the uniqueness of a character depends on the number and type of the genes therein.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq33" role="button" area-expanded="true" area-controls="faq33">
									<div className="title">How do I list my character for an auction?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq33">Complete the following steps in order to list your character for an auction:
									<div><div></div>Go to the marketplace</div>
									<div><div></div>Fill in the ‘Start price’ and ‘Final price’ and ‘Price reduction period’</div>
									<div><div></div>Press ‘Pay’</div>
									<div><div></div>Sign the transaction on the Metamask (or any other platform)</div>
									<div><div></div>Pay the ‘Gas’</div>
									<div>You will receive a confirmation email. Please note that the “Start price” and “Final price” fields cannot be lower than 0.001 ETH. </div> </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq34" role="button" area-expanded="true" area-controls="faq34">
									<div className="title">How do I cancel the sales of my character?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq34">Complete the following steps in order to remove your characters from the auction:
									<div><div></div>Go to your character’s profile</div>
									<div><div></div>Click on “Cancel order”</div>
									<div><div></div>Sign the transaction on the Metamask (or any other platform)</div>
									<div><div></div>Wait for the confirmation email of the cancellation</div> </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq35" role="button" area-expanded="true" area-controls="faq35">
									<div className="title">How do I change the price of a character?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq35">You cannot change the price after placing your character on the auction. The price will automatically fluctuate based on the ‘Start’ and ‘Final’ price.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq36" role="button" area-expanded="true" area-controls="faq36">
									<div className="title">How do I buy a character from the platform?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq36">Follow the following steps to buy a character:
									<div><div></div>Go to the profile of the character listed for sale</div>
									<div><div></div>Choose the “Buy” option</div>
									<div><div></div>Sigh the transaction on the Metamask (or other)</div>
									<div><div></div>Pay the ‘Gas’</div>
									<div>Congratulations, your character appears in your inventory!</div> </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq37" role="button" area-expanded="true" area-controls="faq37">
									<div className="title">Are Cryptocharacters a cryptocurrency like Bitcoin or Ethereum?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq37">Cryptocharacters are not a cryptocurrency. They are cryptocollectibles, NFTs thus, owning a cryptocharacter is like owning a piece of art or a property. As such, the marketplace is influenced by supply and demand. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq38" role="button" area-expanded="true" area-controls="faq38">
									<div className="title">My transaction timed out. What can I do?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq38">A “timed out” doesn’t mean the transaction has failed. It only means that the Ethereum network is very busy. This can result from high gas prices or a spike in network congestion. Consequently, BubbleX will not update until the transaction is finalized in the network.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq39" role="button" area-expanded="true" area-controls="faq39">
									<div className="title">What is gas?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq39">Gas refers to the fee (pricing value) necessary to conduct a transaction or execute a contract on the Ethereum blockchain platform (which is the blockchain network that BubbleX is built on).<br />
									The gas is used to allocate resources of the Ethereum Virtual Machine (EVM) in order for decentralized applications such as smart contracts can self-execute in a secured but decentralized manner.<br />
									The supply and demand between network miners determine the precise gas price. Network miners can refuse to execute a transaction if the gas price falls below their set threshold.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq40" role="button" area-expanded="true" area-controls="faq40">
									<div className="title">What’s Etherscan?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq40">Etherscan is a platform that allows people to track any pending or confirmed Ethereum blockchain transactions. Ethereum is a public open blockchain and as such, every interaction with the blockchain is documented in the transaction history, which is visible to anyone. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq41" role="button" area-expanded="true" area-controls="faq41">
									<div className="title">Why did my transaction fail?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq41">The main reason for a failed transaction is most likely because someone else purchased the character before you. Other causes for a transaction failure include the manual setting of the gas limit too low or bidding on an ascending auction, which implies that the price of the character rises before your offer is accepted.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq42" role="button" area-expanded="true" area-controls="faq42">
									<div className="title">My transaction failed but it still charged me gas.</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq42">Take into account that gas is paid when a request is completed on the blockchain. Note that even if a transaction fails, computing power is required to determine whether the transaction can be completed. Up until the transaction fails, the ETH network charges gas for the actions performed. Please note that the transaction fees are paid to the ETH network and miners not the BubbleX team. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq43" role="button" area-expanded="true" area-controls="faq43">
									<div className="title">Why does it cost ETH to mate characters?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq43">The costs for mating characters are divided into two, which include a transaction fee and a mating fee. Notably, every transaction requires gas, which is paid to the ETH network and miners. The mating fee is necessary for creating new characters on the blockchain. The mating fee varies depending on the character’s genes. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq44" role="button" area-expanded="true" area-controls="faq44">
									<div className="title">I sold a character, where is my ETH?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq44">All transactions take place on the blockchain and as such, you are assured of getting your ETH upon waiting. If the issue is not resolved, write to our support team at slam_support@mail.com. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq46" role="button" area-expanded="true" area-controls="faq46">
									<div className="title">What is ETH (Ether, Ethereum)?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq46">ETH or Ether is the cryptocurrency used to complete transactions on the blockchain and BubbleX is built on the ETH blockchain. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq47" role="button" area-expanded="true" area-controls="faq47">
									<div className="title">Why do I need Ethereum?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq47">Your fiat money (USD, EUR, GBP etc.) needs to be converted into ETH in order to pay for BubbleX transactions on the Ethereum network. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq48" role="button" area-expanded="true" area-controls="faq48">
									<div className="title">Do you have a blockchain?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq48">No we don’t have our own blockchain. We use the Ethereum blockchain. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq49" role="button" area-expanded="true" area-controls="faq49">
									<div className="title">How much ETH should I have to start using BubbleX?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq49">While registration requires 0 ETH in your wallet, any transaction requires Ethereum and as such, it is imperative that you recharge your wallet. The amount of ETH required depends on factors such as the price of gas during the transaction, the platform’s commission (if charged), and the price of the asset you intend to purchase i.e. the price of an egg or a character on the platform. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq50" role="button" area-expanded="true" area-controls="faq50">
									<div className="title">Where is my character? I just bought one and it is not showing in my account!</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq50">Please note that it can take several minutes for our website to sync with the transactions on the blockchain. If your transaction was successful, be assured that the character is yours. It just takes a little patience. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq51" role="button" area-expanded="true" area-controls="faq51">
									<div className="title">I mated two characters but the baby character is not showing up. Why?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq51">Your baby will appear on the list after (and the duration of birth depends on the rarity of the parents). However, note that it may take a couple of minutes for our website to sync with the transactions on the blockchain. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq52" role="button" area-expanded="true" area-controls="faq52">
									<div className="title">Why do I need Metamask?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq52">Metamask or any other digital wallets are necessary for you to conduct transactions on the platform. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq53" role="button" area-expanded="true" area-controls="faq53">
									<div className="title">What is a “wallet address”?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq53">A wallet address is a unique identifier for your wallet that directs assets to your wallet. Your wallet address is personal and access should strictly be limited to only you. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq54" role="button" area-expanded="true" area-controls="faq54">
									<div className="title">I have lost access to my wallet. Is it possible to recover my characters?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq54">Unfortunately if you lose access to your wallet, we can’t recover your characters. It is literally impossible.  </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq55" role="button" area-expanded="true" area-controls="faq55">
									<div className="title">What is mating?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq55">Mating is the creation of a new character that is based on the parents’ genes.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq56" role="button" area-expanded="true" area-controls="faq56">
									<div className="title">How do I list a character for mating?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq56">Complete the following steps in order to list your character for mating:
									<div><div></div>Open the profile of the character you wish to mate</div>
									<div><div></div>Select the “List for mating” option</div>
									<div><div></div>Fill in the “Start price” and “Final price” and “Price reduction period”</div>
									<div><div></div>Press “Pay”</div>
									<div><div></div>Sign the transaction on the Metamask (or other)</div>
									<div><div></div>Pay the “Gas”</div></div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq57" role="button" area-expanded="true" area-controls="faq57">
									<div className="title">How do I mate a character?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq57">Complete the following steps in order to mate your character:
									<div><div></div>Go to the marketplace</div>
									<div><div></div>Select the character’s profile</div>
									<div><div></div>Select the “Mating” option</div>
									<div><div></div>Click on the empty card</div>
									<div><div></div>Choose the Character you want to Mate with</div>
									<div><div></div>Click on “Mate”</div>
									<div>You will receive a card of the baby Character but it requires time to be born.</div></div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq58" role="button" area-expanded="true" area-controls="faq58">
									<div className="title">How much is the mating fee?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq58">Mating fees depend on the number of genes possessed by the parents and it starts from 0.0215 $SLM. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq59" role="button" area-expanded="true" area-controls="faq59">
									<div className="title">Will my character ever be unable to mate?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq59">Your characters will always be able to mate. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq60" role="button" area-expanded="true" area-controls="faq60">
									<div className="title">Can my character mate with its siblings or parents?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq60">The answer is no. </div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq61" role="button" area-expanded="true" area-controls="faq61">
									<div className="title">Can I change the price of the mating after the listing?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq61">You cannot change the price after listing your character. The price will automatically fluctuate based on the set ‘Start’ and ‘Final’ price.</div>
							</div>
						</div>

						<div className="faqItem">
							<div className="content">
								<div className="titleBar collapsed" data-toggle="collapse" href="#faq62" role="button" area-expanded="true" area-controls="faq62">
									<div className="title">How do I cancel the mating of a character?</div>
									<div></div>
								</div>
								<div className="text collapse" id="faq62">In order to cancel the mating of your character, complete the following steps:
									<div><div></div>Open the character’s profile</div>
									<div><div></div>Select the “Cancel mating” option </div>
									<div><div></div>Sign the transaction on the Metamask (or other)</div>
									<div><div></div>Wait for a confirmation email of the cancellation</div></div>
							</div>
						</div>
					</div>}
				<VideoPlayModal isShow={showVideoPlayModal} hideModal={onSetShowVideoPlayModal} />
			</div>
			<Footer />
		</div >
	);
}