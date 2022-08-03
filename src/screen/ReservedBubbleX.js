import { React, useEffect, useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux'
import Header from '../components/Header/Header';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Footer from '../components/Footer/Footer';
import "./CustomTab.css";
import BubblexABI from '../contract/BubbleXPresale.json';
import Web3 from "web3";
import axios from 'axios';

export default function ReservedBubbleX() {

	const userAddress = useSelector(store => store.wallet.address);

	const [randomTokenUris, setRandomTokenUris] = useState([]);
	const [epicTokenUris, setEpicTokenUris] = useState([]);
	const [legendaryTokenUris, setLegendaryTokenUris] = useState([]);
	const [selectedNFTURL, setSelectNFTURL] = useState("");

	const ReversedBubbleX = async () => {
		ReversedRandomBubbleX();
		ReversedEpicBubbleX();
		ReversedLegendaryBubbleX();
	}


	const ReversedRandomBubbleX = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
			// Request account access if needed
			window.ethereum.request({ method: 'eth_requestAccounts' })
			// Get an instance of the contract sop we can call our contract functions
			const contract = new web3.eth.Contract(
				BubblexABI,
				process.env.REACT_APP_BUBBLEXRANDOM_CONTRACT_ADDRESS
			);
			console.log("ReservedBubbleX11111 => ", userAddress)


			let totalTokenCount = await contract.methods.balanceOf(userAddress)
				.call();
			// ({
			//     from: userAddress
			// });
			// Output the result for the console during development. This will help with debugging transaction errors.
			console.log('totalTokenCount => ', totalTokenCount);

			let _uris = [];

			for (let i = 0; i < totalTokenCount; i++) {
				let tokenID = await contract.methods.tokenOfOwnerByIndex(userAddress, i)
					.call();

				let tokenURI = await contract.methods.tokenURI(tokenID).call();
				_uris.push(tokenURI);
				console.log("tokenID => ", tokenID);
			}

			setRandomTokenUris(_uris);
		} catch (error) {
			// Catch any errors for any of the above operations.
			console.error("Could not connect to wallet.", error);
		}
	}

	const ReversedEpicBubbleX = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
			// Request account access if needed
			window.ethereum.request({ method: 'eth_requestAccounts' })
			// Get an instance of the contract sop we can call our contract functions
			const contract = new web3.eth.Contract(
				BubblexABI,
				process.env.REACT_APP_BUBBLEXEPIC_CONTRACT_ADDRESS
			);

			let totalTokenCount = await contract.methods.balanceOf(userAddress)
				.call();
			// ({
			//     from: userAddress
			// });
			// Output the result for the console during development. This will help with debugging transaction errors.
			console.log('totalTokenCount => ', totalTokenCount);

			let _uris = [];

			for (let i = 0; i < totalTokenCount; i++) {
				let tokenID = await contract.methods.tokenOfOwnerByIndex(userAddress, i)
					.call();

				let tokenURI = await contract.methods.tokenURI(tokenID).call();
				_uris.push(tokenURI);
				console.log("tokenID => ", tokenID);
			}

			setEpicTokenUris(_uris);
		} catch (error) {
			// Catch any errors for any of the above operations.
			console.error("Could not connect to wallet.", error);
		}
	}

	const ReversedLegendaryBubbleX = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
			// Request account access if needed
			window.ethereum.request({ method: 'eth_requestAccounts' })
			// Get an instance of the contract sop we can call our contract functions
			const contract = new web3.eth.Contract(
				BubblexABI,
				process.env.REACT_APP_BUBBLEXLEGENDARY_CONTRACT_ADDRESS
			);

			let totalTokenCount = await contract.methods.balanceOf(userAddress)
				.call();
			// ({
			//     from: userAddress
			// });
			// Output the result for the console during development. This will help with debugging transaction errors.
			console.log('totalTokenCount => ', totalTokenCount);

			let _uris = [];

			for (let i = 0; i < totalTokenCount; i++) {
				let tokenID = await contract.methods.tokenOfOwnerByIndex(userAddress, i)
					.call();

				let tokenURI = await contract.methods.tokenURI(tokenID).call();
				_uris.push(tokenURI);
				console.log("tokenID => ", tokenID);
			}

			setLegendaryTokenUris(_uris);
		} catch (error) {
			// Catch any errors for any of the above operations.
			console.error("Could not connect to wallet.", error);
		}
	}

	const NFTLinkClicked = async (url) => {
		await axios.get(url).then(res => {

			const imgURL = res.data.split('"image":')[1].split(',')[0].replaceAll('"', '');
			console.log(imgURL);
			setSelectNFTURL(imgURL);
		}).catch(error1 => {
			console.log(error1);
		});
	}

	useEffect(() => {
		ReversedBubbleX();
	}, []);


	return (
		<div className="ReservedBubbleX">
			<Header selected="ReservedBubbleX" />
			<div className="mainContent">
				<div className="title">Reserved BubbleX To You</div>
				<Tabs>
					<TabList>
						<Tab onClick={() => setSelectNFTURL("")}>Random</Tab>
						<Tab onClick={() => setSelectNFTURL("")}>Epic</Tab>
						<Tab onClick={() => setSelectNFTURL("")}>Legendary</Tab>
					</TabList>
					<TabPanel>
						<div className="NFTList">
							{
								randomTokenUris.map(uri =>
								(
									<div className='react-tabs__tab-panel'>
										<a href="javascript:" onClick={() => NFTLinkClicked(uri)}>{uri}</a></div>
								))
							}
						</div>
						{selectedNFTURL != "" ?
							<div className="selectedNFTImg">
								<img src={selectedNFTURL} alt="" />
							</div>
							: <></>
						}
					</TabPanel>
					<TabPanel>
						<div className="NFTList">
							{
								epicTokenUris.map(uri =>
								(
									<div className='react-tabs__tab-panel'>
										<a href="javascript:" onClick={() => NFTLinkClicked(uri)}>{uri}</a></div>
								))
							}
						</div>
						{selectedNFTURL != "" ?
							<div className="selectedNFTImg">
								<img src={selectedNFTURL} alt="" />
							</div>
							: <></>
						}
					</TabPanel>
					<TabPanel>
						<div className="NFTList">
							{
								legendaryTokenUris.map(uri =>
								(
									<div className='react-tabs__tab-panel'>
										<a href="javascript:" onClick={() => NFTLinkClicked(uri)}>{uri}</a></div>
								))
							}
						</div>
						{selectedNFTURL != "" ?
							<div className="selectedNFTImg">
								<img src={selectedNFTURL} alt="" />
							</div>
							: <></>
						}
					</TabPanel>
				</Tabs>

			</div>
			<Footer />
		</div>
	)
}