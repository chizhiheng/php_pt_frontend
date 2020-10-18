import React, {useState, useEffect, useContext} from 'react';
import Header from '../../Components/Header/Header';
import Loading from '../../Components/Loading/Loading';
import { useParams } from "react-router-dom";
import { AppContext } from '../../Util/Store';
import Table from '../../Components/Table/Table';
import Dic from '../../assets/dic/dictionary.json';
import { AddBox } from '@material-ui/icons/';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useCookies } from 'react-cookie';
import enLocale from "date-fns/locale/en-US";
import zhLocale from "date-fns/locale/zh-CN";
import {
    GetAllTasksForMemberRequest,
    GetAllStatusRequest,
    CreateTaskRequest,
    GetUsersByDivisionIDRequest,
    GetProjectByDivisionRequest,
    SkipTaskToMeRequest,
    GetComplexityRequest,
    GetPriorityRequest
 } from './TaskService';
 import RichEditor from '../../Components/RichEditor/Editor';
 import { 
    GetAllCompanyRequest,
    GetCompanyByIdRequest
} from '../Company/CompanyService';
import {
    TaskAssignToMeRequest
 } from '../TaskDetail/TaskDetailService';
 import { 
    Fade,
    TextField,
    TextareaAutosize,
    Divider,
    Button,
    Modal,
    InputLabel, 
    FormControl, 
    FormHelperText,
    Select, 
    MenuItem
} from '@material-ui/core/';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import MoreIcon from '@material-ui/icons/More';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import './Task.scss';

export default function Task(){
    const { appState } = useContext(AppContext);
    const [showLoading, setShowLoading] = useState(false);
    const { id } = useParams();
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    const [cookies] = useCookies();
    const [tableData, setTableData] = useState({});
    const [companyInputErr, setCompanyInputErr] = useState(false);
    const [divisionInputErr, setDivisionInputErr] = useState(false);
    const [companyForCreatTaskInputErr, setCompanyForCreatTaskInputErr] = useState(false);
    const [divisionForCreatTaskInputErr, setDivisionForCreatTaskInputErr] = useState(false);
    const [ownerInputErr, setOwnerInputErr] = useState(false);
    const [statusInputErr, setStatusInputErr] = useState(false);
    const [belongProjectInputErr, setBelongProjectInputErr] = useState(false);
    const [taskNameInputErr, setTaskNameInputErr] = useState(false);
    const [disabledDivSelector, setDisabledDivSelector] = useState(true);
    const [disabledDivSelectorForTask, setDisabledDivSelectorForTask] = useState(true);
    const [listResult, setListResult] = useState([]);
    const [listResultForTask, setListResultForTask] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [divisionList, setDivisionList] = useState([]);
    const [companyListForTask, setCompanyListForTask] = useState([]);
    const [divisionListForTask, setDivisionListForTask] = useState([]);
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    const [openSkiped, setOpenSkiped] = useState(false);
    const history = useHistory();
    const [formValues, setFormValues] = useState({
        user_company: '',
        user_division: '',
        forTaskPopup: {
            user_company: '',
            user_division: '',
            task_owner: '',
            task_status: '',
            task_complexity: '',
            task_priority: '',
            task_project: '',
            task_name: '',
            task_description: '',
            estimate_hours: 0,
            estimate_minutes: 1,
            start_date: '',
            end_date: ''
        }
    });
    const [startDate, setStartDate] = useState(new Date(moment().format("YYYY-MM-DDTHH:mm:ss")));
    const [endDate, setEndDate] = useState(new Date(new Date(moment().format("YYYY-MM-DDTHH:mm:ss")).setTime(new Date().getTime()+24*60*60*1000)));
    const [startDateErr, setStartDateErr] = useState(false);
    const [endDateErr, setEndDateErr] = useState(false);
    const [userList, setUserList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [priorityInputErr, setPriorityInputErr] = useState(false);
    const [complexityInputErr, setComplexityInputErr] = useState(false);
    const [skippedTaskId, setSkippedTaskId] = useState('');
    const [skippedTaskErr, setSkippedTaskErr] = useState(false);
    const [skippedTaskReason, setSkippedTaskReason] = useState('');
    let complexity= [];
    let priority = [];
    const [complexityArr, setComplexityArr] = useState([]);
    const [priorityArr, setPriorityArr] = useState([]);
    let orderLists = [];
    const hours = [];
    const minutes = [];

    for (let i=0; i < 100; i++){
        hours.push(i);
    }
    for (let i=1; i < 60; i++){
        minutes.push(i);
    }
    
    const openCreatetaskModal = () => {
        setOpenAddTaskModal(true);
    };
    const closeCreateTaskModal = () => {
        setOpenAddTaskModal(false);
    }
    const closeSkipTaskModal = () => {
        setOpenSkiped(false);
        setSkippedTaskErr(false);
    }
    const createTaskSubmit = async () => {
        setEndDateErr(false);
        setStartDateErr(false);
        setCompanyForCreatTaskInputErr(false);
        setDivisionForCreatTaskInputErr(false);
        setDivisionInputErr(false);
        setOwnerInputErr(false);
        setStatusInputErr(false);
        setBelongProjectInputErr(false);
        setTaskNameInputErr(false);
        setPriorityInputErr(false);
        setComplexityInputErr(false);
        if (formValues.forTaskPopup.user_company === ''){
            setCompanyForCreatTaskInputErr(true);
            return;
        }
        if (!formValues.forTaskPopup.user_division || formValues.forTaskPopup.user_division === ''){
            setDivisionForCreatTaskInputErr(true);
            return;
        }
        // if (!formValues.forTaskPopup.task_owner || formValues.forTaskPopup.task_owner === ''){
        //     setOwnerInputErr(true);
        //     return;
        // }
        if (!formValues.forTaskPopup.task_complexity || formValues.forTaskPopup.task_complexity === ''){
            setComplexityInputErr(true);
            return;
        }
        if (!formValues.forTaskPopup.task_priority || formValues.forTaskPopup.task_priority === ''){
            setPriorityInputErr(true);
            return;
        }
        if (!formValues.forTaskPopup.task_status || formValues.forTaskPopup.task_status === ''){
            setStatusInputErr(true);
            return;
        }
        if (!formValues.forTaskPopup.task_project || formValues.forTaskPopup.task_project === ''){
            setBelongProjectInputErr(true);
            return;
        }
        if (!formValues.forTaskPopup.task_name || formValues.forTaskPopup.task_name.trim() === ''){
            setTaskNameInputErr(true);
            return;
        }
        if (moment(startDate).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")){
            setStartDateErr(true);
            return;
        }
        if (moment(startDate).format("YYYY-MM-DD") > moment(endDate).format("YYYY-MM-DD")){
            setEndDateErr(true);
            return;
        }
        setFormValues((res) => {
            res.forTaskPopup.start_date = moment(startDate).format("YYYY-MM-DD");
            res.forTaskPopup.end_date = moment(endDate).format("YYYY-MM-DD");
            return res;
        });
        setFormValues(res => {
            res.forTaskPopup.task_description = res.forTaskPopup.task_description.replace(/\n/g, "!-!-!-!-!" );
            return res;
        });
        setShowLoading(true);
        await CreateTaskRequest(cookies.user_token, formValues.forTaskPopup).then((results)=>{
            setShowLoading(false);
            closeCreateTaskModal();
            getTaskList();
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    };

    const getCompanyForAdmin = async () => {
        await GetAllCompanyRequest(cookies.user_token).then((results)=>{
            if (results.code === 200){
                if (results.result.length > 0){
                    setListResult(results.result);
                    setListResultForTask(results.result);
                    let tmp_cmp_res = [];
                    results.result.forEach( (element, id) => {    
                        if (element.p_id === 0){
                            tmp_cmp_res.push(element);
                        }
                    });
                    setCompanyList(tmp_cmp_res);
                    setCompanyListForTask(tmp_cmp_res);
                }
            } else {
                setShowLoading(false);
                console.log('can not get response');
            }
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }
    const getCompanyForMgnAndLeader = async () => {
        await GetCompanyByIdRequest(cookies.user_token).then((results)=>{
            if (results.code === 200){
                if (results.result.length > 0){
                    setListResult(results.result);
                    setListResultForTask(results.result);
                    let tmp_cmp_res = [];
                    results.result.forEach(element => {
                        if (element.p_id === 0){
                            tmp_cmp_res.push(element);
                        }
                    });
                    setCompanyList(tmp_cmp_res);
                    setCompanyListForTask(tmp_cmp_res);
                }
            } else {
                setShowLoading(false);
                console.log('can not get response');
            }
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }
    const taskDetail = (rowData) => {
        history.push(`/task/details/${rowData.id}`);
    }
    const pickTask = async (rowData) => {
        if (rowData.id === orderLists[0]){
            setShowLoading(true);
            await TaskAssignToMeRequest(cookies.user_token, rowData.id).then((results)=>{
                setShowLoading(false);
                getTaskList();
            }).catch((error) => {
                setShowLoading(false);
                return error;
            });
        } else {
            setSkippedTaskId(rowData.id);
            setOpenSkiped(true);
        }
    }
    const skipTaskSubmit = async () => {
        if (skippedTaskReason === ''){
            setSkippedTaskErr(true);
            return;
        } else {
            setSkippedTaskErr(false);
            setShowLoading(true);
            await SkipTaskToMeRequest(cookies.user_token, skippedTaskId, skippedTaskReason).then((results)=>{
                setOpenSkiped(false);
                setShowLoading(false);
                getTaskList();
            }).catch((error) => {
                setShowLoading(false);
                return error;
            });;
        }
    }
    const getTaskList = async () => {
        setTableData({
            tableName: Dic.text[appState.lanuage_index].Task.table.table_name,
            columns: [
                { title: Dic.text[appState.lanuage_index].Task.table.column.task_name, field: 'task_name', sorting: true },
                { title: Dic.text[appState.lanuage_index].Task.table.column.project, field: 'project_name', sorting: true },
                { title: Dic.text[appState.lanuage_index].Task.table.column.status, field: `status_name_${appState.lanuage_index === 0 ? 'en_US' : 'zh_CN'}`, sorting: true },
                { title: Dic.text[appState.lanuage_index].Task.table.column.estimate_working_hours, sorting: true, render: rowData => {
                    const hours = parseInt(rowData.estimate_working_hours/60);
                    const mins = rowData.estimate_working_hours%60;
                    return hours+' '+Dic.text[appState.lanuage_index].Task.hours+' '+mins+' '+Dic.text[appState.lanuage_index].Task.minutes;
                }},
                { title: Dic.text[appState.lanuage_index].Task.table.column.task_owner, sorting: true, render: rowData => {
                    if (rowData.nickname == null && rowData.email == null){
                        return Dic.text[appState.lanuage_index].Task.task_unassigned;
                    }
                    if (rowData.nickname !== '') {
                        return rowData.nickname + ` (${rowData.email})`
                    } else {
                        return rowData.email;
                    }
                }},
                // { title: Dic.text[appState.lanuage_index].Task.table.column.date_created, field: 'date_created', sorting: true, render: rowData => {
                //     let res = rowData.date_created.split('.')[0];
                //     res = res.replace(/T/, ' ');
                //     return res;
                // }},
                { title: Dic.text[appState.lanuage_index].Task.table.column.start_date, field: 'start_date', sorting: true, render: rowData => {
                    let res = moment(rowData.start_date).format("YYYY-MM-DDTHH:mm:ss").split('.')[0];
                    res = res.replace(/T/, ' ');
                    return res;
                }},
                { title: Dic.text[appState.lanuage_index].Task.table.column.end_date, field: 'end_date', sorting: true, render: rowData => {
                    let res = moment(rowData.end_date).format("YYYY-MM-DDTHH:mm:ss").split('.')[0];
                    res = res.replace(/T/, ' ');
                    return res;
                }},
                { title: Dic.text[appState.lanuage_index].Task.table.column.task_complexity, field: 'complexity', sorting: true, render: rowData => {
                    let res = '';
                    complexity.forEach(element => {
                        if (element.id === rowData.complexity){
                            if (appState.lanuage_index === 0){
                                res = element.complexity_name_en_US;
                            } else {
                                res = element.complexity_name_zh_CN;
                            }
                        }
                    });
                    return res;
                }},
                { title: Dic.text[appState.lanuage_index].Task.table.column.task_priority, field: 'priority', sorting: true, render: rowData => {
                    let res = '';
                    priority.forEach(element => {
                        if (element.id === rowData.priority){
                            if (appState.lanuage_index === 0){
                                res = element.priority_name_en_US;
                            } else {
                                res = element.priority_name_zh_CN;
                            }
                        }
                    });
                    return res;
                }},
            ],
            data: [],
            options: {
                // pageSize: 10,
                actionsColumnIndex: -1, 
                draggable: false,
                headerStyle: {
                    backgroundColor: '#607d8b',
                    color: '#FFF'
                },
                pageSizeOptions: [5, 10],
            },
            localization: {
                pagination: {
                    labelDisplayedRows: '{from}-{to} / {count}',
                    labelRowsSelect: Dic.text[appState.lanuage_index].common.rows
                },
                header: {
                    actions: Dic.text[appState.lanuage_index].common.actions
                },
                body: {
                    emptyDataSourceMessage: Dic.text[appState.lanuage_index].common.empty_data,
                    filterRow: {
                        filterTooltip: Dic.text[appState.lanuage_index].common.filter_tooltip
                    }
                },
                toolbar: {
                    searchPlaceholder: Dic.text[appState.lanuage_index].common.search,
                    searchTooltip: Dic.text[appState.lanuage_index].common.search,
                }
            }
        });
        if (user_info.role_id === 1){//admin
            getCompanyForAdmin();
        } else if (user_info.role_id === 2 || user_info.role_id === 3){//manager and leader
            getCompanyForMgnAndLeader();
        }
        setShowLoading(true);
        await GetAllTasksForMemberRequest(cookies.user_token, id).then((results)=>{
            setShowLoading(false);
            setTableData( tableData => ({
                ...tableData, 
                data: results.result
                })
            );
            orderLists = [];
            results.result.forEach(element => {
                orderLists.push(element.id);
            });
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
        if (user_info.role_name === 'admin' || user_info.role_name === 'Manager' || user_info.role_name === 'Leader'){
            setTableData( tableData => ({
                ...tableData, 
                actions: [
                    {
                        icon: AddBox,
                        tooltip: Dic.text[appState.lanuage_index].Task.table.add_task,
                        isFreeAction: true,
                        onClick: () => openCreatetaskModal(),
                    },
                    {
                        icon: RefreshIcon,
                        tooltip: Dic.text[appState.lanuage_index].Users.user_list_tab.table.action_tooltip,
                        isFreeAction: true,
                        onClick: (e) => getTaskList(),//reloadTable(e),
                    },
                    rowData => ({
                        icon: MoreIcon,
                        tooltip: Dic.text[appState.lanuage_index].Project.table.action_tooltip,
                        onClick: (event, rowData) => {
                            taskDetail(rowData);
                        },
                    }),
                    rowData => ({
                        icon: TouchAppIcon,
                        tooltip: Dic.text[appState.lanuage_index].Task.assign_to_me,
                        onClick: (event, rowData) => {
                            pickTask(rowData);
                        },
                    })
                ]})
            );
        } else {
            setTableData( tableData => ({
                ...tableData, 
                actions: [
                    {
                        icon: RefreshIcon,
                        tooltip: Dic.text[appState.lanuage_index].Users.user_list_tab.table.action_tooltip,
                        isFreeAction: true,
                        onClick: (e) => getTaskList(),//reloadTable(e),
                    },
                    rowData => ({
                        icon: MoreIcon,
                        tooltip: Dic.text[appState.lanuage_index].Project.table.action_tooltip,
                        onClick: (event, rowData) => {
                            taskDetail(rowData);
                        },
                    }),
                    rowData => ({
                        icon: TouchAppIcon,
                        tooltip: Dic.text[appState.lanuage_index].Task.assign_to_me,
                        onClick: (event, rowData) => {
                            pickTask(rowData);
                        },
                    })
                ]})
            );
        }
    };
    const getTaskRelevantList = async () => {
        setShowLoading(true);
        await GetComplexityRequest(cookies.user_token).then(async (results)=>{
            complexity = results.result;
            setComplexityArr(results.result);
            await GetPriorityRequest(cookies.user_token).then(async (results)=>{
                priority = results.result;
                setPriorityArr(results.result);
                await GetAllStatusRequest(cookies.user_token).then((results)=>{
                    setShowLoading(false);
                    setStatusList(results.result);
                    getTaskList();
                }).catch((error) => {
                    setShowLoading(false);
                    return error;
                });
            }).catch((error) => {
                return error;
            });
        }).catch((error) => {
            return error;
        });
        
    };
    //update task form items methods:
    const setCompanyValue = (e) => {
        setFormValues(formValues => ({...formValues, user_division: ''}));
        setFormValues(formValues => ({...formValues, user_company: e.target.value}));
        if (listResult.length > 0){
            let tmp_div_res = [];
            listResult.forEach(element => {
                if (element.p_id === e.target.value){
                    tmp_div_res.push(element);
                }
            });
            if (tmp_div_res.length > 0){
                setDisabledDivSelector(false);
            } else {
                setDisabledDivSelector(true);
            }
            setDivisionList(tmp_div_res);
        } else {
            setDisabledDivSelector(true);
        }
    };
    const setDivisionValue = async (e) => {
        // setShowLoading(true);
        setFormValues(formValues => ({...formValues, user_division: e.target.value}));
        getTaskList();
    };
    const setDivisionValueForCreateTask = async (e) => {
        setShowLoading(true);
        setFormValues(res => {
            res.forTaskPopup.user_division = e.target.value;
            return res;
        });
        await GetUsersByDivisionIDRequest(cookies.user_token, e.target.value).then((results)=>{
            setUserList(results.result);
            setShowLoading(false);
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
        await GetProjectByDivisionRequest(cookies.user_token, e.target.value).then((results)=>{
            setProjectList(results.result);
            setShowLoading(false);
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
        setFormValues(res => {
            res.forTaskPopup.task_owner = '';
            res.forTaskPopup.task_project = '';
            return res;
        });
        setDivisionForCreatTaskInputErr(false);
    }
    const setCompanyValueForCreateTask = (e) => {
        setFormValues(formValues => ({...formValues, forTaskPopup: {
            user_division: ''
        }}));
        setFormValues(formValues => ({...formValues, forTaskPopup: {
            user_company: e.target.value
        }}));
        if (listResultForTask.length > 0){
            let tmp_div_res = [];
            listResultForTask.forEach(element => {
                if (element.p_id === e.target.value){
                    tmp_div_res.push(element);
                }
            });
            console.log(tmp_div_res.length);
            if (tmp_div_res.length > 0){
                setDisabledDivSelectorForTask(false);
            } else {
                setDisabledDivSelectorForTask(true);
            }
            setDivisionListForTask(tmp_div_res);
        } else {
            setDisabledDivSelectorForTask(true);
        }

        setFormValues(res => {
            res.forTaskPopup.estimate_hours = 0;
            res.forTaskPopup.estimate_minutes = 1;
            return res;
        });
        setCompanyForCreatTaskInputErr(false);
    }
    const updateTaskEstimateHours = (e) => {
        setFormValues(res => {
            res.forTaskPopup.estimate_hours = e.target.value;
            return res;
        });
    }
    const updateTaskEstimateMinutes = (e) => {
        setFormValues(res => {
            res.forTaskPopup.estimate_minutes = e.target.value;
            return res;
        });
    }
    const updateTaskDescription = (val) => {
        setFormValues(res => {
            res.forTaskPopup.task_description = val;
            return res;
        });
    }
    const updateTaskName = (e) => {
        setFormValues(res => {
            res.forTaskPopup.task_name = e.target.value.trim();
            return res;
        });
        if (e.target.value.trim() !== ''){
            setTaskNameInputErr(false);
        }
    }
    const updateTaskStatus = (e) => {
        setFormValues(res => {
            res.forTaskPopup.task_status = e.target.value;
            return res;
        });
        setStatusInputErr(false);
    }
    const updateTaskProject = (e) => {
        setFormValues(res => {
            res.forTaskPopup.task_project = e.target.value;
            return res;
        });
        setBelongProjectInputErr(false);
    }
    const updateTaskOwner = (e) => {
        setFormValues(res => {
            res.forTaskPopup.task_owner = e.target.value;
            return res;
        });
        setOwnerInputErr(false);
    }

    useEffect(() => {
        let mounted = true;
        
        if (!user_info) {
            history.push('/');
        } else {
            if (mounted){
                if (user_info.role_id === 1){//admin
                    getCompanyForAdmin();
                } else if (user_info.role_id === 2 || user_info.role_id === 3){//manager and leader
                    getCompanyForMgnAndLeader();
                }
                getTaskRelevantList();
            }
        }
        
        return () => {
            mounted = false;
        };
    }, [appState.lanuage_index]);

    return (
        <div id="task-page" className="page-content user-page">
            {showLoading ? <Loading /> : '' }
            <Header showLogo={false} showIcons={true} />
            <div className="page-content-container">
                <div className="page-content-main">
                    { user_info && (user_info.role_name === 'admin' || user_info.role_name === 'Manager') ? 
                        <div className="flex-content">
                            <div className="width-stand-half">
                                <FormControl required variant="outlined" className="width-stand-80" error={companyInputErr}>
                                    <InputLabel id="company-selector">{ Dic.text[appState.lanuage_index].Users.add_new_user_tab.select_company }</InputLabel>
                                    <Select
                                        labelId="company-selector-label"
                                        id="company-selector"
                                        value={formValues.user_company}
                                        onChange={(e)=>{setCompanyValue(e)}}
                                    >
                                        {
                                            companyList.map((item) => {
                                                return <MenuItem key={item.id} value={item.id} name={item.name}>{item.name}</MenuItem>;
                                            })
                                        }
                                    </Select>
                                    { companyInputErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Users.add_new_user_tab.select_company_err_text }</FormHelperText> : ''}
                                </FormControl>
                            </div>
                            <div className="width-stand-half">
                                <FormControl required disabled={disabledDivSelector} variant="outlined" className="width-stand-80" error={divisionInputErr}>
                                    <InputLabel id="division-selector">
                                    { Dic.text[appState.lanuage_index].Users.add_new_user_tab.select_division }
                                    </InputLabel>
                                    <Select
                                        labelId="division-selector-label"
                                        id="division-selector"
                                        value={formValues.user_division}
                                        onChange={(e)=>{setDivisionValue(e)}}
                                    >
                                        {
                                            divisionList.map((item) => {
                                                return <MenuItem key={item.id} value={item.id} name={item.name}>{item.name}</MenuItem>;
                                            })
                                        }
                                    </Select>
                                    { divisionInputErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Users.add_new_user_tab.select_division_err_text }</FormHelperText> : ''}
                                </FormControl>
                            </div>
                        </div>
                    : '' }
                    <Modal open={openAddTaskModal} id="modal-element" onClose={closeCreateTaskModal}>
                        <Fade in={openAddTaskModal}>
                            <div className="modal-content add-task-container">
                                <h2>{ Dic.text[appState.lanuage_index].Task.create_task }</h2>
                                { user_info && (user_info.role_name === 'admin' || user_info.role_name === 'Manager' || user_info.role_name === 'Leader') ? 
                                    <div className="flex-content">
                                        <div className="width-stand-half">
                                            <FormControl required variant="outlined" className="width-stand-80" error={companyForCreatTaskInputErr}>
                                                <InputLabel id="company-selector">{ Dic.text[appState.lanuage_index].Users.add_new_user_tab.select_company }</InputLabel>
                                                <Select
                                                    labelId="company-selector-label"
                                                    id="company-selector"
                                                    value={formValues.forTaskPopup.user_company}
                                                    onChange={(e)=>{setCompanyValueForCreateTask(e)}}
                                                >
                                                    {
                                                        companyListForTask.map((item) => {
                                                            return <MenuItem key={item.id} value={item.id} name={item.name}>{item.name}</MenuItem>;
                                                        })
                                                    }
                                                </Select>
                                                { companyForCreatTaskInputErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Users.add_new_user_tab.select_company_err_text }</FormHelperText> : ''}
                                            </FormControl>
                                        </div>
                                        <div className="width-stand-half">
                                            <FormControl required disabled={disabledDivSelectorForTask} variant="outlined" className="width-stand-80" error={divisionForCreatTaskInputErr}>
                                                <InputLabel id="division-selector">
                                                { Dic.text[appState.lanuage_index].Users.add_new_user_tab.select_division }
                                                </InputLabel>
                                                <Select
                                                    labelId="division-selector-label"
                                                    id="division-selector"
                                                    value={formValues.forTaskPopup.user_division}
                                                    onChange={(e)=>{setDivisionValueForCreateTask(e)}}
                                                >
                                                    {
                                                        divisionListForTask.map((item) => {
                                                            return <MenuItem key={item.id} value={item.id} name={item.name}>{item.name}</MenuItem>;
                                                        })
                                                    }
                                                </Select>
                                                { divisionForCreatTaskInputErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Users.add_new_user_tab.select_division_err_text }</FormHelperText> : ''}
                                            </FormControl>
                                        </div>
                                    </div>
                                : '' }
                                <div className="flex-content">
                                    <div className="width-stand-half">
                                        <FormControl required disabled={projectList.length > 0 ? false : true} variant="outlined" className="width-stand-80" error={belongProjectInputErr}>
                                            <InputLabel id="status-selector">
                                                { Dic.text[appState.lanuage_index].Task.task_project }
                                            </InputLabel>
                                            <Select
                                                labelId="status-selector-label"
                                                id="status-selector"
                                                // value={formValues.user_division}
                                                onChange={ updateTaskProject }
                                            >
                                                {
                                                    projectList.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id} name={item.project_name}>{item.project_name}</MenuItem>;
                                                    })
                                                }
                                            </Select>
                                            { belongProjectInputErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Task.belong_project_err_text }</FormHelperText> : ''}
                                        </FormControl>
                                    </div>
                                    <div className="width-stand-half">
                                        <FormControl disabled={userList.length > 0 ? false : true} variant="outlined" className="width-stand-80">
                                            <InputLabel id="user-selector">
                                                { Dic.text[appState.lanuage_index].Task.task_owner }
                                            </InputLabel>
                                            <Select
                                                labelId="owner-selector-label"
                                                id="owner-selector"
                                                // value={formValues.forTaskPopup.task_owner}
                                                defaultValue={0}
                                                onChange={ updateTaskOwner }
                                            >
                                                <MenuItem key={0} value={0} name="0">{Dic.text[appState.lanuage_index].Task.task_unassigned}</MenuItem>
                                                {
                                                    userList.map((item) => {
                                                        return item.role_name !== 'Manager' ? <MenuItem key={item.id} value={item.id} name={item.nickname !== '' ? `${item.nickname} - ${item.email}` : item.email}>{item.nickname !== '' ? `${item.nickname} - ${item.email}` : item.email}</MenuItem> : '';
                                                    })
                                                }
                                            </Select>
                                            {/* { ownerInputErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Task.owner_err_text }</FormHelperText> : ''} */}
                                        </FormControl>
                                    </div>
                                    <div className="width-stand-half">
                                        <FormControl required variant="outlined" className="width-stand-80" error={complexityInputErr}>
                                            <InputLabel id="status-selector">
                                                { Dic.text[appState.lanuage_index].Task.task_complexity }
                                            </InputLabel>
                                            <Select
                                                labelId="status-selector-label"
                                                id="status-selector"
                                                value={formValues.task_complexity}
                                                onChange={ (e)=>{
                                                    setFormValues(res => {
                                                        res.forTaskPopup.task_complexity = e.target.value;
                                                        return res;
                                                    });
                                                    setComplexityInputErr(false);
                                                } }
                                            >
                                                {
                                                    complexityArr.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id} name={item.complexity_name_en_US}>{appState.lanuage_index === 0 ? item.complexity_name_en_US : item.complexity_name_zh_CN}</MenuItem>;
                                                    })
                                                }
                                            </Select>
                                            { complexityInputErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Task.task_complexity_err_text }</FormHelperText> : ''}
                                        </FormControl>
                                    </div>
                                    <div className="width-stand-half">
                                        <FormControl required variant="outlined" className="width-stand-80" error={priorityInputErr}>
                                            <InputLabel id="status-selector">
                                                { Dic.text[appState.lanuage_index].Task.task_priority }
                                            </InputLabel>
                                            <Select
                                                labelId="status-selector-label"
                                                id="status-selector"
                                                value={formValues.task_priority}
                                                onChange={ (e)=>{
                                                    setFormValues(res => {
                                                        res.forTaskPopup.task_priority = e.target.value;
                                                        return res;
                                                    });
                                                    setPriorityInputErr(false);
                                                } }
                                            >
                                                {
                                                    priorityArr.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id} name={item.priority_name_en_US}>{appState.lanuage_index === 0 ? item.priority_name_en_US : item.priority_name_zh_CN}</MenuItem>;
                                                    })
                                                }
                                            </Select>
                                            { priorityInputErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Task.task_priority_err_text }</FormHelperText> : ''}
                                        </FormControl>
                                    </div>
                                    <div className="width-stand-half">
                                        <FormControl required variant="outlined" className="width-stand-80" error={statusInputErr}>
                                            <InputLabel id="status-selector">
                                                { Dic.text[appState.lanuage_index].Task.task_status }
                                            </InputLabel>
                                            <Select
                                                labelId="status-selector-label"
                                                id="status-selector"
                                                // value={formValues.user_division}
                                                onChange={ updateTaskStatus }
                                            >
                                                {
                                                    statusList.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id} name={item.name}>{appState.lanuage_index === 0 ? item.status_name_en_US : item.status_name_zh_CN}</MenuItem>;
                                                    })
                                                }
                                            </Select>
                                            { statusInputErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Task.status_err_text }</FormHelperText> : ''}
                                        </FormControl>
                                    </div>
                                    
                                    
                                    <div className="width-stand-half">
                                        <TextField 
                                            error={ taskNameInputErr } 
                                            required
                                            id="outlined-task-name" 
                                            className="width-stand-80"
                                            label={ Dic.text[appState.lanuage_index].Task.task_name }
                                            variant="outlined"
                                            onChange={ updateTaskName }
                                            helperText={ taskNameInputErr ? Dic.text[appState.lanuage_index].Task.task_name_err_text : '' }
                                        />
                                    </div>
                                </div>
                                <Divider />
                                <div className="flex-content">
                                    <div className="width-stand-half display-flex">
                                        <div className="width-stand-20">
                                            <p>{Dic.text[appState.lanuage_index].Task.start_date}:</p>
                                        </div>
                                        <div className="width-stand-80 text-align-left task-date-picker">
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={appState.lanuage_index === 0 ? enLocale : zhLocale}>
                                                <Grid container justify="space-around">
                                                    <KeyboardDatePicker
                                                        disableToolbar
                                                        variant="inline"
                                                        format="MM/dd/yyyy"
                                                        margin="normal"
                                                        id="start-data-dialog"
                                                        value={startDate}
                                                        error={startDateErr}
                                                        helperText={startDateErr ? Dic.text[appState.lanuage_index].Task.start_date_err_text : ''}
                                                        onChange={(date)=>{
                                                            setStartDate(date);
                                                        }}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                    />
                                                </Grid>
                                            </MuiPickersUtilsProvider>
                                        </div>
                                    </div>
                                    <div className="width-stand-half display-flex">
                                        <div className="width-stand-20">
                                            <p>{Dic.text[appState.lanuage_index].Task.end_date}:</p>
                                        </div>
                                        <div className="width-stand-80 text-align-left task-date-picker">
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={appState.lanuage_index === 0 ? enLocale : zhLocale}>
                                                <Grid container justify="space-around">
                                                    <KeyboardDatePicker
                                                        disableToolbar
                                                        variant="inline"
                                                        margin="normal"
                                                        id="end-date-dialog"
                                                        format="MM/dd/yyyy"
                                                        value={endDate}
                                                        error={endDateErr}
                                                        helperText={endDateErr ? Dic.text[appState.lanuage_index].Task.end_date_err_text : ''}
                                                        onChange={(date)=>{
                                                            setEndDate(date);
                                                        }}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                    />
                                                </Grid>
                                            </MuiPickersUtilsProvider>
                                        </div>
                                    </div>
                                </div>
                                <Divider />
                                <div className="width-stand-half">
                                    <span className="estimate_title">{ Dic.text[appState.lanuage_index].Task.estimate_working_hours }</span>
                                    <FormControl required variant="outlined" className="width-stand-20 margin-around">
                                        <InputLabel id="status-selector">
                                            { Dic.text[appState.lanuage_index].Task.hours }
                                        </InputLabel>
                                        <Select
                                            labelId="status-selector-label"
                                            id="status-selector"
                                            // value={formValues.forTaskPopup.estimate_hours}
                                            onChange={ updateTaskEstimateHours }
                                            defaultValue={formValues.forTaskPopup.estimate_hours}
                                        >
                                            {
                                                hours.map((item) => {
                                                    return <MenuItem key={item} value={item} name={item}>{item}</MenuItem>;
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl required variant="outlined" className="width-stand-20 margin-around">
                                        <InputLabel id="status-selector">
                                            { Dic.text[appState.lanuage_index].Task.minutes }
                                        </InputLabel>
                                        <Select
                                            labelId="status-selector-label"
                                            id="status-selector"
                                            // value={formValues.forTaskPopup.estimate_minutes}
                                            onChange={ updateTaskEstimateMinutes }
                                            defaultValue={formValues.forTaskPopup.estimate_minutes}
                                        >
                                            {
                                                minutes.map((item) => {
                                                    return <MenuItem key={item} value={item} name={item}>{item}</MenuItem>;
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                    
                                </div>
                                <Divider />
                                <div className="flex-content">
                                    <RichEditor placeholder={Dic.text[appState.lanuage_index].Task.task_description} stateCallback={updateTaskDescription} />
                                </div>
                                <Divider />
                                <div className="btn-area">
                                    <Button color="primary" onClick={ createTaskSubmit }>{ Dic.text[appState.lanuage_index].common.create }</Button>
                                    <Button color="secondary" onClick={ closeCreateTaskModal }>{ Dic.text[appState.lanuage_index].common.cancel }</Button>
                                </div>
                            </div>
                        </Fade>
                    </Modal>
                    <Modal open={openSkiped} id="modal-element" onClose={closeSkipTaskModal}>
                        <Fade in={openSkiped}>
                            <div className="modal-content skip-task-container">
                                <h3>{Dic.text[appState.lanuage_index].Task.skip_task.title}</h3>
                                <TextareaAutosize
                                    aria-label="maximum height"
                                    placeholder={Dic.text[appState.lanuage_index].Task.skip_task.reason}
                                    value={skippedTaskReason}
                                    onChange={ (e) => {
                                        setSkippedTaskErr(false);
                                        setSkippedTaskReason(e.target.value);
                                    } }
                                />
                                {skippedTaskErr ? <p className="error-text no-margin">{Dic.text[appState.lanuage_index].Task.skip_task.error_text}</p> : ''}
                                <Divider className="margin-top-bottom" />
                                <div className="btn-area">
                                    <Button color="primary" onClick={ skipTaskSubmit }>{ Dic.text[appState.lanuage_index].common.ok }</Button>
                                    <Button color="secondary" onClick={ closeSkipTaskModal }>{ Dic.text[appState.lanuage_index].common.cancel }</Button>
                                </div>
                            </div>
                        </Fade>
                    </Modal>
                    <Table tableData={tableData} pageSize='10'/>
                </div>
            </div>
        </div>
    );
}