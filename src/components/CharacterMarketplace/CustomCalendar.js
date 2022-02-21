import React, { useEffect, useState } from 'react';
import './CustomCalendar.css';
const Calendar = require('calendar-base').Calendar;
const table = [' Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', '\n'];

const today = new Date();
const calendar = new Calendar({ siblingMonths: true, weekStart: 1 });


export default function CustomCalendar(props) {
    const [selectedMonth, setSelectedMonth] = useState(0); //default value
    const [selectedYear, setSelectedYear] = useState(2021); //default value
    

    const [fullDate, setFullDate] = useState([])

    
    // const [fullDate, setFullDate] = useState(calendar.getCalendar(today.getUTCFullYear(), today.getUTCMonth()));

    React.useEffect(() => {
        let temp = calendar.getCalendar(today.getUTCFullYear(), today.getUTCMonth())
        console.log(temp)
        setFullDate(temp)
        setSelectedMonth(today.getUTCMonth());
        setSelectedYear(today.getUTCFullYear())
    }, [calendar])

    function handleSelectMonthChange(event) {
        setSelectedMonth(event.target.value);
        setFullDate(calendar.getCalendar(selectedYear, selectedMonth));
    }

    function handleSelectYearChange(event) {
        setSelectedYear(event.target.value);
        setFullDate(calendar.getCalendar(selectedYear, selectedMonth));
    }

    useEffect(() => {
        // console.log(fullDate);
    }, [fullDate])

    return (
        <div className="calendar" ref = {props.calendarRef}>
            <div className="calendar__opts">
                <select name="calendar__month" id="calendar__month" value={selectedMonth} onChange={handleSelectMonthChange}>
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">October</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                </select>

                <select name="calendar__year" id="calendar__year" onChange={handleSelectYearChange} value={selectedYear}>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                </select>
            </div>

            <div className="calendar__body">
                <div className="calendar__days">
                    <div>Mo</div>
                    <div>Tu</div>
                    <div>We</div>
                    <div>Th</div>
                    <div>Fr</div>
                    <div>Sa</div>
                    <div>Su</div>
                </div>

                <div className="calendar__dates">
                    {fullDate.map((item, index) =>
                        <div key={index}>
                            <div className={"calendar__date " + (item.today ? "calendar__date--selected" : (item.siblingMonth ? "calendar__date--grey" : ""))} onClick={ () =>{ props.onSetDate(String(selectedMonth + 1).padStart(2, '0') + "/" + String(item.day).padStart(2, '0') + "/" + selectedYear)}}>{item.day}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}