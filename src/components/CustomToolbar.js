import React, { useState, useRef, useEffect } from 'react';
import "./CustomToolbar.css";
export default function CustomToolbar() {
    const [showPriceRangePanel, setShowPriceRangePanel] = useState(false);
    const [showSortPanel, setShowSortPanel] = useState(false);
    const [fromETHValue, setFromETHValue] = useState("");
    const [toETHValue, setToETHValue] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [sortType, setSortType] = useState(0);
    const priceRangeRef = useRef(null);
    const sortPanelRef = useRef(null);
    const showSortPanelRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (priceRangeRef.current && !priceRangeRef.current.contains(event.target)) {
                setShowPriceRangePanel(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [priceRangeRef]);
    useEffect(() => {
        function handleClickOutside(event) {
            if (sortPanelRef.current && !sortPanelRef.current.contains(event.target) && !showSortPanelRef.current.contains(event.target)) {
                // alert();
                setShowSortPanel(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sortPanelRef]);

    const onClickApplyBtn = () => {
        setPriceRange((parseFloat(toETHValue) - parseFloat(fromETHValue)) + " ETH");
        setShowPriceRangePanel(false);
    }

    const onSetSortType = (type) => {
        setShowSortPanel(false);
        setSortType(type);
    }
    return (
        <div className="CustomToolbar">
            <div className="priceRange"><div onClick={() => setShowPriceRangePanel(true)} style={{height:'100%',width:'100%', display: 'flex',alignItems: 'center'}}>{priceRange == "" ? "$ Price range" : priceRange}</div>
                {showPriceRangePanel ? <div className="priceRangePanel" ref={priceRangeRef}>
                    <div className="valueGroup">
                        <div className="valueSelector">
                            <input type="text" placeholder="From" value={fromETHValue} onChange={(e) => setFromETHValue(e.target.value)}/>
                            ETH
                        </div>
                        to
                        <div className="valueSelector">
                            <input type="text" placeholder="To" value={toETHValue} onChange={(e) => setToETHValue(e.target.value)}/>
                            ETH
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="applyBtn" onClick={onClickApplyBtn}>Apply</div>
                        <div className="cancelBtn" onClick={() => setShowPriceRangePanel(false)}>Cancel</div>
                    </div>
                </div> : ""}
            </div>
            <div className="filter">
                <div className="search">
                    <img src="/image/search.png" alt="" />
                    <input type="text" placeholder="Search by ID" />
                </div>
                <div className="sort">
                    <div onClick={() => setShowSortPanel(!showSortPanel)} ref = {showSortPanelRef}>
                        <img src="/image/sort.png" alt="" />
                        {sortType == 0 ? "Recently added" : (sortType == 1 ? "Price: Low to High" : "Price: High to Low")}
                        <img src="/image/down.png" alt="" />
                    </div>
                    {showSortPanel ? <div className="sortPanel" ref={sortPanelRef}>
                        <div className="sortSelector" onClick={() => onSetSortType(0)}>
                            Recently added
                            {sortType == 0 ? <img src="/image/selected.png" alt="" /> : ""}
                        </div>
                        <div className="sortSelector" onClick={() => onSetSortType(1)}>
                            Price: Low to High
                            {sortType == 1 ? <img src="/image/selected.png" alt="" /> : ""}
                        </div>
                        <div className="sortSelector" onClick={() => onSetSortType(2)}>
                            Price: High to Low
                            {sortType == 2 ? <img src="/image/selected.png" alt="" /> : ""}
                        </div>
                    </div> : ""}
                </div>
            </div>
        </div>
    )
}