import React from 'react';
import { Alert, Modal } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function SlamWallet(props) {
	return (
		<div className="LoginModal">
			{props.loadingStatus == 0 ? "" : <div className="loadingIcon"></div>}
			<img src="/image/close1.png" className='close' onClick={() => {props.setOpenModal(false); props.removeReserveClicked();}} />
			{props.loginSlamFlg == 0 ?
				<div>
					<img src="/image/slam.png" />
					<div className="subLoginTitle">Welcome back!</div>
					{
						props.errMsg && (
							<Alert variant="danger">
								<p>{props.errMsg}</p>
							</Alert>
						)
					}
					<input
						type="email"
						placeholder="Enter your email "
						value={props.loginInfo.email}
						onChange={(e) => props.setLoginInfo({ ...props.loginInfo, email: e.target.value })}
						className="loginEmail"
					/>
					<input
						type={props.view ? "text" : "password"}
						placeholder="At least 8 characters"
						value={props.loginInfo.password}
						onChange={(e) => props.setLoginInfo({ ...props.loginInfo, password: e.target.value })}
						className="loginPassword"
					/>
					<div
						className="loginBtn"
						onClick={props.loginSlamWallet}
						// onClick={() => { setLoginSlamFlg(1) }}
					>Connect</div>
					<div className='loginfooter'>Don’t have an acсount yet? <a href="https://wallet.slamcoin.io/register" target="_blank" rel="noreferrer">Register</a></div>
				</div>
				:
			  <div>
					<div className='username'>{props.fullName ? props.fullName : 'No Slam Name'}</div>
					<div className='address'>{props.walletAddress.substr(0, 6) + '...' + props.walletAddress.substr(-4)}
						<CopyToClipboard text={props.walletAddress}>
							<img src="../image/copy.svg" alt="" className="icon_copy" onClick={() => props.onClickCopyBtn(props.walletAddress)} />
						</CopyToClipboard></div>
					{(props.showCopied) ? <div className="sc-1u1vgpp-0 cVGhIP">
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="14px" width="14px" viewBox="0 0 24 24" className="sc-16r8icm-0 cfMRaw cmc-icon">
							<path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM16.7557 9.65493C17.1174 9.23758 17.0723 8.60602 16.6549 8.24431C16.2376 7.8826 15.606 7.92771 15.2443 8.34507L10.8 13.4731L8.75569 11.1143C8.39398 10.6969 7.76242 10.6518 7.34507 11.0135C6.92771 11.3752 6.8826 12.0068 7.24431 12.4242L10.0443 15.6549C10.2343 15.8741 10.51 16 10.8 16C11.09 16 11.3657 15.8741 11.5557 15.6549L16.7557 9.65493Z"></path>
						</svg>
						<span>Copied!</span>
					</div> : ""}
					<img className='slamIcon' src="/image/slam.png" />
					<div className='slamAmount'>{props.balance} $SLM</div>
					<div className='money'>${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(props.balance * props.tokenPrice)}</div>
					{
						props.isReserveClicked ? 
						<>
							<div className='slamdetail-panel'>
								<div className='Operation-title'><img src="/image/operation.svg" />Operation Cost</div>
								<div className='content-panel'>
									<div className='content-title'>Your operations costs<br /> (without transaction fee).</div>
									<div className='content-detail'>
										<div className='slamValue'>{props.iValue} $SLM</div>
										<div className='realValue'>${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(props.iValue * props.tokenPrice)}</div>
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
										props.recentTx && (
											props.recentTx.length === 0 ?
												<div>You don't have recent history transaction.</div>
											:
											props.recentTx.map((row, i) => {
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
							<div className='disconnectBtn' onClick={ props.disconnectSlam }>Disconnect</div>
						</>
					}
				</div>
			 }
		</div>
	);
}

export default SlamWallet;
