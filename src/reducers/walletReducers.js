import { SET_WEB3_PROVIDER, SET_ADDRESS, SET_CHAIN_ID, RESET_WEB3_PROVIDER, SLAMWALLET_CONNECT } from "../actions/types";

const initialState = {
	web3: null,
	provider: null,
	web3Provider: null,
	address: null,
	chainId: null,
	slamWallet: null,
	token: null,
	userId: null,
	slamContract: null,
};

export function walletReducer(state = initialState, action) {
	switch (action.type) {
		case SET_WEB3_PROVIDER:
			return {
				...state,
				provider: action.provider,
				web3: action.web3,
				web3Provider: action.web3Provider,
				address: action.address,
				chainId: action.chainId,
			};
		case SET_ADDRESS:
			return {
				...state,
				address: action.address,
			};
		case SET_CHAIN_ID:
			return {
				...state,
				chainId: action.chainId,
				web3Provider: action.web3Provider,
			};
		case RESET_WEB3_PROVIDER:
			return initialState;
		case SLAMWALLET_CONNECT:
			return {
				...state,
				address: action.address,
				slamWallet: action.slamWallet,
				token: action.token,
				userId: action.userId, 
				web3: action.web3,
				slamContract: action.slamContract,
			}
		default:
			return state;
	}
}
