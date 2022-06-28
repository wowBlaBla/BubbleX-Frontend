import { SET_PROJECT_SETTING, Connect_Wallet_Status, User_Address, User_Bnb_Balance, 
    User_Eth_Balance, Injected_Wallet, Tx_Processing, SET_ISMATE_SETTING } from "../actions/types";

const initialState = {
    isDay: true,
    isMobileSidebar: false,
    connectWalletStatus: '',
    userAddress:'',
    userBnbBalance: 0,
    userEthBalance:0,
    injectedWallet: false,
    txProcessing: false,
    isMate: false,
}

export default function projectSetting(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_ISMATE_SETTING:
            return {
                ...state,
                isMate: payload
            };
            break;
        case SET_PROJECT_SETTING:
            return {
                ...state,
                isDay: payload
            };
            break;
        case Connect_Wallet_Status:
            return {
                ...state,
                connectWalletStatus: payload
            }
        case User_Address:
            return {
                ...state,
                userAddress: payload,
            }
        case User_Bnb_Balance:
            return {
                ...state,
                userBnbBalance: payload
            }
        case User_Eth_Balance:
            return {
                ...state,
                userEthBalance: payload,
            }
        case Injected_Wallet:
            return {
                ...state,
                injectedWallet: payload
            }
        case Tx_Processing:
            return {
                ...state,
                txProcessing: payload
            }
        default:
            return state;
    }
}