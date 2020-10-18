import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../Util/Store';
import { useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Header from '../../Components/Header/Header';
import Loading from '../../Components/Loading/Loading';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import enLocale from "date-fns/locale/en-US";
import zhLocale from "date-fns/locale/zh-CN";
import {
    GetTaskDetailRequest,
    TaskAssignToMeRequest,
    AddTaskCommentRequest
 } from './TaskDetailService';
import {
    GetAllStatusRequest,
    GetComplexityRequest,
    GetPriorityRequest,
    UpdateTaskRequest,
    TaskWorkingRequest,
    ReassignTaskRequest
} from '../Task/TaskService'
import {
    Divider,
    TextField,
    Fade,
    Modal,
    Button,
    MenuItem,
    Select,
    Tabs,
    Tab,
    Paper,
    Popover,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    FormControl,
    InputLabel
} from '@material-ui/core/';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import './TaskDetail.scss';
import Dic from '../../assets/dic/dictionary.json';
import RichEditor from '../../Components/RichEditor/Editor';
import { 
    getUserListRequest
} from '../Users/UserService';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { AddComment } from '@material-ui/icons';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import UpdateIcon from '@material-ui/icons/Update';

export default function TaskDetail(){
    const { appState } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const [showSubLoading, setShowSubLoading] = useState(false);
    const [cookies] = useCookies();
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    const history = useHistory();
    const { id } = useParams();
    const [taskDetailInfo, setTaskDetailInfo] = useState({});
    const [taskHistory, setTaskHistory] = useState([]);
    const [taskCommentList, setTaskCommentList] = useState([]);
    const [taskComment, setTaskComment] = useState('');
    const [taskCommentErr, setTaskCommentErr] = useState(false);
    const [taskStatus, setTaskStatus] = useState();
    const [ownerName, setOwnerName] = useState({
        is_assigned: true,
        text: ''
    });
    const [startWorkingTime, setStartWorkingTime] = useState(moment().format("YYYY-MM-DDTHH:mm"));
    const [stopWorkingTime, setStopWorkingTime] = useState(moment().format("YYYY-MM-DDTHH:mm"));

    const [statusList, setStatusList] = useState([]);
    const [open, setOpen] = useState(false);
    const [timingStatus, setTimingStatus] = useState('');
    const [openPopover, setOpenPopover] = useState(null);
    const [userList, setUserList] = useState([]);
    const [resHours, setResHours] = useState(0);
    const [resMinutes, setResMinutes] = useState(0);

    const [complexityArr, setComplexityArr] = useState([]);
    const [priorityArr, setPriorityArr] = useState([]);
    const [taskComplexity, setTaskComplexity] = useState();
    const [taskPriority, setTaskPriority] = useState();
    const [taskStartDate, setTaskStartDate] = useState();
    const [taskEndDate, setTaskEndDate] = useState();
    const [startDateErr, setStartDateErr] = useState(false);
    const [endDateErr, setEndDateErr] = useState(false);

    const [orgTaskTitle, setOrgTaskTitle] = useState();
    const [orgTaskStatus, setOrgTaskStatus] = useState();
    const [orgTaskEstHours, setOrgTaskEstHours] = useState();
    const [orgTaskEstMins, setOrgTaskEstMins] = useState();
    const [orgTaskComplexity, setOrgTaskComplexity] = useState();
    const [orgTaskPriority, setOrgTaskPriority] = useState();
    const [orgTaskStartDate, setOrgTaskStartDate] = useState();
    const [orgTaskEndDate, setOrgTaskEndDate] = useState();

    const [unstopedWorkingTimeErr, setUnstopedWorkingTimeErr] = useState(false);
    const [unstopedWorkingTimeText, setUnstopedWorkingTimeText] = useState('');
    const [previoustTaskId, setPreviousTaskId] = useState();
    
    const hours = [];
    const minutes = [];

    for (let i=0; i < 100; i++){
        hours.push(i);
    }
    for (let i=1; i < 60; i++){
        minutes.push(i);
    }

    const tabHandleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const getTaskDetail = async () => {
        setShowLoading(true);
        const resComplexity = await GetComplexityRequest(cookies.user_token);
        const resPriority = await GetPriorityRequest(cookies.user_token);
        setComplexityArr(resComplexity.result);
        setPriorityArr(resPriority.result);
        await GetTaskDetailRequest(cookies.user_token, id).then(async (results)=>{
            await getTaskStatusList();
            // msg.details is task detail information, msg.history is task history array. result is comments
            results.msg.details[0].date_created = results.msg.details[0].date_created.split('.')[0];
            results.msg.details[0].date_created = results.msg.details[0].date_created.replace(/T/, ' ');
            results.msg.details[0].task_description = results.msg.details[0].task_description.replace(/!-!-!-!-!/g, "\n" );
            setTaskDetailInfo(results.msg.details[0]);
            setTaskHistory(results.msg.history); // the 0 item in array is the last hisoty for the task
            setTaskStatus(results.msg.history[0].task_status_id);
            setTaskCommentList(results.result);
            setTaskComplexity(results.msg.details[0].complexity);
            setTaskPriority(results.msg.details[0].priority);
            setTaskStartDate(results.msg.details[0].start_date);
            setTaskEndDate(results.msg.details[0].end_date);
            setResHours(parseInt(results.msg.details[0].estimate_working_hours/60));
            setResMinutes(results.msg.details[0].estimate_working_hours%60);

            setOrgTaskTitle(results.msg.details[0].task_name);
            setOrgTaskStatus(results.msg.history[0].task_status_id);
            setOrgTaskComplexity(results.msg.details[0].complexity);
            setOrgTaskPriority(results.msg.details[0].priority);
            setOrgTaskStartDate(results.msg.details[0].start_date);
            setOrgTaskEndDate(results.msg.details[0].end_date);
            setOrgTaskEstHours(parseInt(results.msg.details[0].estimate_working_hours/60));
            setOrgTaskEstMins(results.msg.details[0].estimate_working_hours%60);
            
            if (results.msg.history[0].owner_email == null){
                setOwnerName({
                    is_assigned: false,
                    text: Dic.text[appState.lanuage_index].Task.assign_to_me
                });
            } else {
                if (results.msg.history[0].owner_nickname !== ''){
                    setOwnerName({
                        is_assigned: true,
                        text: `${results.msg.history[0].owner_nickname} (${results.msg.history[0].owner_email})`
                    });
                } else {
                    setOwnerName({
                        is_assigned: true,
                        text: results.msg.history[0].owner_email
                    })
                }
            }
            setShowLoading(false);
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    };

    const assignToMe = async () => {
        setShowLoading(true);
        await TaskAssignToMeRequest(cookies.user_token, id).then((results)=>{
            setShowLoading(false);
            getTaskDetail();
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    };
    const reassignTask = async (e) => {
        setOpenPopover(e.currentTarget);
        setShowSubLoading(true);
        await getUserListRequest(cookies.user_token).then((results)=>{
            if (results.code === 200){
                setShowSubLoading(false);
                setUserList(results.result);
            } else {
                setShowSubLoading(false);
                console.log('can not get response');
            }
        }).catch((error) => {
            setShowSubLoading(false);
            return error;
        });
    };
    const reassignTo = async (item) => {
        setShowSubLoading(true);
        await ReassignTaskRequest(cookies.user_token, id, item.id).then((results)=>{
            if (results.code === 200){
                setShowSubLoading(false);
                setOpenPopover(false);
                getTaskDetail();
            } else {
                setShowSubLoading(false);
                console.log('can not get response');
            }
        }).catch((error) => {
            setShowSubLoading(false);
            return error;
        });;
    };
    const openTiming = (flag) => {
        setTimingStatus(flag);
        setUnstopedWorkingTimeErr(false);
        setOpen(!open);
    };
    const closePopup = async (flag) => {
        if (flag === 'save'){
            console.log('timingStatus is: ', timingStatus);
            if (timingStatus === 'start'){// click start working button and send request
                await TaskWorkingRequest(cookies.user_token, id, timingStatus, startWorkingTime).then((results)=>{
                    if (results.result === 'unstoped_working_time_err'){
                        setUnstopedWorkingTimeErr(true);
                        setUnstopedWorkingTimeText(Dic.text[appState.lanuage_index].Task.unstoped_working_time_err_text);
                        setPreviousTaskId(results.details.task_id);
                    } else if (results.result === 'overlap_same_task_in_same_time_start_time') {
                        setUnstopedWorkingTimeErr(true);
                        setUnstopedWorkingTimeText(`${Dic.text[appState.lanuage_index].Task.overlap_same_task_in_same_time_start_time_err_text}${moment(results.details[0].start_working_time).format("YYYY-MM-DD HH:mm")}`);
                        setPreviousTaskId(results.details.task_id);
                    } else {
                        setOpen(!open);
                        getTaskDetail();
                    }
                }).catch((error) => {
                    setShowSubLoading(false);
                    return error;
                });
            } else {// click stop working button and send request
                await TaskWorkingRequest(cookies.user_token, id, timingStatus, stopWorkingTime).then((results)=>{
                    if (results.result === 'unstart_working_time_err'){
                        setUnstopedWorkingTimeErr(true);
                        setUnstopedWorkingTimeText(Dic.text[appState.lanuage_index].Task.unstart_working_time_err_text);
                    } else if (results.result === 'overlap_same_task_in_same_time_stop_time') {
                        setUnstopedWorkingTimeErr(true);
                        setUnstopedWorkingTimeText(`${Dic.text[appState.lanuage_index].Task.overlap_same_task_in_same_time_stop_time_err_text}${moment(results.details[0].stop_working_time).format("YYYY-MM-DD HH:mm")}`);
                        setPreviousTaskId(results.details.task_id);
                    } else if (results.result === 'not_same_day'){
                        setUnstopedWorkingTimeErr(true);
                        setUnstopedWorkingTimeText(`${Dic.text[appState.lanuage_index].Task.not_same_day}${moment(results.details[0].start_working_time).format("YYYY-MM-DD HH:mm")}`);
                        setPreviousTaskId(results.details.task_id);
                    } else {
                        setOpen(!open);
                        getTaskDetail();
                    }
                }).catch((error) => {
                    setShowSubLoading(false);
                    return error;
                });
            }
            
        } else {
            setOpen(!open);
        }
    };
    const getTaskStatusList = async () => {
        await GetAllStatusRequest(cookies.user_token).then((results)=>{
            setStatusList(results.result);
        }).catch((error) => {
            return error;
        });
    };
    useEffect(() => {
        let mounted = true;

        if (mounted){
            getTaskDetail();
        }
        
        return () => {
            mounted = false;
        };
    }, [appState.lanuage_index]);

    const updateTaskStatus = (e) => {
        setTaskStatus(e.target.value);
    };
    const submitComment = async () => {
        if (taskComment === '' || taskComment === '<p></p>\n' || taskComment === '<p></p>!-!-!-!-!'){
            setTaskCommentErr(true);
            return;
        } else {
            setShowLoading(true);
            setTaskCommentErr(false);
            setTaskComment(res => {
                res = res.replace(/\n/g, "!-!-!-!-!" );
                return res;
            });
            await AddTaskCommentRequest(cookies.user_token, id, taskComment).then((results)=>{
                setShowLoading(false);
                getTaskDetail();
            }).catch((error) => {
                setShowLoading(false);
                return error;
            });
        }
    };
    const changeTaskTitle = (e) => {
        setTaskDetailInfo((res)=>{
            res.task_name = e.target.innerHTML;
            return res;
        });
    };
    const updateTask = async () => {
        setEndDateErr(false);
        setStartDateErr(false);
        let submit = false;
        let taskDetails = {
            title: {
                'isUpdate': false,
                'value': ''
            },
            status: {
                'isUpdate': false,
                'value': ''
            },
            complexity: {
                'isUpdate': false,
                'value': ''
            },
            priority: {
                'isUpdate': false,
                'value': ''
            },
            startDate: {
                'isUpdate': false,
                'value': ''
            },
            endDate: {
                'isUpdate': false,
                'value': ''
            },
            estWorkingHours: {
                'isUpdate': false,
                'value': ''
            },
            estWorkingMins: {
                'isUpdate': false,
                'value': ''
            }
        };
        
        if (taskDetailInfo.task_name !== orgTaskTitle){
            taskDetails.title.isUpdate = true;
            taskDetails.title.value = taskDetailInfo.task_name;
            submit = true;
        }
        if (taskStatus !== orgTaskStatus){
            taskDetails.status.isUpdate = true;
            taskDetails.status.value = taskStatus;
            submit = true;
        }
        if (taskComplexity !== orgTaskComplexity){
            taskDetails.complexity.isUpdate = true;
            taskDetails.complexity.value = taskComplexity;
            submit = true;
        }
        if (taskPriority !== orgTaskPriority){
            taskDetails.priority.isUpdate = true;
            taskDetails.priority.value = taskPriority;
            submit = true;
        }
        if (taskStartDate.toString() !== orgTaskStartDate){
            if (moment(taskStartDate).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")){
                setStartDateErr(true);
                return;
            }
            if (moment(taskStartDate).format("YYYY-MM-DD") > moment(taskEndDate).format("YYYY-MM-DD")){
                setEndDateErr(true);
                return;
            }
            taskDetails.startDate.isUpdate = true;
            taskDetails.startDate.value = moment(taskStartDate).format("YYYY-MM-DD");
            submit = true;
        }
        if (taskEndDate.toString() !== orgTaskEndDate){     
            if (moment(taskStartDate).format("YYYY-MM-DD") > moment(taskEndDate).format("YYYY-MM-DD")){
                setEndDateErr(true);
                return;
            }      
            taskDetails.endDate.isUpdate = true;
            taskDetails.endDate.value = moment(taskEndDate).format("YYYY-MM-DD");
            submit = true;
        }
        if (resMinutes !== orgTaskEstMins || resHours !== orgTaskEstHours){
            if(resMinutes === ''){
                setResMinutes(orgTaskEstMins);
            }
            if (resHours === ''){
                setResHours(orgTaskEstHours);
            }
            taskDetails.estWorkingHours.isUpdate = true;
            taskDetails.estWorkingHours.value = resHours;
            taskDetails.estWorkingMins.isUpdate = true;
            taskDetails.estWorkingMins.value = resMinutes;
            submit = true;
        }
        if (submit){
            await UpdateTaskRequest(cookies.user_token, taskDetails, id).then((results)=>{
                setShowLoading(false);
                getTaskDetail();
            }).catch((error) => {
                setShowLoading(false);
                return error;
            });
        }
        
    };
    return (
        <div id="task-detail-page" className="page-content">
            {showLoading ? <Loading /> : '' }
            <Header showLogo={false} showIcons={true} />
            <div className="page-content-container">
                <div className="page-content-main">
                    <h1 contentEditable={true} onChange={changeTaskTitle} onBlur={(e) => {changeTaskTitle(e)}} dangerouslySetInnerHTML={{__html: taskDetailInfo.task_name}}></h1>
                    <div className="flex-content no-margin text-align-right">
                        <div className="width-stand-100">
                            <Button color="primary" startIcon={<AddAlarmIcon />} onClick={() => {openTiming('start')}}>{Dic.text[appState.lanuage_index].Task.start_working}</Button>&nbsp;&nbsp;
                            <Button color="secondary" startIcon={<AlarmOffIcon />} onClick={() => {openTiming('stop')}}>{Dic.text[appState.lanuage_index].Task.stop_working}</Button>
                            <Modal open={open} id="modal-element">
                                <Fade in={open}>
                                    <div className="modal-content timing-container">
                                        <h3>{ timingStatus === 'start' ? Dic.text[appState.lanuage_index].Task.start_working : Dic.text[appState.lanuage_index].Task.stop_working }</h3>
                                        {timingStatus === 'start' ? 
                                        <div>
                                            <TextField
                                                id="datetime-local"
                                                // label={Dic.text[appState.lanuage_index].Task.start_working}
                                                type="datetime-local"
                                                value={startWorkingTime}
                                                className="time-selector"
                                                disabled={!ownerName.is_assigned ? true : false}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                onChange={(e)=>{
                                                    setStartWorkingTime(e.target.value);
                                                }}
                                            />
                                        </div>
                                        : 
                                        <div>
                                                <TextField
                                                id="datetime-local"
                                                // label={Dic.text[appState.lanuage_index].Task.stop_working}
                                                type="datetime-local"
                                                value={stopWorkingTime}
                                                className="time-selector"
                                                disabled={!ownerName.is_assigned ? true : false}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                onChange={(e)=>{
                                                    setStopWorkingTime(e.target.value);
                                                }}
                                            />
                                        </div>}
                                        {unstopedWorkingTimeErr ? <div className="error-text" dangerouslySetInnerHTML={{ __html: unstopedWorkingTimeText }}></div> : ''}
                                        <div className="margin-around">
                                            <Button color="primary" onClick={() => {closePopup('save')}}>{ Dic.text[appState.lanuage_index].common.ok }</Button>
                                            <Button color="secondary" onClick={() => {closePopup('cancel')}}>{ Dic.text[appState.lanuage_index].common.cancel }</Button>
                                        </div>
                                    </div>
                                </Fade>
                            </Modal>
                        </div>
                    </div>
                    <div className="flex-content no-margin">
                        <div className="width-stand-third no-margin">
                            <span className="weight-600 h4-text">{`${Dic.text[appState.lanuage_index].Task.table.column.status}: `}</span><br />
                            <FormControl required>
                                <Select
                                    labelId="status-selector-label"
                                    id="status-selector"
                                    value={`${taskStatus}`}
                                    onChange={ updateTaskStatus }
                                >
                                    {
                                        statusList.map((item) => {
                                            return <MenuItem key={item.id} value={item.id} name={item.name}>{appState.lanuage_index === 0 ? item.status_name_en_US : item.status_name_zh_CN}</MenuItem>;
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <div className="width-stand-third no-margin">
                            <span className="weight-600 h4-text">
                                {`${Dic.text[appState.lanuage_index].Task.table.column.estimate_working_hours}: `}
                            </span><br />
                            
                            <FormControl required>
                                <Select
                                    labelId="status-selector-label"
                                    id="status-selector"
                                    onChange={ (e)=>{
                                        setResHours(e.target.value);
                                    } }
                                    value={resHours}
                                >
                                    {
                                        hours.map((item) => {
                                            return <MenuItem key={item} value={item} name={item}>{item}</MenuItem>;
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <span className="note-text">{ Dic.text[appState.lanuage_index].Task.hours } &nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <FormControl required>
                                <Select
                                    labelId="status-selector-label"
                                    id="status-selector"
                                    onChange={ (e)=>{
                                        setResMinutes(e.target.value)
                                    } }
                                    value={resMinutes}
                                >
                                    {
                                        minutes.map((item) => {
                                            return <MenuItem key={item} value={item} name={item}>{item}</MenuItem>;
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <span className="note-text">{ Dic.text[appState.lanuage_index].Task.minutes }</span>
                        </div>
                        <div className="width-stand-third no-margin">
                            <span className="weight-600 h4-text">{`${Dic.text[appState.lanuage_index].Task.table.column.task_owner}: `}</span><br />{!ownerName.is_assigned ? <Button startIcon={<AssignmentTurnedInIcon />} color="primary" onClick={assignToMe}>{ownerName.text}</Button> : <>
                                {ownerName.text}&nbsp;&nbsp;
                                <Button color="primary" onClick={reassignTask} startIcon={<AssignmentIndIcon />}>{Dic.text[appState.lanuage_index].Task.reassign_task}</Button> 
                                <Popover
                                    id={0}
                                    open={Boolean(openPopover)}
                                    anchorEl={openPopover}
                                    onClose={()=>{setOpenPopover(null)}}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    className="user-list-popover"
                                >
                                    {showSubLoading ? <Loading /> : '' }
                                    <List>
                                    {
                                        userList.map((item) => {
                                            return (
                                                <div key={item.id}>
                                                    <ListItem button onClick={() => {
                                                            reassignTo(item);
                                                        }}>
                                                        <ListItemIcon>
                                                            <PermIdentityIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={item.nickname} />
                                                    </ListItem>
                                                </div>
                                            )
                                        })
                                    }
                                    </List>
                                </Popover>
                            </>}
                        </div>
                    </div>

                    <div className="flex-content">
                        <div className="width-stand-third no-margin">
                            <span className="weight-600 h4-text">{ Dic.text[appState.lanuage_index].Task.task_complexity }:</span><br />
                            <FormControl required>
                                <Select
                                    labelId="complexity-selector-label"
                                    id="complexity-selector"
                                    value={`${taskComplexity}`}
                                    onChange={ (e)=>{
                                        setTaskComplexity(e.target.value);
                                    } }
                                >
                                    {
                                        complexityArr.map((item, id) => {
                                            return <MenuItem key={item.id} value={item.id} name={item.complexity_name_en_US}>{appState.lanuage_index === 0 ? item.complexity_name_en_US : item.complexity_name_zh_CN}</MenuItem>;
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <div className="width-stand-third no-margin">
                        <span className="weight-600 h4-text">{ Dic.text[appState.lanuage_index].Task.task_priority }:</span><br />
                        <FormControl required>
                            <Select
                                labelId="priority-selector-label"
                                id="priority-selector"
                                value={`${taskPriority}`}
                                onChange={ (e)=>{
                                    setTaskPriority(e.target.value);
                                } }
                            >
                                {
                                    priorityArr.map((item) => {
                                        return <MenuItem key={item.id} value={item.id} name={item.priority_name_en_US}>{appState.lanuage_index === 0 ? item.priority_name_en_US : item.priority_name_zh_CN}</MenuItem>;
                                    })
                                }
                            </Select>
                        </FormControl>
                        </div>
                        <div className="width-stand-third no-margin">
                            <span className="weight-600 h4-text">{Dic.text[appState.lanuage_index].Task.start_date}:</span><br />
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={appState.lanuage_index === 0 ? enLocale : zhLocale}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="start-data-dialog"
                                        value={taskStartDate}
                                        error={startDateErr}
                                        helperText={startDateErr ? Dic.text[appState.lanuage_index].Task.start_date_err_text : ''}
                                        onChange={(date)=>{
                                            setTaskStartDate(date);
                                        }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </div>
                    </div>
                    <div className="flex-content no-margin">
                        <div className="width-stand-third no-margin">
                            <span className="weight-600 h4-text">{Dic.text[appState.lanuage_index].Task.table.column.date_created}:<br /></span>
                            {taskDetailInfo.date_created}
                        </div>
                        <div className="width-stand-third no-margin">
                            <span className="weight-600 h4-text">{Dic.text[appState.lanuage_index].Task.task_created_by}:<br /></span>
                            {taskDetailInfo.nickname !== '' ? `${taskDetailInfo.nickname} (${taskDetailInfo.email})` : taskDetailInfo.email}
                        </div>
                        <div className="width-stand-third no-margin">
                            <span className="weight-600 h4-text">{Dic.text[appState.lanuage_index].Task.end_date}:</span><br />
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={appState.lanuage_index === 0 ? enLocale : zhLocale}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="stop-data-dialog"
                                        value={taskEndDate}
                                        error={endDateErr}
                                        helperText={endDateErr ? Dic.text[appState.lanuage_index].Task.end_date_err_text : ''}
                                        onChange={(date)=>{
                                            setTaskEndDate(date);
                                        }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </div>
                    </div>
                    <div className="flex-content float-right">
                        <Button onClick={updateTask} startIcon={<UpdateIcon />} color="primary">{Dic.text[appState.lanuage_index].common.update}</Button>
                    </div>
                    <div className="flex-content no-margin clear-both">
                        <h4 className="weight-600  no-margin">{Dic.text[appState.lanuage_index].Task.task_description}: </h4>
                    </div>

                    <div className="flex-content no-margin padding-left-right eee-bg">
                        <div dangerouslySetInnerHTML={{ __html: taskDetailInfo.task_description }}></div>
                    </div>
                    <br/>
                    <Divider />
                    <Paper>
                        <Tabs
                            value={activeTab}
                            onChange={tabHandleChange}
                            indicatorColor="primary"
                            textColor="primary"                            
                        >
                            <Tab label={ Dic.text[appState.lanuage_index].Task.task_comment.title } />
                            <Tab label={ Dic.text[appState.lanuage_index].Task.task_history } />
                        </Tabs>
                    </Paper>
                    {activeTab === 0 ? 
                        // {/* comments section start */}
                        <div className="flex-content">
                        {
                            taskCommentList.map((item, id) => {
                                item.comments = item.comments.replace(/!-!-!-!-!/g, "\n" );
                                const historyPoster = item.nickname !== '' ? `${item.nickname} (${item.email})` : item.email;
                                return (
                                    <div className="flex-content width-stand-100 no-margin" key={id}>
                                        <div className="width-stand-100 no-margin">
                                            <p className="no-margin"><span className="no-margin note-text" dangerouslySetInnerHTML={{ __html: historyPoster}}></span> <span className="no-margin note-text">{Dic.text[appState.lanuage_index].Task.task_comment.added_comment} - </span><span className="no-margin note-text" dangerouslySetInnerHTML={{ __html: item.date_created }}></span></p>
                                        </div>
                                        <div className="width-stand-100 no-margin">
                                            <div dangerouslySetInnerHTML={{ __html: item.comments }}></div>
                                        </div>
                                        <div className="width-stand-100 no-margin">
                                            <Divider />
                                        </div>
                                    </div>
                                );
                            })
                        }
                        <div className="width-stand-100">
                            <RichEditor placeholder={Dic.text[appState.lanuage_index].Task.task_comment.place_holder} stateCallback={(val) => {
                                setTaskCommentErr(false);
                                setTaskComment(val);
                            }} />
                        </div>
                        <div className="width-stand-100 no-margin text-align-right">
                            {taskCommentErr ? <span className='error-text'>{Dic.text[appState.lanuage_index].Task.task_comment.error_text}&nbsp;&nbsp;&nbsp;&nbsp;</span> : ''}
                            <Button color="primary" onClick={submitComment} startIcon={<AddComment />}>{ Dic.text[appState.lanuage_index].common.add }</Button>
                        </div>
                    </div>
                    // {/* comments section stop */}
                    : 
                    // {/* history section start */}
                    <div className="flex-content">
                        {
                            taskHistory.map((item) => {
                                let action_time = item.action_time.split('.')[0];
                                action_time = action_time.replace(/T/, ' ');
                                if (item.action_name_en_US === 'Create task'){
                                    return (
                                        <>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{taskDetailInfo.nickname !== '' ? `${taskDetailInfo.nickname} (${taskDetailInfo.email})` : taskDetailInfo.email}</p>
                                            </div>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{appState.lanuage_index === 0 ? item.action_name_en_US : item.action_name_zh_CN}</p>
                                            </div>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{taskDetailInfo.date_created}</p>
                                            </div>
                                        </>
                                    );
                                } else if (item.action_name_en_US === 'Assign to'){//
                                    return (
                                        <>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{item.nick !== '' ? `${item.nickname} (${item.email})` : item.email}</p>
                                            </div>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{appState.lanuage_index === 0 ? item.action_name_en_US : item.action_name_zh_CN} - {ownerName.text}</p>
                                            </div>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{action_time}</p>
                                            </div>
                                        </>
                                    )
                                } else if (item.action_name_en_US === 'Reassign to') {
                                    return (
                                        <>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{item.nick !== '' ? `${item.nickname} (${item.email})` : item.email}</p>
                                            </div>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{appState.lanuage_index === 0 ? item.action_name_en_US : item.action_name_zh_CN} - {item.owner_nick !== '' ? `${item.owner_nickname} (${item.owner_email})` : item.owner_email}</p>
                                            </div>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{action_time}</p>
                                            </div>
                                        </>
                                    );
                                } else {
                                    return (
                                        <>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{item.nick !== '' ? `${item.nickname} (${item.email})` : item.email}</p>
                                            </div>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{appState.lanuage_index === 0 ? item.action_name_en_US : item.action_name_zh_CN}</p>
                                            </div>
                                            <div className="width-stand-third no-margin">
                                                <p className="note-text">{action_time}</p>
                                            </div>
                                        </>
                                    )
                                }
                                
                            })
                        }
                    </div>
                    // {/* history section stop */}
                    }
                </div>
            </div>
        </div>
    );
}
