import React, {useEffect, useState, useContext} from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import './ButtonGroupWithHightLight.scss';
import Dic from '../../assets/dic/dictionary.json';
import { AppContext } from '../../Util/Store';
import {
    MuiPickersUtilsProvider,
    DatePicker
  } from '@material-ui/pickers';
import moment from 'moment';

import endOfWeek from "date-fns/endOfWeek";
import startOfWeek from "date-fns/startOfWeek";

import DateFnsUtils from '@date-io/date-fns';
import enLocale from "date-fns/locale/en-US";
import zhLocale from "date-fns/locale/zh-CN";

import WeekSelector from './WeekSelector';

const DayPickerComponent = (props) => {
    const { appState } = useContext(AppContext);
    const [dateVal, setDateVal] = useState(props.date);
    let result = props.date;

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} className="data-picker" locale={appState.lanuage_index === 0 ? enLocale : zhLocale}>
            <DatePicker
                label={Dic.text[appState.lanuage_index].common.day}
                value={dateVal}
                onChange={(e) => {
                    setDateVal(e);
                    result = e;
                }}
                onAccept={() => {
                    props.callBack(result);
                }}
                okLabel={Dic.text[appState.lanuage_index].common.ok}
                cancelLabel={Dic.text[appState.lanuage_index].common.cancel}
            />
        </MuiPickersUtilsProvider>
    );
};

const MonthPickerComponent = (props) => {
    const { appState } = useContext(AppContext);
    const [dateVal, setDateVal] = useState(props.date);
    let result = props.date;

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} className="data-picker" locale={appState.lanuage_index === 0 ? enLocale : zhLocale}>
            <DatePicker
                openTo="year"
                views={["year", "month"]}
                label={Dic.text[appState.lanuage_index].common.month}
                value={dateVal}
                onChange={(e) => {
                    setDateVal(e);
                    result = e;
                }}
                onAccept={() => {props.callBack(result)}}
                okLabel={Dic.text[appState.lanuage_index].common.ok}
                cancelLabel={Dic.text[appState.lanuage_index].common.cancel}
            />
        </MuiPickersUtilsProvider>
    );
};

const YearPickerComponent = (props) => {
    const { appState } = useContext(AppContext);
    const [dateVal, setDateVal] = useState(props.date);
    let result = props.date;

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} className="data-picker" locale={appState.lanuage_index === 0 ? enLocale : zhLocale}>
            <DatePicker
                views={["year"]}
                label={Dic.text[appState.lanuage_index].common.year}
                value={dateVal}
                onChange={(e) => {
                    setDateVal(e);
                    result = e;
                }}
                onAccept={() => {props.callBack(result)}}
                okLabel={Dic.text[appState.lanuage_index].common.ok}
                cancelLabel={Dic.text[appState.lanuage_index].common.cancel}
            />
        </MuiPickersUtilsProvider>
    );
};

export default function ButtonGroupWithHightLight(props) {
    const { appState } = useContext(AppContext);
    const [highLight, setHighLight] = useState(-1);
    const [defaultHL, setDefaultHL] = useState(props.defaultItem);
    const [selectedItem, setSelectedItem] = useState(props.buttonItems[props.defaultItem].id);
    const [selectedDate] = useState(new Date());
    
    const clickHandler = (item, index) => {
        setHighLight(index);
        setDefaultHL('-1');
        setSelectedItem(item.id);
        if (item.id === 'day') {
            // console.log('day');
            setDayPickerVal();
        } else if (item.id === 'week') {
            // console.log('week');
            console.log(item);
            setWeekPickerVal();
        } else if (item.id === 'month') {
            // console.log('month');
            setMonthPickerVal();
        } else if (item.id === 'year') {
            // console.log('year');
            setYearPickerVal();
        }
        // props.buttonGroupCallBack(item, year);
    }
    
    const setDayPickerVal = (res) => {
        // console.log('day picker value: ', moment(res).format('YYYY-MM-DD'));
        props.selectBoxCallBack({
            name: props.itemName,
            type: 'day',
            value: moment(res).format('YYYY-MM-DD')
        });
    };
    const setWeekPickerVal = (res) => {
        let startDate = null;
        let endDate = null
        if (res === undefined){
            startDate = startOfWeek(new Date());
            endDate = endOfWeek(new Date());
        } else {
            startDate = startOfWeek(new Date(res));
            endDate = endOfWeek(new Date(res));
        }
        
        console.log('week picker start: ', moment(startDate).format('YYYY-MM-DD'), 'stop: ', moment(endDate).format('YYYY-MM-DD'));
        props.selectBoxCallBack({
            name: props.itemName,
            type: 'week',
            value: {
                start: moment(startDate).format('YYYY-MM-DD'),
                stop: moment(endDate).format('YYYY-MM-DD')
            }
        });
    };
    const setMonthPickerVal = (res) => {
        // console.log('month picker value: ', moment(res).format('YYYY-MM'));
        props.selectBoxCallBack({
            name: props.itemName,
            type: 'month',
            value: moment(res).format('YYYY-MM')
        });
    };
    const setYearPickerVal = (res) => {
        // console.log('year picker value: ', moment(res).format('YYYY'));
        props.selectBoxCallBack({
            name: props.itemName,
            type: 'year',
            value: moment(res).format('YYYY')
        });
    };

    return (
        <>
            <div className="flex-content align-items-center no-margin">
                <ButtonGroup size={props.size} aria-label="button group" className="button-group">
                    {
                        props.buttonItems.map((item, index) => {
                            return (
                                <Button
                                    key={index} 
                                    className={`${highLight >= 0 && highLight === index ? "hight-light-btn" : defaultHL === index.toString() ? "hight-light-btn" : ""}`} 
                                    onClick={()=>{
                                        clickHandler(item, index);
                                    }}
                                >
                                    {item.value}
                                </Button>);
                        })
                    }
                </ButtonGroup>
            </div>
            
            <div className="no-margin">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {selectedItem === 'day' ? <DayPickerComponent date={selectedDate} callBack={setDayPickerVal} /> : ''}
                {selectedItem === 'week' ? <WeekSelector lanuageIndex={appState.lanuage_index} callBack={setWeekPickerVal} /> : ''}
                {selectedItem === 'month' ? <MonthPickerComponent date={selectedDate} callBack={setMonthPickerVal} /> : ''}
                {selectedItem === 'year' ? <YearPickerComponent date={selectedDate} callBack={setYearPickerVal} /> : ''}
            </div>
        </>
    );
}