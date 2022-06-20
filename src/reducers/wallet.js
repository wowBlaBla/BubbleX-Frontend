import { WALLET_CONNECT, WALLET_DISCONNECT } from "../actions/types";



export const walletReducer = (state = { isConnected: false }, { type }) => {
    switch (type) {
        case WALLET_CONNECT:
            return  { isConnected: true }
        case WALLET_DISCONNECT:
            return { isConnected: false }
        default:

            return  { ...state }
    }
}