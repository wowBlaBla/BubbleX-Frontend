import React from 'react';

export default function HistoryComponent(props) {
    return(
        <div className="HistoryComponent">
            <div className="historyContent">
                <div className="content1 buyer">BUYER</div>
                <div className="content2 seller">SELLER</div>
                <div className="content3 date">{props.date}</div>
            </div>
            <div className="historyContent">
                <div className="content1 buyername">{props.buyerName}</div>
                <div className="content2 sellername">{props.sellerName}</div>
                <div className="content3 tokenCount">{props.tokenCount}</div>
            </div>
            <div className="historyContent">
                <div className="content1 buyeraddress">{props.buyeraddress}</div>
                <div className="content2 selleraddress">{props.selleraddress}</div>
                <div className="content3 tokenMoney">{props.tokenMoney}</div>
            </div>
        </div>
    )
}