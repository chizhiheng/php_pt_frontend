import React, { useState, useEffect, useContext } from 'react';
import './Home.scss';
import Header from '../../Components/Header/Header';
import { useHistory } from "react-router-dom";
import ReactEcharts from 'echarts-for-react';
import Dic from '../../assets/dic/dictionary.json';
import Loading from '../../Components/Loading/Loading';
import { AppContext } from '../../Util/Store';
import { useCookies } from 'react-cookie';
import moment from 'moment';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ButtonGroupWithHightLight from '../../Components/ButtonGroupWithHightLight/ButtonGroupWithHightLight';
import {
    Divider,
    Select, 
    MenuItem,
    InputLabel,
    FormControl
} from '@material-ui/core/';
import { 
    GetStatisticRequest,
    GetDivisionRequest,
    getProductivityRequest,
    getRejectionRateRequest,
    getUitilizationRequest
} from './HomeService';
import {
    GetUsersByDivisionIDRequest
 } from '../Task/TaskService';

export default function Home (){
    const { appState } = useContext(AppContext);
    const [showLoading, setShowLoading] = useState(false);
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    const [cookies] = useCookies();
    const history = useHistory();
    const [divisionList, setDivisionList] = useState([]);
    const [divValForProductivity, setDivValForProductivity] = useState({});
    const [divValForUitilization, setDivValForUitilization] = useState({});
    const [divValForRejection, setDivValForRejection] = useState({});
    let pDateParams = {
        name: 'productivity',
        type: 'month',
        value: moment(new Date()).format('YYYY-MM')
    };
    let uDateParams = {
        name: 'uitilization',
        type: 'month',
        value: moment(new Date()).format('YYYY-MM')
    };
    let rDateParams = {
        name: 'rejectionRate',
        type: 'month',
        value: moment(new Date()).format('YYYY-MM')
    };
    const [userIds, setUserIds] = useState('');

    const [userStatisitc, setUserStatisitc] = useState({
        your_project: [],
        open_tasks: {},
        overdue_task_by_today: [],
        pending_tasks: [],
        pending_tasks_overdue: []
    });
    const [productivityChartOption, setProductivityChartOption] = useState({
        // '#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'
        color: ['#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        title: {
            text: Dic.text[appState.lanuage_index].Home.productivity
        },
        tooltip: {},
        legend: {
            data:[`${Dic.text[appState.lanuage_index].Home.productivity}`]
        },
        xAxis: {
            data: []
        },
        yAxis: {
            // data: ["10%", "20%", "30%", "40%", "40%", "40%", "40%", "40%", "40%", "40%"]
        },
        series: [{
            name: `${Dic.text[appState.lanuage_index].Home.productivity}`,
            type: 'bar',
            data: []
        }]
    });
    const productivityChartBtnArr = [
    {
        id: "week",
        value: Dic.text[appState.lanuage_index].common.week
    },
    {
        id: "month",
        value: Dic.text[appState.lanuage_index].common.month
    },
    {
        id: "year",
        value: Dic.text[appState.lanuage_index].common.year
    }];
    const [uitilizationChartOption, setUitilizationChartOption] = useState({
        color: ['#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        title: {
            text: Dic.text[appState.lanuage_index].Home.uitilization
        },
        tooltip: {},
        legend: {
            data:[`${Dic.text[appState.lanuage_index].Home.uitilization}`]
        },
        xAxis: {
            data: []
        },
        yAxis: {
            // data: ["10%", "20%", "30%", "40%", "40%", "40%", "40%", "40%", "40%", "40%"]
        },
        series: [{
            name: `${Dic.text[appState.lanuage_index].Home.uitilization}`,
            type: 'bar',
            data: []
        }]
    });
    const uitilizationChartBtnArr = [{
        id: 'day',
        value: Dic.text[appState.lanuage_index].common.day
    },
    {
        id: 'week',
        value: Dic.text[appState.lanuage_index].common.week
    },
    {
        id: 'month',
        value: Dic.text[appState.lanuage_index].common.month
    },
    {
        id: 'year',
        value: Dic.text[appState.lanuage_index].common.year
    }];
    const [rejectionRateChartOption, setRejectionRateChartOption] = useState({
        color: ['#c23531'],
        title: {
            text: Dic.text[appState.lanuage_index].Home.rejection_rate
        },
        tooltip: {},
        legend: {
            data:[`${Dic.text[appState.lanuage_index].Home.rejection_rate}`]
        },
        xAxis: {
            data: []
        },
        yAxis: {
            // data: ["10%", "20%", "30%", "40%", "40%", "40%", "40%", "40%", "40%", "40%"]
        },
        series: [{
            name: `${Dic.text[appState.lanuage_index].Home.rejection_rate}`,
            type: 'bar',
            data: []
        }]
    });
    const rejectionRateChartBtnArr = [{
        id: 'day',
        value: Dic.text[appState.lanuage_index].common.day
    },
    {
        id: 'week',
        value: Dic.text[appState.lanuage_index].common.week
    },
    {
        id: 'month',
        value: Dic.text[appState.lanuage_index].common.month
    },
    {
        id: 'year',
        value: Dic.text[appState.lanuage_index].common.year
    }];

    const selectBoxCallBack = async (value) => {
        console.log('parent selectBoxCallBack: ', value, userIds);
        if (value.name === 'productivity') {
            pDateParams = {...value};
            const res = await getProductivity(userIds, value);
            calculateProductivityValue(userIds, res);
        } else if (value.name === 'uitilization') {
            uDateParams = {...value};
            const res = await getUitilization(userIds, value);
            calculateUitilizationValue(userIds, res);
        } else if (value.name === 'rejectionRate') {
            rDateParams = {...value};
            const res = await getRejectionRate(userIds, value);
            calculateRejectionRateValue(userIds, res);
        }
    }

    const calculateProductivityValue = (ids, val) => {
        const valueArr = [];
        ids.split(',').forEach(id => {
            val.forEach(task => {
                if (id === task.user_id.toString()) {
                    // 计算多少个task超过预估时间
                    let value = 0;
                    // task.list.forEach(item => {
                    //     if (item.overEstimate) {
                    //         value++;
                    //     }
                    // });
                    //计算完成多少个task
                    value = task.list.length;
                    valueArr.push(value);
                }
            });
        });
        setProductivityChartOption(productivityChartOption  => ({...productivityChartOption, series: [{
            data: valueArr
        }]}));
        console.log(productivityChartOption);
    };
    const calculateUitilizationValue = (ids, val) => {
        const valueArr = [];
        ids.split(',').forEach(id => {
            val.forEach(task => {
                if (id === task.user_id.toString()) {
                    let value = 0;
                    task.list.forEach(item => {
                        item.details.forEach(detail => {
                            const date1=moment(detail.start_working_time);
                            const date2=moment(detail.stop_working_time);
                            const date3=date2.diff(date1,'minute');
                            const h=Math.floor(date3/60);
                            const mm=date3%60/60;
                            const res = h + mm;
                            value += Math.round(res*100)/100;
                        });
                    });               
                    valueArr.push(value);
                }
            });
        });
        setUitilizationChartOption(uitilizationChartOption  => ({...uitilizationChartOption, series: [{
            data: valueArr
        }]}));
    };
    const calculateRejectionRateValue = (ids, val) => {
        const valueArr = [];
        ids.split(',').forEach(id => {
            val.forEach(task => {
                if (id === task.user_id.toString()) {
                    // 计算多少个task超过预估时间
                    let value = 0;
                    // task.list.forEach(item => {
                    //     if (item.overEstimate) {
                    //         value++;
                    //     }
                    // });
                    //计算完成多少个task
                    value = task.list.length;
                    valueArr.push(value);
                }
            });
        });
        setRejectionRateChartOption(rejectionRateChartOption  => ({...rejectionRateChartOption, series: [{
            data: valueArr
        }]}));
    };

    const getStatistic = async () => {
        setShowLoading(true);
        await GetStatisticRequest(cookies.user_token).then((results) => {
            setUserStatisitc((res) => {
                res.your_project = results.result.your_project;
                res.open_tasks = results.result.open_tasks;
                res.overdue_task_by_today = results.result.overdue_task_by_today;
                res.pending_tasks = results.result.pending_tasks;
                res.pending_tasks_overdue = results.result.pending_tasks_overdue;
                return res;
            });
            setShowLoading(false);
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    };

    const getProductivity = async (ids, value=undefined) => {
        let date = {};
        if (value === undefined) {
            date = {
                name: 'productivity',
                type: 'month',
                value: moment(new Date()).format('YYYY-MM')
            };
        } else {
            date = {...value}
        }
        
        return await getProductivityRequest(cookies.user_token, ids, date).then((results) => {
            ids.split(',').forEach((id) => {
                results.result.forEach((item) => {
                    if (id.toString() === item.user_id) {
                        item.list.forEach(taskItem => {
                            // console.log(taskItem);
                            // console.log('task id: ', taskItem.id);
                            let overEstimate = false;
                            let totalMin = 0;
                            taskItem.details.forEach((detail) => {
                                // console.log(detail.start_working_time);
                                // console.log(detail.stop_working_time);
                                const estimateMin = new Date(detail.estimate_working_hours).getTime() / 1000 / 60;
                                totalMin += (new Date(detail.stop_working_time).getTime() - new Date(detail.start_working_time).getTime()) / 1000 / 60;
                                if (estimateMin > totalMin) {
                                    overEstimate = true;
                                }
                                // console.log(totalMin);
                                taskItem.totalMin = totalMin;
                                taskItem.overEstimate = overEstimate;
                            });
                            totalMin = 0;
                        });
                    }
                });
            });
            return results.result;
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }
    const getUitilization = async (ids, value=undefined) => {
        let date = {};
        if (value === undefined) {
            date = {
                name: 'uitilization',
                type: 'month',
                value: moment(new Date()).format('YYYY-MM')
            };
        } else {
            date = {...value}
        }
        return await getUitilizationRequest(cookies.user_token, ids, date).then((results) => {
            // ids.split(',').forEach((id) => {
            //     results.result.forEach((item) => {
            //         if (id.toString() === item.user_id) {

            //         }
            //     });
            // });
            return results.result;
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }
    const getRejectionRate = async (ids, value=undefined) => {
        let date = {};
        if (value === undefined) {
            date = {
                name: 'rejectionRate',
                type: 'month',
                value: moment(new Date()).format('YYYY-MM')
            }
        } else {
            date = {...value}
        }
        return await getRejectionRateRequest(cookies.user_token, ids, date).then((results) => {
            // console.log(results);
            // ids.split(',').forEach((id) => {
            //     results.result.forEach((item) => {
            //         if (id.toString() === item.user_id) {

            //         }
            //     });
            // });
            return results.result;
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }
    
    const getDivision = async () => {
        setShowLoading(true);
        await GetDivisionRequest(cookies.user_token).then( async (results) => {
            setDivisionList(results.result);
            setDivValForProductivity(results.result[0].id);
            setDivValForUitilization(results.result[0].id);
            setDivValForRejection(results.result[0].id);
            await GetUsersByDivisionIDRequest(cookies.user_token, results.result[0].id).then( async (results)=>{
                const userArr = [];
                const valArr = [];
                let userId = '';
                results.result.forEach(element => {
                    if (element.nickname) {
                        userArr.push(element.nickname);
                    } else {
                        userArr.push(element.email);
                    }
                    // get all date values and send out the user data then get the response to rander the chart.
                    valArr.push(element.id);
                    userId += `${element.id},`;
                });
                const reg=/,$/gi;
                userId = userId.replace(reg,"");
                setUserIds(userId);
                const pVal = await getProductivity(userId, pDateParams);
                const uVal = await getUitilization(userId, uDateParams);
                const rVal = await getRejectionRate(userId, rDateParams);
                setProductivityChartOption(productivityChartOption  => ({...productivityChartOption, xAxis: {
                    data: userArr
                },
                series: [{
                    data: calculateProductivityValue(userId, pVal)
                }]}));
                setUitilizationChartOption(uitilizationChartOption  => ({...uitilizationChartOption, xAxis: {
                    data: userArr
                },
                series: [{
                    data: calculateUitilizationValue(userId, uVal)
                }]}));
                setRejectionRateChartOption(rejectionRateChartOption  => ({...rejectionRateChartOption, xAxis: {
                    data: userArr
                },
                series: [{
                    data: calculateRejectionRateValue(userId, rVal)
                }]}));

                setShowLoading(false);
            }).catch((error) => {
                setShowLoading(false);
                return error;
            });
            setShowLoading(false);
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    };

    useEffect(() => {
        let mounted = true;

        if (mounted){
            setProductivityChartOption(productivityChartOption  => ({...productivityChartOption, title: {
                    text: Dic.text[appState.lanuage_index].Home.productivity
                },
                legend: {
                    data:[`${Dic.text[appState.lanuage_index].Home.productivity}`]
                },
                series: [{
                    name: `${Dic.text[appState.lanuage_index].Home.productivity}`
                }]
            }));
            setUitilizationChartOption(uitilizationChartOption  => ({...uitilizationChartOption, title: {
                    text: Dic.text[appState.lanuage_index].Home.uitilization
                },
                legend: {
                    data:[`${Dic.text[appState.lanuage_index].Home.uitilization}`]
                },
                series: [{
                    name: `${Dic.text[appState.lanuage_index].Home.uitilization}`
                }]
            }));
            setRejectionRateChartOption(rejectionRateChartOption  => ({...rejectionRateChartOption, title: {
                    text: Dic.text[appState.lanuage_index].Home.rejection_rate
                },
                legend: {
                    data:[`${Dic.text[appState.lanuage_index].Home.rejection_rate}`]
                },
                series: [{
                    name: `${Dic.text[appState.lanuage_index].Home.rejection_rate}`
                }]
            }));
            if (user_info.role_name === 'Manager') {
                getDivision();
            } else if (user_info.role_name === 'Leader' || user_info.role_name === 'Member') {
                getStatistic();
            }
        }
        
        return () => {
            mounted = false;
        };
    }, [appState.lanuage_index]);

    const changeDivForProductivity = (e) => {
        setDivValForProductivity(e.target.value);
        getDivUserList(e.target.value, 'p');
    };
    const changeDivForUitilization = (e) => {
        setDivValForUitilization(e.target.value);
        getDivUserList(e.target.value, 'u');
    };
    const changeDivForRejection = (e) => {
        setDivValForRejection(e.target.value);
        getDivUserList(e.target.value, 'r');
    };
    const getDivUserList = async (divId, flag) => {
        setShowLoading(true);
        await GetUsersByDivisionIDRequest(cookies.user_token, divId).then( async (results)=>{
            const userArr = [];
            const valArr = [];
            let userId = '';
            results.result.forEach(element => {
                if (element.nickname) {
                    userArr.push(element.nickname);
                } else {
                    userArr.push(element.email);
                }

                // get all date values and send out the user data then get the response to rander the chart.
                valArr.push(element.id);
                userId += `${element.id},`;
            });
            const reg=/,$/gi;
            userId = userId.replace(reg,"");
            setUserIds(userId);
            
            if (flag === 'p') {
                const pVal = await getProductivity(userId, pDateParams);
                setProductivityChartOption(productivityChartOption  => ({...productivityChartOption, xAxis: {
                    data: userArr
                },
                series: [{
                    data: calculateProductivityValue(userId, pVal)
                }]}));
            } else if (flag === 'u') {
                const uVal = await getUitilization(userId, uDateParams);
                setUitilizationChartOption(uitilizationChartOption  => ({...uitilizationChartOption, xAxis: {
                    data: userArr
                },
                series: [{
                    data: calculateUitilizationValue(userId, uVal)
                }]}));
            } else if (flag === 'r'){
                const rVal = await getRejectionRate(userId, rDateParams);
                setRejectionRateChartOption(rejectionRateChartOption  => ({...rejectionRateChartOption, xAxis: {
                    data: userArr
                },
                series: [{
                    data: calculateRejectionRateValue(userId, rVal)
                }]}));
            }
            setShowLoading(false);
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    };

    return(
        <div id="home-page" className="page-content">
                {showLoading ? <Loading /> : '' }
                <Header showLogo={false} showIcons={true} />
                <div className="page-content-container">
                    <div className="page-content-main flex-content">
                        {
                            user_info.role_name === 'admin' || user_info.role_name === 'Manager' ?
                                user_info.role_name === 'Manager' ?
                                    <>
                                        <div className="chart-item width-stand-half margin-left-right no-margin">
                                            <div className="flex-content width-stand-100 justify-content-center">
                                                <ButtonGroupWithHightLight
                                                    size="small"
                                                    buttonItems={productivityChartBtnArr}
                                                    defaultItem="1"
                                                    selectBoxCallBack={selectBoxCallBack}
                                                    itemName="productivity"
                                                />&nbsp;&nbsp;&nbsp;&nbsp;
                                                <FormControl className="no-margin">
                                                    <InputLabel id="p-select-label">{Dic.text[appState.lanuage_index].Project.select_division}</InputLabel>
                                                    <Select
                                                        labelId="p-division-selector-label"
                                                        id="p-division-selector"
                                                        value={`${divValForProductivity}`}
                                                        onChange={changeDivForProductivity}
                                                        className="div-selector"
                                                    >
                                                        {
                                                            divisionList.map((item) => {
                                                                return <MenuItem key={item.id} value={item.id} name={item.division_name}>{item.division_name}</MenuItem>;
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            {/* <h4>Productivity</h4>
                                            <div id="productivityChart"> */}
                                                <ReactEcharts option={productivityChartOption} /> {/* 8小时一天，超过task估计时间没有 */}
                                            {/* </div> */}
                                        </div>
                                        <div className="chart-item width-stand-half margin-left-right no-margin">
                                            <div className="flex-content width-stand-100 justify-content-center">
                                                <ButtonGroupWithHightLight 
                                                    size="small"
                                                    buttonItems={uitilizationChartBtnArr}
                                                    defaultItem="2"
                                                    selectBoxCallBack={selectBoxCallBack}
                                                    itemName="uitilization"
                                                />&nbsp;&nbsp;&nbsp;&nbsp;
                                                <FormControl className="no-margin">
                                                    <InputLabel id="u-select-label">{Dic.text[appState.lanuage_index].Project.select_division}</InputLabel>
                                                    <Select
                                                        labelId="u-division-selector-label"
                                                        id="u-division-selector"
                                                        value={`${divValForUitilization}`}
                                                        onChange={changeDivForUitilization}
                                                        className="div-selector"
                                                    >
                                                        {
                                                            divisionList.map((item) => {
                                                            return <MenuItem key={item.id} value={item.id} name={item.division_name}>{item.division_name}</MenuItem>;
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            {/* <h4>Uitilization</h4>
                                            <div id="uitilizationChart"> */}
                                                <ReactEcharts option={uitilizationChartOption} />{/* 当日/月/年的工作时间达到百分之多少，年假节假日是否刨除？ */}
                                            {/* </div> */}
                                        </div>
                                        <div className="chart-item width-stand-100 margin-left-right no-margin">
                                            <div className="flex-content width-stand-100 justify-content-center">
                                                <ButtonGroupWithHightLight
                                                    size="small"
                                                    buttonItems={rejectionRateChartBtnArr}
                                                    defaultItem="2"
                                                    selectBoxCallBack={selectBoxCallBack}
                                                    itemName="rejectionRate"
                                                />&nbsp;&nbsp;&nbsp;&nbsp;
                                                <FormControl className="no-margin">
                                                    <InputLabel id="r-select-label">{Dic.text[appState.lanuage_index].Project.select_division}</InputLabel>
                                                    <Select
                                                        labelId="r-division-selector-label"
                                                        id="r-division-selector"
                                                        value={`${divValForRejection}`}
                                                        onChange={changeDivForRejection}
                                                        className="div-selector"
                                                    >
                                                        {
                                                            divisionList.map((item) => {
                                                            return <MenuItem key={item.id} value={item.id} name={item.division_name}>{item.division_name}</MenuItem>;
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            {/* <h4>Rejection rate</h4>
                                            <div id="rejectionRateChart"> */}
                                                <ReactEcharts option={rejectionRateChartOption} />
                                            {/* </div> */}
                                        </div>
                                    </>
                                : ''
                            : 
                                <div className="width-stand-100">
                                    <h2>{Dic.text[appState.lanuage_index].common.statistic}</h2>
                                    <Divider />
                                    <p>{Dic.text[appState.lanuage_index].common.welcome}, <strong>{user_info.nickname}</strong>!</p>
                                    <div className="flex-content">
                                        <div className="width-stand-half">
                                        <div className="padding-left-right"><ArrowRightIcon className="text-link-icon" /><p className="text-link-text">{Dic.text[appState.lanuage_index].Home.your_project}: {
                                            userStatisitc.your_project.map((item, id) => {
                                                return <span key={id}><span><button className="text-link" onClick={() => {history.push(`/tasks/${item.id}`)}}>{item.project_name}</button></span>{id === userStatisitc.your_project.length - 1 ? '' : ','}&nbsp;&nbsp;</span>
                                            })
                                        }</p></div>
                                            {/* <p>{Dic.text[appState.lanuage_index].Home.projects_manage}: </p> */}
                                            <div className="padding-left-right"><ArrowRightIcon className="text-link-icon" /><p className="text-link-text">{Dic.text[appState.lanuage_index].Home.overdue_task_by_today} ({moment().format("YYYY-MM-DD")}): <strong>{userStatisitc.overdue_task_by_today.length}</strong></p></div>
                                            <div className="padding-left-right"><ArrowRightIcon className="text-link-icon" /><p className="text-link-text">{Dic.text[appState.lanuage_index].Home.pending_tasks}: <strong>{userStatisitc.pending_tasks.length}</strong></p></div>
                                        </div>
                                        <div className="width-stand-half">
                                            <div className="padding-left-right"><ArrowRightIcon className="text-link-icon" /><p className="text-link-text">{Dic.text[appState.lanuage_index].Home.open_tasks}: <strong>{userStatisitc.open_tasks.counter}</strong></p></div>
                                            <div className="padding-left-right"><ArrowRightIcon className="text-link-icon" /><p className="text-link-text">{Dic.text[appState.lanuage_index].Home.pending_tasks_overdue}: <strong>{userStatisitc.pending_tasks_overdue.length}</strong></p></div>
                                        </div>
                                    </div>
                                    {/* <Divider className="margin-bottom-2rem" />
                                    <h2>{Dic.text[appState.lanuage_index].Home.project_indicators}</h2>
                                    <Divider /> */}
                                </div>
                        }
                    </div>
                </div>
        </div>
    );
}