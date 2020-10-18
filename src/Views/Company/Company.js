import React, {useState, useEffect, useContext} from 'react';
import Header from '../../Components/Header/Header';
import Loading from '../../Components/Loading/Loading';
// import { useParams } from "react-router-dom";
import './Company.scss';
import Table from '../../Components/Table/Table'
import { 
    GetAllCompanyRequest, 
    CreateCompanyRequest, 
    UpdateCompanyRequest, 
    DeleteCompanyRequest,
    CreateDivisionRequest,
    UpdateDivisionRequest,
    DeleteDivisionRequest
} from './CompanyService';
import { useCookies } from 'react-cookie';
import AddBox from '@material-ui/icons/AddBox';
import RefreshIcon from '@material-ui/icons/Refresh';
import {
    Fade,
    TextField,
    Button,
    Modal
} from '@material-ui/core/';
import Dialog from '../../Components/Dialog/Dialog';
import { AppContext } from '../../Util/Store';
import Dic from '../../assets/dic/dictionary.json';

export default function Company(){
    const { appState } = useContext(AppContext);
    const [showLoading, setShowLoading] = useState(false);
    // const params = useParams();
    const [cookies] = useCookies();
    const [tableData, setTableData] = useState({});
    
    const [companyInfo, setCompanyInfo] = useState({
        c_id: '',
        c_name: ''
    });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [placement, setPlacement] = useState();
    const [errors, setErrors] = useState(false);
    const [division, setDivision] = useState({
        div_name: '',
        div_desc: ''
    });
    const [dialogDetail, setDialogDetail] = useState({
        title: '',
        content: '',
        has_ok: false,
        ok_text: Dic.text[appState.lanuage_index].common.ok,
        ok_callback: ()=>{
            console.log('clicked OK.');
        },
        cancel_text: Dic.text[appState.lanuage_index].common.cancel,
        cancel_callback: ()=>{
            setDialogDetail(dialogDetail => ({...dialogDetail, open: false}));
        },
        open: false
    });
    const handleClick = (newPlacement, event, c_id, c_name) => {
        setAnchorEl(event.currentTarget);
        setOpen(prev => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
        setCompanyInfo({
            c_id: c_id, 
            c_name: c_name
        });
    };
    const closePopup = ()=>{
        setOpen(!open);
        setErrors(false);
    }
    const updateDivInfo = (e)=>{
        if (e.target.name === "div_name"){
            setDivision(division  => ({...division, div_name: e.target.value}));
        } else {
            setDivision(division  => ({...division, div_desc: e.target.value}));
        }
    }
    const createDiv = async ()=>{
        if (division.div_name.trim().length === 0){
            setErrors(true);
            return;
        } else {
            setErrors(false);
        }
        setShowLoading(true);
        await CreateDivisionRequest(cookies.user_token, companyInfo.c_id, division.div_name, division.div_desc).then((results)=>{
            if (results.code === 200){
                setOpen(!open);
                setShowLoading(false);
                getCompanyList();
            } else {
                setShowLoading(false);
                console.log('can not get response');
            }
        });
    }
    
    async function getCompanyList(mounted){
        setShowLoading(true);
        await GetAllCompanyRequest(cookies.user_token).then((results)=>{
            if (results.code === 200){
                setShowLoading(false);
                setTableData({
                    tableName: Dic.text[appState.lanuage_index].Company.table.table_name,
                    actions: [
                        rowData => ({
                            icon: AddBox,
                            tooltip: Dic.text[appState.lanuage_index].Company.table.add_division,
                            hidden: rowData.p_id !== 0,
                            onClick: (event, rowData) => {
                                handleClick('left', event, rowData.id, rowData.name);
                                // alert("You are going to create a new Division for Company: " + rowData.name)
                            }
                        }),
                        {
                            icon: RefreshIcon,
                            tooltip: Dic.text[appState.lanuage_index].Company.table.action_tooltip,
                            isFreeAction: true,
                            onClick: (e) => getCompanyList(),//reloadTable(e),
                        }
                    ],
                    columns: [
                        { title: Dic.text[appState.lanuage_index].Company.table.column.name, field: 'name', draggable: false, initialEditValue: Dic.text[appState.lanuage_index].Company.company_name },
                        { title: Dic.text[appState.lanuage_index].Company.table.column.description, field: 'desc', sorting: false, draggable: false, initialEditValue: Dic.text[appState.lanuage_index].Company.company_description },
                        { title: Dic.text[appState.lanuage_index].Company.table.column.type, field: 'type', sorting: false, draggable: false, editable: 'never' },
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
                        rowStyle: rowData => ({
                            backgroundColor: (rowData.type === 'Division') ? '#cfd8dc' : '#FFF'
                        }),
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
                    parentChildData: true,
                    editable: {
                        onRowAdd: newData => 
                        new Promise((resolve, reject) => {
                            if (newData.name.trim().length === 0){
                                reject();
                                return;
                            }
                            CreateCompanyRequest(cookies.user_token, newData.name, newData.desc).then((results)=>{
                                GetAllCompanyRequest(cookies.user_token).then((results)=>{
                                    resolve(setTableData(tableData  => ({...tableData, data: results.result})));
                                }).catch((error) => {
                                    return error;
                                });
                            }).catch((error) => {
                                return error;
                            });
                        }),
                        onRowUpdate: (newData, oldData) => 
                        new Promise((resolve, reject) => {
                            if (newData.name.trim().length === 0){
                                return;
                            }
                            if (newData.type === 'Division'){
                                UpdateDivisionRequest(cookies.user_token, newData.id, newData.name, newData.desc).then((results)=>{
                                    GetAllCompanyRequest(cookies.user_token).then((results)=>{
                                        resolve(setTableData(tableData  => ({...tableData, data: results.result})));
                                    }).catch((error) => {
                                        return error;
                                    });
                                }).catch((error) => {
                                    return error;
                                });
                            } else {
                                UpdateCompanyRequest(cookies.user_token, newData.name, newData.desc, newData.id).then((results)=>{
                                    GetAllCompanyRequest(cookies.user_token).then((results)=>{
                                        resolve(setTableData(tableData  => ({...tableData, data: results.result})));
                                    }).catch((error) => {
                                        return error;
                                    });
                                }).catch((error) => {
                                    return error;
                                });
                            }
                        }),
                        onRowDelete: oldData => 
                        new Promise((resolve, reject) => {
                            if (oldData.type === 'Division'){
                                DeleteDivisionRequest(cookies.user_token, oldData.id).then((results)=>{
                                    if (results.code === 202){
                                        setDialogDetail(dialogDetail => ({
                                            ...dialogDetail, 
                                            open: true, 
                                            title: Dic.text[appState.lanuage_index].common.opps, 
                                            content: Dic.text[appState.lanuage_index].common.delete_user_first, 
                                            has_ok: false
                                        }));
                                        resolve();
                                    } else {
                                        GetAllCompanyRequest(cookies.user_token).then((results)=>{
                                            resolve(setTableData(tableData  => ({...tableData, data: results.result})));
                                        }).catch((error) => {
                                            return error;
                                        });
                                    }
                                }).catch((error) => {
                                    return error;
                                });
                            } else {
                                DeleteCompanyRequest(cookies.user_token, oldData.id).then((results)=>{
                                    if (results.code === 202){
                                        setDialogDetail(dialogDetail => ({
                                            ...dialogDetail, 
                                            open: true, 
                                            title: Dic.text[appState.lanuage_index].common.opps, 
                                            content: Dic.text[appState.lanuage_index].common.delete_division_first, 
                                            has_ok: false
                                        }));
                                        resolve();
                                    } else {
                                        GetAllCompanyRequest(cookies.user_token).then((results)=>{
                                            resolve(setTableData(tableData  => ({...tableData, data: results.result})));
                                        }).catch((error) => {
                                            return error;
                                        });
                                    }
                                }).catch((error) => {
                                    return error;
                                });
                            }
                        }),
                    }
                });
            } else if (results.code === 403){
                setShowLoading(false);
                console.log('can not get response');
                window.location.href = '/login';
            }
            
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }

    useEffect(()=>{
        let mounted = true;

        if (mounted){
            getCompanyList();
        }
        return () => {
            mounted = false;
        };
    }, [appState.lanuage_index]);

    return (
        <div id="company-page" className="page-content">
            {showLoading ? <Loading /> : '' }
            <Header showLogo={false} showIcons={true} />
            <div className="page-content-container">
                <div className="page-content-main">
                    <Dialog details={dialogDetail}/>
                    <Modal open={open} id="modal-element">
                    <Fade in={open}>
                        <div className="modal-content add-division-tooltip-container">
                            <h3>{ Dic.text[appState.lanuage_index].Company.create_division_title }</h3>
                            <h2>{companyInfo.c_name}</h2>
                            <div><TextField type="text" 
                                error={ errors } 
                                className='division-input'
                                name="div_name" label={ Dic.text[appState.lanuage_index].Company.division_name }
                                onChange={updateDivInfo} 
                                helperText={ errors ? Dic.text[appState.lanuage_index].Company.division_name_err_text : '' }
                            /></div>
                            <div><TextField type="text" 
                                // error={ errors.name_input } 
                                className='division-input'
                                name="div_desc" label={ Dic.text[appState.lanuage_index].Company.division_description }
                                onChange={updateDivInfo} 
                                // helperText={ errors.name_input ? 'Invalid account ID' : '' }
                            /></div>
                            <div className="btn-area">
                                <Button color="primary" onClick={createDiv}>{ Dic.text[appState.lanuage_index].common.create }</Button>
                                <Button color="secondary" onClick={closePopup}>{ Dic.text[appState.lanuage_index].common.cancel }</Button>
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