
const initialState = {
    provider: null,
    web3Provider: null,
    address: null,
    chainId: null,
};

export function walletReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_WEB3_PROVIDER":
            return {
                ...state,
                provider: action.provider,
                web3Provider: action.web3Provider,
                address: action.address,
                chainId: action.chainId,
            };
        case "SET_ADDRESS":
            return {
                ...state,
                address: action.address,
            };
        case "SET_CHAIN_ID":
            return {
                ...state,
                chainId: action.chainId,
            };
        case "RESET_WEB3_PROVIDER":
            return initialState;
        default:
            return state;
    }
}