import React, {useState, useEffect, useContext} from 'react';
import Header from '../../Components/Header/Header';
import Loading from '../../Components/Loading/Loading';
import { useCookies } from 'react-cookie';
import './Users.scss';
import { 
    Button, 
    Radio, 
    RadioGroup, 
    FormControlLabel, 
    FormLabel, 
    InputLabel, 
    FormControl, 
    FormHelperText,
    Select, 
    MenuItem, 
    Divider, 
    TextField,
    Tabs,
    Tab,
    Paper,
    Fade,
    Modal
} from '@material-ui/core/';
import RefreshIcon from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';
import { 
    GetUserRoleRequest,
    CreateUserRequest,
    checkEmailExistedRequest,
    getUserListRequest,
    deleteUserRequest,
    updateUserRequest
} from './UserService';
import { 
    GetAllCompanyRequest,
    GetCompanyByIdRequest
} from '../Company/CompanyService';
import Table from '../../Components/Table/Table';
import { AppContext } from '../../Util/Store';
import Dic from '../../assets/dic/dictionary.json';
import { useHistory } from "react-router-dom";

export default function Users (){
    const { appState } = useContext(AppContext);
    const [showLoading, setShowLoading] = useState(false);
    const [cookies] = useCookies();
    const [roleList, setRoleList] = useState([]);
    const [listResult, setListResult] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [divisionList, setDivisionList] = useState([]);
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    const [disabledDivSelector, setDisabledDivSelector] = useState(true);
    const [formValues, setFormValues] = useState({
        user_email: '',
        user_password: '',
        user_nickname: '',
        user_role: '',
        user_company: '',
        user_division: '',
        is_active: 'true'
    });
    const [emailInputErr, setEmailInputErr] = useState(false);
    const [pwdInputErr, setPwdInputErr] = useState(false);
    const [roleInputErr, setRoleInputErr] = useState(false);
    const [companyInputErr, setCompanyInputErr] = useState(false);
    const [divisionInputErr, setDivisionInputErr] = useState(false);
    const [emailErrorText, setEmailErrorText] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [tableData, setTableData] = useState({});
    const history = useHistory();
    const [openUpdateUserModal, setOpenUpdateUserModal] = useState(false);
    const [updateUserName, setUpdateUserName] = useState('');
    const [oldUserInfo, setOldUserInfo] = useState({});
    const [needReload, setNeedReload] = useState(false);
    let listResultVar = [];

    const tabHandleChange = (event, newValue) => {
        setActiveTab(newValue);
        setFormValues({
            user_email: '',
            user_password: '',
            user_nickname: '',
            user_role: '',
            user_company: '',
            user_division: '',
            is_active: 'true'
        });
        if (newValue === 0 && needReload){
            getUserList();
            setNeedReload(false);
        }
    };
    const getCompanyForAdmin = async () => {
        await GetAllCompanyRequest(cookies.user_token).then((results)=>{
            if (results.code === 200){
                if (results.result.length > 0){
                    setListResult(results.result);
                    listResultVar = results.result;
                    let tmp_cmp_res = [];
                    results.result.forEach( (element, id) => {    
                        if (element.p_id === 0){
                            tmp_cmp_res.push(element);
                        }
                    });
                    setCompanyList(tmp_cmp_res);
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
                    listResultVar = results.result;
                    let tmp_cmp_res = [];
                    results.result.forEach(element => {
                        if (element.p_id === 0){
                            tmp_cmp_res.push(element);
                        }
                    });
                    setCompanyList(tmp_cmp_res);
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
    const getJobRole = async ()=>{
        setShowLoading(true);
        await GetUserRoleRequest(cookies.user_token).then((results)=>{
            if (results.code === 200){
                setShowLoading(false);
                setRoleList(results.result);
            } else {
                setShowLoading(false);
                console.log('can not get response');
            }
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }
    const setRoleValue = (e)=>{
        setFormValues(formValues => ({...formValues, user_role: e.target.value}));
    }
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
    }
    const setDivisionValue = (e) => {
        setFormValues(formValues => ({...formValues, user_division: e.target.value}));
    }
    const checkEmailExisted = async () => {
        if (formValues.user_email.trim() !== ''){
            await checkEmailExistedRequest(cookies.user_token, formValues.user_email).then((results)=>{
                if (results.code === 200){
                    if (results.result[0].total !== 0){
                        setEmailInputErr(true);
                        setEmailErrorText(Dic.text[appState.lanuage_index].Users.add_new_user_tab.email_id_existed_err_text);
                    } else {
                        setEmailInputErr(false);
                    }
                } else {
                    console.log('can not get response');
                }
            }).catch((error) => {
                return error;
            });
        }
    }
    const closeUpdateUserModal = () => {
        setEmailInputErr(false);
        setPwdInputErr(false);
        setRoleInputErr(false);
        setCompanyInputErr(false);
        setDivisionInputErr(false);
        setOpenUpdateUserModal(false);
        setFormValues({
            user_email: '',
            user_password: '',
            user_nickname: '',
            user_role: '',
            user_company: '',
            user_division: '',
            is_active: 'true'
        });
        // setErrors(false);
    }
    const updateUser = (item) => {
        setOpenUpdateUserModal(true);
        setUpdateUserName(item.email);
        if (listResultVar.length > 0){
            let tmp_div_res = [];
            listResultVar.forEach(element => {
                if (element.p_id === item.company_id){
                    tmp_div_res.push(element);
                }
            });
            setDivisionList(tmp_div_res);
        } else {
            setDisabledDivSelector(true);
        }
        if (item.division_id){
            setDisabledDivSelector(false);
        }
        setOldUserInfo({...item});
        setFormValues({
            user_email: item.email,
            user_password: '',
            user_nickname: item.nickname,
            user_role: item.role_id,
            user_company: item.company_id,
            user_division: item.division_id,
            is_active: item.is_active === 1 ? "true" : "false",
            user_id: item.id
        });
    }
    const updateFormValues = (e) => {
        if (e.target.name === "email"){
            setFormValues(formValues => ({...formValues, user_email: e.target.value}));
        } else if (e.target.name === "password"){
            setFormValues(formValues => ({...formValues, user_password: e.target.value}));
        } else if (e.target.name === "nickname"){
            setFormValues(formValues => ({...formValues, user_nickname: e.target.value}));
        }
        e.persist();
    }
    const getUserList = async (mounted) => {
        setShowLoading(true);
        await getUserListRequest(cookies.user_token).then((results)=>{
            if (results.code === 200){
                setShowLoading(false);
                setTableData({
                    tableName: Dic.text[appState.lanuage_index].Users.user_list_tab.table.table_name,
                    actions: [
                        {
                            icon: RefreshIcon,
                            tooltip: Dic.text[appState.lanuage_index].Users.user_list_tab.table.action_tooltip,
                            isFreeAction: true,
                            onClick: (e) => getUserList(),//reloadTable(e),
                        },
                        rowData => ({
                            icon: EditIcon,
                            tooltip: Dic.text[appState.lanuage_index].common.edit,
                            isFreeAction: true,
                            onClick: (e) => { updateUser(rowData) },
                            hidden: user_info.role_name === 'admin' || user_info.role_name === 'Manager' ? false : true
                        })
                    ],
                    columns: [
                        { title: Dic.text[appState.lanuage_index].Users.user_list_tab.table.column.company_name, field: 'company_name', sorting: true },
                        { title: Dic.text[appState.lanuage_index].Users.user_list_tab.table.column.division_name, field: 'division_name', sorting: true },
                        { title: Dic.text[appState.lanuage_index].Users.user_list_tab.table.column.role_name, field: 'role_name', sorting: true },
                        { title: Dic.text[appState.lanuage_index].Users.user_list_tab.table.column.nickname, field: 'nickname', sorting: true },
                        { title: Dic.text[appState.lanuage_index].Users.user_list_tab.table.column.email, field: 'email', sorting: true },
                        { title: Dic.text[appState.lanuage_index].Users.user_list_tab.table.column.active, field: 'is_active', sorting: true,
                            render: rowData => rowData.is_active === 1 ? Dic.text[appState.lanuage_index].common.yes : Dic.text[appState.lanuage_index].common.no
                        },
                    ],
                    data: results.result,
                    options: {
                        // pageSize: 7,
                        actionsColumnIndex: -1, 
                        draggable: false,
                        headerStyle: {
                            backgroundColor: '#607d8b',
                            color: '#FFF'
                        },
                        pageSizeOptions: [5, 10],
                    },
                    localization: {
                        addTooltip: Dic.text[appState.lanuage_index].common.add,
                        deleteTooltip: Dic.text[appState.lanuage_index].common.delete,
                        editTooltip: Dic.text[appState.lanuage_index].common.edit,
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
                            },
                            addTooltip: Dic.text[appState.lanuage_index].common.add,
                            editTooltip: Dic.text[appState.lanuage_index].common.edit,
                            deleteTooltip: Dic.text[appState.lanuage_index].common.delete,
                            editRow:{
                                deleteText: Dic.text[appState.lanuage_index].common.delete_confirm_text,
                                saveTooltip: Dic.text[appState.lanuage_index].common.save,
                                cancelTooltip: Dic.text[appState.lanuage_index].common.cancel,
                            }
                        },
                        toolbar: {
                            searchPlaceholder: Dic.text[appState.lanuage_index].common.search,
                            searchTooltip: Dic.text[appState.lanuage_index].common.search,
                        }
                    },
                });
                if (user_info.role_name === 'admin' || user_info.role_name === 'Manager' || user_info.role_name === 'Leader'){
                    setTableData( tableData => ({
                        ...tableData, 
                        editable: {
                            onRowDelete: oldData => 
                            new Promise((resolve, reject) => {
                                if (oldData.email === user_info.email){
                                    // reject();
                                    return;
                                }
                                deleteUserRequest(cookies.user_token, oldData.id).then((results)=>{
                                    getUserList();
                                    setShowLoading(false);
                                }).catch((error) => {
                                    return error;
                                });
                            }),
                        },
                    }));
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
    
    useEffect(() => {
        let monted = true;
        if (monted){
            if (!user_info) {
                history.push('/');
            } else {
                getJobRole();
                if (user_info.role_id === 1){//admin
                    getCompanyForAdmin();
                } else if (user_info.role_id === 2 || user_info.role_id === 3){//manager and leader
                    getCompanyForMgnAndLeader();
                }
                getUserList();
            }
        }
        return () => monted = false;
    }, [appState.lanuage_index]);

    const createUserSubmit = async () => {
        setEmailInputErr(false);
        setPwdInputErr(false);
        setRoleInputErr(false);
        setCompanyInputErr(false);
        setDivisionInputErr(false);
        if (formValues.user_email.trim() === '' || formValues.user_email.trim().search(/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) === -1){
            setEmailInputErr(true);
            setEmailErrorText(Dic.text[appState.lanuage_index].Users.add_new_user_tab.email_format_err_text);
            return;
        }
        if (formValues.user_password.trim() === '' || formValues.user_password.length < 6 || formValues.user_password.trim().search(/^\w+$/g) === -1){
            setPwdInputErr(true);
            return;
        }
        if (formValues.user_role === ''){
            setRoleInputErr(true);
            return;
        }
        if (formValues.user_company === ''){
            setCompanyInputErr(true);
            return;
        }
        if (formValues.user_division === ''){
            setDivisionInputErr(true);
            return;
        }

        setShowLoading(true);
        await CreateUserRequest(cookies.user_token, formValues).then((results)=>{
            if (results.code === 200){
                setShowLoading(false);
                setNeedReload(true);
                setFormValues({
                    user_email: '',
                    user_password: '',
                    user_nickname: '',
                    user_role: '',
                    user_company: '',
                    user_division: '',
                    is_active: 'true'
                });
            } else {
                setShowLoading(false);
                console.log('can not get response');
            }
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }
    const updateUserSubmit = async () => {
        const oldUserInfoActive = oldUserInfo.is_active === 1 ? "true" : "false";
        if ( oldUserInfo.company_id === formValues.user_company && oldUserInfo.division_id === formValues.user_division &&
            oldUserInfo.nickname === formValues.user_nickname && oldUserInfo.role_id === formValues.user_role && oldUserInfoActive === formValues.is_active) {
                //console.log('nothing change');
        } else {
            if (formValues.user_role === ''){
                setRoleInputErr(true);
                return;
            }
            if (formValues.user_company === ''){
                setCompanyInputErr(true);
                return;
            }
            
            if (user_info.user_role !== 2) { // is not a manager, need to add division
                if (formValues.user_division === ''){
                    setDivisionInputErr(true);
                    return;
                }
            }
            setShowLoading(true);
            await updateUserRequest(cookies.user_token, formValues).then((results)=>{
                if (results.code === 200){
                    setShowLoading(false);
                    closeUpdateUserModal();
                    getUserList();
                    setOldUserInfo({
                        company_id: formValues.user_company,
                        division_id: formValues.user_division,
                        nickname: formValues.user_nickname,
                        role_id: formValues.user_role,
                        is_active: formValues.is_active
                    });
                } else {
                    setShowLoading(false);
                    console.log('can not get response');
                }
            }).catch((error) => {
                setShowLoading(false);
                return error;
            });
        }
    }
    
    return (
        <div id="user-page" className="page-content user-page">
            {showLoading ? <Loading /> : '' }
            <Header showLogo={false} showIcons={true} />
            <div className="page-content-container">
                <div className="page-content-main">
                    <Paper>
                        <Tabs
                            value={activeTab}
                            onChange={tabHandleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label={ Dic.text[appState.lanuage_index].Users.tab.user_list } />
                            <Tab label={ Dic.text[appState.lanuage_index].Users.tab.add_new_user } />
                        </Tabs>
                    </Paper>
                    { activeTab === 0 ? 
                        <div className="user-tab">
                            <Table tableData={tableData} pageSize='10'/>
                        </div>
                    :
                        <div className="user-tab">
                            <div className="flex-content">
                                <div className="width-stand-half">
                                    <TextField 
                                        required 
                                        label={ Dic.text[appState.lanuage_index].Users.add_new_user_tab.email }
                                        variant="outlined" 
                                        className="width-stand-80" 
                                        helperText={ emailInputErr ? emailErrorText : "" }
                                        error={ emailInputErr }
                                        name="email"
                                        value={formValues.user_email}
                                        onChange={ updateFormValues }
                                        onBlur={ checkEmailExisted }
                                    />
                                </div>
                                <div className="width-stand-half">
                                    <TextField 
                                        required 
                                        label={ Dic.text[appState.lanuage_index].Users.add_new_user_tab.password } 
                                        variant="outlined" 
                                        className="width-stand-80" 
                                        name="password"
                                        helperText={ pwdInputErr ? Dic.text[appState.lanuage_index].Users.add_new_user_tab.password_err_text : "" }
                                        error={ pwdInputErr }
                                        onChange={ updateFormValues }
                                        value={formValues.user_password}
                                    />
                                </div>
                                <div className="width-stand-half">
                                    <TextField 
                                        label={ Dic.text[appState.lanuage_index].Users.add_new_user_tab.nickname }
                                        variant="outlined" 
                                        name="nickname"
                                        className="width-stand-80"
                                        onChange={ updateFormValues }
                                        value={formValues.user_nickname}
                                    />
                                </div>
                                <div className="width-stand-half">
                                    <FormControl required variant="outlined" className="width-stand-80" error={roleInputErr}>
                                        <InputLabel id="job-role-label">{ Dic.text[appState.lanuage_index].Users.add_new_user_tab.job_role }</InputLabel>
                                        <Select
                                            labelId="job-role-label"
                                            id="job-role"
                                            value={formValues.user_role}
                                            onChange={(e)=>{setRoleValue(e)}}
                                        >
                                            <MenuItem key="0" value=""><em>None</em></MenuItem>
                                            {
                                                roleList.map((item) => {
                                                    return <MenuItem key={item.id} value={item.id} name={item.role_name}>{item.role_name}</MenuItem>;
                                                })
                                            }
                                        </Select>
                                        { roleInputErr ? <FormHelperText> { Dic.text[appState.lanuage_index].Users.add_new_user_tab.job_role_err_text } </FormHelperText> : ''}
                                    </FormControl>
                                </div>
                                <div className="width-stand-100 flex-content radio-row-container">
                                    <FormLabel component="legend">{ Dic.text[appState.lanuage_index].Users.add_new_user_tab.is_active_user }</FormLabel>
                                    <RadioGroup 
                                        aria-label="Is Active" 
                                        name="isactive" 
                                        value={ formValues.is_active } 
                                        onChange={ (e) => {
                                            setFormValues(formValues => ({...formValues, is_active: e.target.value}));
                                        }}
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label={ Dic.text[appState.lanuage_index].common.yes } />
                                        <FormControlLabel value="false" control={<Radio />} label={ Dic.text[appState.lanuage_index].common.no } />
                                    </RadioGroup>
                                </div>
                            </div>
                            <Divider />
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
                            <Divider />
                            <div className="text-align-center margin-top-2rem">
                                <Button variant="contained" color="primary" onClick={createUserSubmit}>{ Dic.text[appState.lanuage_index].common.create }</Button>
                            </div>
                        </div>
                    }
                    {/* update user overlay */}
                    <Modal open={openUpdateUserModal} id="modal-element" onClose={closeUpdateUserModal}>
                        <Fade in={openUpdateUserModal}>
                            <div className="modal-content update-user-container">
                                <h2>{ Dic.text[appState.lanuage_index].Users.user_list_tab.update_user }{updateUserName}</h2>
                                <div className="flex-content">
                                    <div className="width-stand-half">
                                    <TextField 
                                        required 
                                        label={ Dic.text[appState.lanuage_index].Users.add_new_user_tab.email }
                                        variant="outlined" 
                                        className="width-stand-80" 
                                        name="email"
                                        value={formValues.user_email}
                                        disabled
                                    />
                                    </div>
                                    <div className="width-stand-half">
                                        <TextField 
                                            label={ Dic.text[appState.lanuage_index].Users.add_new_user_tab.nickname }
                                            variant="outlined" 
                                            name="nickname"
                                            className="width-stand-80"
                                            onChange={ updateFormValues }
                                            value={formValues.user_nickname}
                                        />
                                    </div>
                                    <div className="width-stand-half">
                                        <FormControl required variant="outlined" className="width-stand-80" error={roleInputErr}>
                                            <InputLabel id="job-role-label">{ Dic.text[appState.lanuage_index].Users.add_new_user_tab.job_role }</InputLabel>
                                            <Select
                                                labelId="job-role-label"
                                                id="job-role"
                                                value={formValues.user_role}
                                                onChange={(e)=>{setRoleValue(e)}}
                                                // labelWidth={labelWidth}
                                            >
                                                <MenuItem key="0" value=""><em>None</em></MenuItem>
                                                {
                                                    roleList.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id} name={item.role_name}>{item.role_name}</MenuItem>;
                                                    })
                                                }
                                            </Select>
                                            { roleInputErr ? <FormHelperText> { Dic.text[appState.lanuage_index].Users.add_new_user_tab.job_role_err_text } </FormHelperText> : ''}
                                        </FormControl>
                                    </div>
                                    <div className="width-stand-half"></div>
                                    <div className="width-stand-100 flex-content radio-row-container">
                                        <FormLabel component="legend">{ Dic.text[appState.lanuage_index].Users.add_new_user_tab.is_active_user }</FormLabel>
                                        <RadioGroup 
                                            aria-label="Is Active" 
                                            name="isactive" 
                                            value={ formValues.is_active } 
                                            onChange={ (e) => {
                                                setFormValues(formValues => ({...formValues, is_active: e.target.value}));
                                            }}
                                        >
                                            <FormControlLabel checked={ formValues.is_active === "true" } value="true" control={<Radio />} label={ Dic.text[appState.lanuage_index].common.yes } />
                                            <FormControlLabel checked={ formValues.is_active === "false" } value="false" control={<Radio />} label={ Dic.text[appState.lanuage_index].common.no } />
                                        </RadioGroup>
                                    </div>
                                </div>
                                <Divider />
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
                                                // labelWidth={labelWidth}
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
                                <Divider />
                                <div className="text-align-center margin-top-2rem">
                                    <Button variant="contained" color="primary" onClick={updateUserSubmit}>{ Dic.text[appState.lanuage_index].common.update }</Button>
                                </div>
                            </div>
                        </Fade>
                    </Modal>
                </div>
            </div>
        </div>
    );
}