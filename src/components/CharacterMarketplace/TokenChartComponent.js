import React from 'react';
import { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
export default function TokenChartComponent() {
    const [tooltipOpacity, setTooltipOpacity] = useState(0);
    const [tooltipLeft, setTooltipLeft] = useState(0);
    const [tooltipBottom, setTooltipBottom] = useState(0);
    let initialPointsX = [2, 140, 170, 300, 450, 600];
    const [pointsX, setPointsX] = useState([2, 140, 170, 300, 450, 600]);
    const chartRef = useRef(null);
    const onShowTooltip = (left, bottom, opacity) => {
        // alert();
        setTooltipBottom(152 - bottom);
        setTooltipLeft(-40 + left);
        setTooltipOpacity(opacity);
    }
    useLayoutEffect(() => {
        function updateSize() {
            var tempx = [];
            console.log("initial");
            console.log(initialPointsX);
            for (var i = 0; i < initialPointsX.length; i++) {
                tempx[i] = initialPointsX[i] * chartRef.current.offsetWidth / 650;
            }
            setPointsX(tempx);
            console.log(tempx);
        }
        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return (
        <div className="ReactChart" ref={chartRef}>
            <svg >
                <g >
                    <g className="axes">
                        <g className="Axis">
                            <path className="domain" d="M 0, 150 H 0 V 0 H 0">
                            </path>
                            <g className="ticks">
                                <g className="tick">
                                    <line className="gridLine" x1="0" x2="624" >
                                    </line>
                                </g>
                                <g className="tick">
                                    <line className="gridLine" x1="0" x2="624" >
                                    </line>
                                </g>
                                <g className="tick">
                                    <line className="gridLine" x1="0" x2="624" >
                                    </line>
                                </g>
                                <g className="tick">
                                    <line className="gridLine" x1="0" x2="624" >
                                    </line>
                                </g>
                                <g className="tick">
                                    <line className="gridLine" x1="0" x2="624" >
                                    </line>
                                </g>
                                <g className="tick">
                                    <line className="gridLine" x1="0" x2="624" >
                                    </line>
                                </g>
                            </g>
                        </g>
                    </g>
                    <g className="Series" >
                        <g >
                            <path d={"M" + pointsX[0] + ",140L" + pointsX[1] + ",84.75L" + pointsX[2] + ",100L" + pointsX[3] + ",65L" + pointsX[4] + ",55L" + pointsX[5] + ",15"}>
                            </path>
                            <circle cx={pointsX[0]} cy="140" r="1" onMouseEnter={() => onShowTooltip(pointsX[0], 140, 1)} onMouseLeave={() => onShowTooltip(0, 0, 0)}></circle>
                            <circle cx={pointsX[1]} cy="84.75" r="1" onMouseEnter={() => onShowTooltip(pointsX[1], 84.75, 1)} onMouseLeave={() => onShowTooltip(0, 0, 0)}></circle>
                            <circle cx={pointsX[2]} cy="100" r="1" onMouseEnter={() => onShowTooltip(pointsX[2], 100, 1)} onMouseLeave={() => onShowTooltip(0, 0, 0)}></circle>
                            <circle cx={pointsX[3]} cy="65" r="1" onMouseEnter={() => onShowTooltip(pointsX[3], 65, 1)} onMouseLeave={() => onShowTooltip(0, 0, 0)}></circle>
                            <circle cx={pointsX[4]} cy="55" r="1" onMouseEnter={() => onShowTooltip(pointsX[4], 55, 1)} onMouseLeave={() => onShowTooltip(0, 0, 0)}></circle>
                            <circle cx={pointsX[5]} cy="15" r="1" onMouseEnter={() => onShowTooltip(pointsX[5], 15, 1)} onMouseLeave={() => onShowTooltip(0, 0, 0)}></circle>
                        </g>
                    </g>
                </g>
            </svg>
            <div className="tooltip-wrap" style={{ opacity: tooltipOpacity, left: tooltipLeft, bottom: tooltipBottom }}>
                <div>100$SLM</div>
                <div>$234.56</div>
                <div className="arrow"></div>
            </div>
        </div>
    )
}