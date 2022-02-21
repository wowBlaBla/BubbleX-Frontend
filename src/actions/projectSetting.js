import { SET_PROJECT_SETTING, Connect_Wallet_Status, User_Address, User_Bnb_Balance, User_Eth_Balance, 
    Injected_Wallet, Tx_Processing, SET_ISMATE_SETTING } from "./types";

export const setIsMate = (isMate) => async(dispatch) => {
    dispatch({
        type: SET_ISMATE_SETTING,
        payload: isMate
    });
}

export const setSetting = (isDay) => async(dispatch) => {
    dispatch({
        type: SET_PROJECT_SETTING,
        payload: isDay
    });
}

export const getConnectWalletStatus = (connectWalletStatus) => async(dispatch) => {
    dispatch({
        type: Connect_Wallet_Status,
        payload: connectWalletStatus
    });
}

export const setUserBnbBalance = (userBnbBalance) => async(dispatch) => {
    dispatch({
        type: User_Bnb_Balance,
        payload: userBnbBalance
    });
}

export const setUserEthBalance = (userEthBalance) => async(dispatch) => {
    dispatch({
        type: User_Eth_Balance,
        payload: userEthBalance
    });
}
export const setUserAddress = (userAddress) => async(dispatch) => {
    dispatch({
        type: User_Address,
        payload: userAddress
    });
}
export const setInjectedWallet = (wallet) => async(dispatch) => {
    dispatch({
        type: Injected_Wallet,
        payload: wallet
    });
}

export const setTxProcessing = (status) => async(dispatch) => {
    dispatch({
        type: Tx_Processing,
        payload: status
    });
}