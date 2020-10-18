import React, {useEffect, useState, useContext} from 'react';
import './Projects.scss';
import Header from '../../Components/Header/Header';
import Loading from '../../Components/Loading/Loading';
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Table from '../../Components/Table/Table';
import { 
    GetAllCompanyRequest,
    GetCompanyByIdRequest
} from '../Company/CompanyService';
import {
    GetAllProjectsRequest,
    SaveProjectRequest
 } from './ProjectService';
import { AddBox } from '@material-ui/icons/';
import MoreIcon from '@material-ui/icons/More';
import RefreshIcon from '@material-ui/icons/Refresh';
import {
    Fade,
    TextField,
    Button,
    Modal,
    InputLabel, 
    FormControl, 
    Select,
    MenuItem,
    FormHelperText
} from '@material-ui/core/';
import { AppContext } from '../../Util/Store';
import Dic from '../../assets/dic/dictionary.json';

export default function Projects(){
    const { appState } = useContext(AppContext);
    const history = useHistory();
    const [cookies] = useCookies();
    const [tableData, setTableData] = useState({});
    const [showLoading, setShowLoading] = useState(false);
    const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
    const [errors, setErrors] = useState(false);
    const [projectName, setProjectName] = useState('');
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    const [listResult, setListResult] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [divisionList, setDivisionList] = useState([]);
    const [disabledDivSelector, setDisabledDivSelector] = useState(true);
    const [companyNameErr, setCompanyNameErr] = useState(false);
    const [divisionNameErr, setDivisionNameErr] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [formValues, setFormValues] = useState({
        user_company: '',
        user_division: ''
    });
    
    const openCreateProjectModal = () => {
        setOpenAddProjectModal(true);
        if (user_info.role_id === 1){//admin
            getCompanyForAdmin();
        } else if (user_info.role_id === 2 || user_info.role_id === 3){//manager
            getCompanyForMgn();
        }
    };
    const closeCreateProjectModal = () => {
        setOpenAddProjectModal(false);
        setErrors(false);
    }

    const setCompanyValue = (e) => {
        setFormValues(formValues => ({...formValues, user_company: e.target.value}));
        if (listResult.length > 0){
            let tmp_div_res = [];
            listResult.forEach(element => {
                if (element.p_id === e.target.value){
                    tmp_div_res.push(element);
                }
            });
            console.log(tmp_div_res);
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
    const getCompanyForMgn = async () => {
        await GetCompanyByIdRequest(cookies.user_token).then((results)=>{
            if (results.code === 200){
                if (results.result.length > 0){
                    setListResult(results.result);
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
    const setDivisionValue = (e) => {
        console.log(e.target.value);
        setFormValues(formValues => ({...formValues, user_division: e.target.value}));
    }

    const getCompanyForAdmin = async () => {
        await GetAllCompanyRequest(cookies.user_token).then((results)=>{
            if (results.code === 200){
                if (results.result.length > 0){
                    setListResult(results.result);
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

    const getProjectList = async () => {
        setShowLoading(true);
        await GetAllProjectsRequest(cookies.user_token).then((results)=>{
            setTableData({
                tableName: Dic.text[appState.lanuage_index].Project.table.table_name,
                columns: [
                    { title: Dic.text[appState.lanuage_index].Project.table.column.project_name, field: 'project_name', sorting: true },
                    { title: Dic.text[appState.lanuage_index].Project.table.column.company_name, field: 'company_name', sorting: true },
                    { title: Dic.text[appState.lanuage_index].Project.table.column.division_name, field: 'division_name', sorting: true },
                    { title: Dic.text[appState.lanuage_index].Project.table.column.date_created, field: 'date_created', sorting: true, cellStyle: {color: 'gray'} },
                ],
                data: results.result,
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
                        },
                        deleteTooltip: Dic.text[appState.lanuage_index].common.delete,
                        editRow:{
                            deleteText: Dic.text[appState.lanuage_index].common.delete_confirm_text,
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
                    actions: [
                        {
                            icon: AddBox,
                            tooltip: Dic.text[appState.lanuage_index].Project.table.add_project,
                            isFreeAction: true,
                            onClick: () => openCreateProjectModal(),
                        },
                        {
                            icon: RefreshIcon,
                            tooltip: Dic.text[appState.lanuage_index].Users.user_list_tab.table.action_tooltip,
                            isFreeAction: true,
                            onClick: (e) => getProjectList(),//reloadTable(e),
                        },
                        rowData => ({
                            icon: MoreIcon,
                            tooltip: Dic.text[appState.lanuage_index].Project.table.action_tooltip,
                            onClick: (event, rowData) => {
                                console.log('aaaaaaa: ', rowData);
                                openTask(rowData);
                            },
                        })
                    ],
                    editable: {
                        onRowDelete: oldData => 
                        new Promise((resolve, reject) => {
                            console.log(oldData);
                        })
                    }})
                );
            } else {
                setTableData( tableData => ({
                    ...tableData, 
                    actions: [
                        {
                            icon: RefreshIcon,
                            tooltip: Dic.text[appState.lanuage_index].Users.user_list_tab.table.action_tooltip,
                            isFreeAction: true,
                            onClick: (e) => getProjectList(),//reloadTable(e),
                        },
                        rowData => ({
                            icon: MoreIcon,
                            tooltip: 'More',
                            onClick: (event, rowData) => {
                                openTask(rowData);
                            }
                        })
                    ]})
                );
            }
            setShowLoading(false);
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    };

    const updateProjectInfo = (e) => {
        setProjectName(e.target.value);
    }

    const createProjectSubmit = async () => {
        if (formValues.user_company === ''){
            setCompanyNameErr(true);
            return;
        } else {
            setCompanyNameErr(false);
        }
        if (formValues.user_division === ''){
            setDivisionNameErr(true);
            return;
        } else {
            setDivisionNameErr(false);
        }
        if (projectName.trim().length === 0){
            setErrors(true);
            setErrorText(Dic.text[appState.lanuage_index].Project.project_name_err_text_empty);
            return;
        } else {
            setErrors(false);
        }
        setShowLoading(true);
        await SaveProjectRequest(cookies.user_token, formValues.user_company, formValues.user_division, projectName).then((results)=>{
            if (results.code === 202){
                setShowLoading(false);
                setErrors(true);
                setErrorText(Dic.text[appState.lanuage_index].Project.project_name_err_text_duplicate);
            } else if (results.code === 200){
                setShowLoading(false);
                closePopup();
                setShowLoading(true);
                getProjectList();
            } else {
                setShowLoading(false);
                console.log('can not get response');
            }
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }

    const openTask = ( data ) => {
        history.push(`/tasks/${data.id}`);
    }

    const closePopup = () => {
        setOpenAddProjectModal(!openAddProjectModal);
        setErrors(false);
        setCompanyNameErr(false);
        setDivisionNameErr(false);
    }
    useEffect(() => {
        let mounted = true;
        if (!user_info) {
            history.push('/');
        } else {
            if (mounted){
                getProjectList();
            }
        }
        return () => {
            mounted = false;
        };
    }, [appState.lanuage_index]);
    
    return (
        <div id="projects-page" className="page-content">
            {showLoading ? <Loading /> : '' }
            <Header showLogo={false} showIcons={true} />
            <div className="page-content-container">
                <div className="page-content-main">
                    <Modal open={openAddProjectModal} id="modal-element" onClose={closeCreateProjectModal}>
                        <Fade in={openAddProjectModal}>
                            <div className="modal-content add-project-container">
                                <h2>{ Dic.text[appState.lanuage_index].Project.create_project }</h2>
                                { user_info && (user_info.role_name === 'admin' || user_info.role_name === 'Manager' || user_info.role_name === 'Leader') ? 
                                    <div>
                                        <FormControl required variant="outlined" className="width-stand-80" error={companyNameErr}>
                                            <InputLabel id="company-selector">{ Dic.text[appState.lanuage_index].Project.select_company }</InputLabel>
                                            <Select
                                                labelId="company-selector-label"
                                                id="company-selector"
                                                value={formValues.user_company}
                                                onChange={(e)=>{setCompanyValue(e)}}
                                                // labelWidth={labelWidth}
                                            >
                                                {
                                                    companyList.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id} name={item.name}>{item.name}</MenuItem>;
                                                    })
                                                }
                                            </Select>
                                            { companyNameErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Project.select_company_err_text }</FormHelperText> : ''}
                                        </FormControl>
                                        <div className="block-30"></div>
                                        <FormControl required disabled={disabledDivSelector} variant="outlined" className="width-stand-80" error={divisionNameErr}>
                                            <InputLabel id="division-selector">
                                            { Dic.text[appState.lanuage_index].Project.select_division }
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
                                            { divisionNameErr ? <FormHelperText>{ Dic.text[appState.lanuage_index].Project.select_division_err_text }</FormHelperText> : ''}
                                        </FormControl>
                                    </div>
                                : '' }
                                <div className="block-20"></div>
                                <TextField type="text" 
                                    error={ errors } 
                                    className='project-input'
                                    name="project_name" label={ Dic.text[appState.lanuage_index].Project.project_name }
                                    onChange={ updateProjectInfo } 
                                    helperText={ errors ? errorText : '' }
                                />
                                <div className="btn-area">
                                    <Button color="primary" onClick={ createProjectSubmit }>{ Dic.text[appState.lanuage_index].common.create }</Button>
                                    <Button color="secondary" onClick={ closePopup }>{ Dic.text[appState.lanuage_index].common.cancel }</Button>
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