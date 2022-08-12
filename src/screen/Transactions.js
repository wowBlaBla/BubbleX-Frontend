import { React, useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function Transactions() {

	return (
		<div className="Transactions">
			<Header selected="Transactions" />
			<div className="mainContent">
				<div className="title">Transactions</div>
				<div className='TransactionTable'>
					<div className='TransactionItem'>
						<div className='avatar'>
							<div className='img'>
								<img src="/image/avatar1.png" />
								<img src="/image/send.png" />
							</div>
							<div className='tTitle'>Sent Bubblex #3224</div>
						</div>

						<div className='address'>to: 09xac...23a</div>
						<div className='tDate'>08 Aug 14:42</div>
						<div className='tVal'>-1 NFT</div>
					</div>

					<div className='TransactionItem'>
						<div className='avatar'>
							<div className='img'>
								<img src="/image/avatar1.png" />
								<img src="/image/send.png" />
							</div>
							<div className='tTitle'>Received Bubblex #3224</div>
						</div>

						<div className='address'>to: 09xac...23a</div>
						<div className='tDate'>08 Aug 14:42</div>
						<div className='tVal'>-1 NFT</div>
					</div>

					<div className='TransactionItem'>
						<div className='avatar'>
							<div className='img'>
								<img src="/image/avatar2.png" />
								<img src="/image/send.png" />
							</div>
							<div className='tTitle'>Received Sol</div>
						</div>

						<div className='address'>to: 09xac...23a</div>
						<div className='tDate'>08 Aug 14:42</div>
						<div className='tVal'>+3.25 SOL</div>
					</div>

					<div className='TransactionItem'>
						<div className='avatar'>
							<div className='img'>
								<img src="/image/slam.png" />
								<img src="/image/send.png" />
							</div>
							<div className='tTitle'>Sent $SLM</div>
						</div>

						<div className='address'>to: 09xac...23a</div>
						<div className='tDate'>08 Aug 14:42</div>
						<div className='tVal'>-250 $SLM</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}