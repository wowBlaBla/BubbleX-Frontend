import { React, useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from "moment";
import Skeleton , { SkeletonTheme }from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const explore = {
	ETH: process.env.REACT_APP_BLOCK_EXPLORER_BASEURL_ETH,
	BNB: process.env.REACT_APP_BLOCK_EXPLORER_BASEURL
}
export default function Transactions() {
	const account = useSelector((state) => state.wallet.address);
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setLoading] = useState(true);

	useEffect(async() => {
		if (!account) return;
		await axios.post(`${process.env.REACT_APP_SLAMBACKEND}api/transaction-crypto-wallet`, {
			from: account
		}).then(res => {
			setTransactions(res.data.transactions);
		}).catch(err => {
		});
		setLoading(false);
	}, [account]);

	const shorten = (addr) => {
		return addr.slice(0, 4) + '...' + addr.slice(-4);
	}

	const getType = (val) => {
		const type = val % 0x10;
		if (!type) return "Random";
		else if (type == 1) return "Epic";
		else return "Legendary";
	}

	return (
		<SkeletonTheme baseColor="#e3d4d4" highlightColor="#9d999961">
			<div className="Transactions">
				<Header selected="Transactions" />
				<div className="mainContent">
					<div className="title">Transactions</div>
					<div className='TransactionTable'>
						{
							isLoading ? 
							<>
								{
									[...new Array(3)].map((item, idx) => (
										<div
											className='TransactionItem'
											key={idx}
										>
											<div className='avatar'>
												<div className='img'>
													<Skeleton
														width="65px"
														height="65px"
														borderRadius="50%"
													/>
												</div>
											</div>
											<div className='address'><Skeleton width="100px" height="30px"/></div>
											<div className='tDate'><Skeleton width="150px" height="30px"/></div>

											<div className='tVal'><Skeleton height="30px"/> </div>
											<div className='tType'><Skeleton width="150px" height="30px"/></div>
										</div>
									))
								}
							</>
							: <>
								{
									transactions.map((item, idx) => {
										return (
											<div
												className='TransactionItem' key={idx}
												onClick={() => window.open(`${explore[item.bnb]}/${item.txhash}`, '_blank')}
											>
												<div className='avatar'>
													<div className='img'>
														<img src={`/image/${item.bnb}.png`}/>
													</div>
												</div>
												<div className='address'>to: {shorten(item.from)}</div>
												<div className='tDate'>{ moment(item.created_at).format('LLL')}</div>

												<div className='tVal'>{(item.isNFT) / 0x10} NFT </div>
												<div className='tType'>{getType(item.isNFT)}</div>
											</div>
										)
									})
								}

								{
									!transactions.length && <h2 className='text-muted text-center'>No transactions</h2>
								}
							</>
						}
					</div>
				</div>
				<Footer />
			</div>
		</SkeletonTheme>
	)
}