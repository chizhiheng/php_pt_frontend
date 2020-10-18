import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../Util/Store';
import { useCookies } from 'react-cookie';
import Header from '../../Components/Header/Header';
import Loading from '../../Components/Loading/Loading';
import './TimeRecorder.scss'
import DateFnsUtils from '@date-io/date-fns';
import enLocale from "date-fns/locale/en-US";
import zhLocale from "date-fns/locale/zh-CN";
import Dic from '../../assets/dic/dictionary.json';
import {
    MuiPickersUtilsProvider,
    DatePicker
  } from '@material-ui/pickers';
import { Divider } from '@material-ui/core';
import ButtonGroupWithHightLight from '../../Components/ButtonGroupWithHightLight/ButtonGroupWithHightLight';
import TimeTrackerTable from '../../Components/TimeTrackerTable/TimeTrackerTable';
import TimeBar from '../../Components/TimeBar/TimeBar';
import {GetTaskDetailRequest} from './TimeRecorderService';
import { useStore } from 'react-redux';

export default function TimeRecorder(){
    const { appState } = useContext(AppContext);
    const [showLoading, setShowLoading] = useState(false);
    const [dateValue, setDateValue] = useState(new Date());
    const [timeList, setTimeList] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [fromTop, setFromTop] = useState(false);
    const [toBottom, setToBottom] = useState(false);
    
    const [cookies] = useCookies();
    const user_info = JSON.parse(localStorage.getItem('user_info'));

    const getUserWorkingData = async () => {
        setShowLoading(true);
        setTotalHours(0);
        setFromTop(false);
        setToBottom(false);
        await GetTaskDetailRequest(cookies.user_token, dateValue).then((res)=>{
            setTimeList(res.result);
            setShowLoading(false);
            
            res.result.forEach(element => {
                const startTime = new Date(element.start_working_time);
                const stopTime = new Date(element.stop_working_time);

                const timeRes = stopTime.getTime()-startTime.getTime();
                const days=Math.floor(timeRes/(24*3600*1000));
                let leave1 = 0;
                let resHours = 0;
                
                if (days !== 0){
                    console.log('days: ', days);
                    leave1 = timeRes%(24*3600*1000);
                    resHours = Math.floor(leave1/(3600*1000));
                    resHours = resHours + days*24;
                } else {
                    leave1 = timeRes%(24*3600*1000);
                    resHours = Math.floor(leave1/(3600*1000));
                }

                setTotalHours(res => {
                    res += leave1;
                    return res;
                });

                if (startTime.getDate() < new Date(dateValue).getDate()){
                    setFromTop(true);
                } else {
                    setFromTop(false);
                }
                
                if (startTime.getDate() <= new Date(dateValue).getDate() && stopTime.getDate() > new Date(dateValue).getDate()){
                    setToBottom(true);
                } else {
                    setToBottom(false);
                }
            });
        });
    }

    const getTotalHours = (val) => {
        console.log('getTotalHours: ', val);
    };

    useEffect(() => {
        let mounted = true;
        
        if (mounted){
            getUserWorkingData();
        }
        
        return () => {
            mounted = false;
        };
    }, [appState.lanuage_index, dateValue]);

    const btnArr = [Dic.text[appState.lanuage_index].common.day, Dic.text[appState.lanuage_index].common.week, Dic.text[appState.lanuage_index].common.month];
    // const buttonGroupCallBack = (item, year) => {
    //     console.log('parent: ', item, year);
    // }
    return (
        <div id="time-recorder-page" className="page-content">
            {showLoading ? <Loading /> : '' }
            <Header showLogo={false} showIcons={true} />
            <div className="page-content-container">
                <div className="page-content-main"> 
                    <div className="flex-content">
                        <div className="width-stand-65">
                            <div className="flex-content float-right">
                                {/* <ButtonGroupWithHightLight
                                    size="small"
                                    buttonItems={btnArr}
                                    defaultItem="0"
                                    callBack={buttonGroupCallBack}
                                    enableYear={false}
                                /> */}
                                <p className="h4-text">
                                    {Dic.text[appState.lanuage_index].TimeRecorder.total_num_of_time}: &nbsp;
                                    {(totalHours/1000/3600).toFixed(1)}&nbsp;{Dic.text[appState.lanuage_index].Task.hours}
                                </p>
                            </div>
                            <div className="flex-content clear-both position-relative">  {/* day */}
                                {/* {fromTop ? 'true' : 'false'} - {toBottom ? 'true' : 'false'} */}
                                <TimeBar timeList={timeList} fromTop={fromTop} toBottom={toBottom} callBack={getTotalHours} />
                                <TimeTrackerTable currentDate={dateValue} />
                            </div>
                        </div>
                        <div className="width-stand-35 padding-left-right fixed-right">
                            <MuiPickersUtilsProvider utils={DateFnsUtils} className="data-picker" locale={appState.lanuage_index === 0 ? enLocale : zhLocale}>
                                {/* <Calendar /> */}
                                <DatePicker
                                    autoOk
                                    orientation="landscape"
                                    variant="static"
                                    // openTo="date"
                                    value={dateValue}
                                    onChange={setDateValue}
                                />
                            </MuiPickersUtilsProvider>
                            <Divider />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
