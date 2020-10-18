import React, {useState, useEffect, useContext} from 'react';
import Header from '../../Components/Header/Header';
import Loading from '../../Components/Loading/Loading';
import Table from '../../Components/Table/Table';
import { useCookies } from 'react-cookie';
import { 
    GetCompanyByIdRequest,
    UpdateCompanyRequest,
    CreateDivisionRequest,
    UpdateDivisionRequest,
    DeleteDivisionRequest
} from './CompanyService';
import AddBox from '@material-ui/icons/AddBox';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import {TextField, Button} from '@material-ui/core/';
import { AppContext } from '../../Util/Store';
import Dialog from '../../Components/Dialog/Dialog';
import Dic from '../../assets/dic/dictionary.json';

export default function CompanyDetail(){
    const { appState } = useContext(AppContext);
    const [showLoading, setShowLoading] = useState(false);
    const [cookies] = useCookies();
    const [tableData, setTableData] = useState({});
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    const [dialogDetail, setDialogDetail] = useState({
        title: 'Loading',
        content: 'Loading',
        has_ok: true,
        ok_text: 'OK',
        ok_callback: ()=>{
            console.log('clicked OK.');
        },
        cancel_text: 'Close',
        cancel_callback: ()=>{
            setDialogDetail(dialogDetail => ({...dialogDetail, open: false}));
        },
        open: false
    });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [placement, setPlacement] = useState();
    const [errors, setErrors] = useState(false);
    const [companyInfo, setCompanyInfo] = useState({
        c_id: '',
        c_name: ''
    });
    const [division, setDivision] = useState({
        div_name: '',
        div_desc: ''
    });
    const updateDivInfo = (e)=>{
        if (e.target.name === "div_name"){
            setDivision(division  => ({...division, div_name: e.target.value}));
        } else {
            setDivision(division  => ({...division, div_desc: e.target.value}));
        }
    }
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
                getCompanyById();
            } else {
                setShowLoading(false);
                console.log('can not get response');
            }
        });
    }
    
    async function getCompanyById(){
        setShowLoading(true);
        
        await GetCompanyByIdRequest(cookies.user_token).then((results)=>{
            setShowLoading(false);
            const editable_res = {
                    onRowUpdate: (newData, oldData) => 
                    new Promise((resolve, reject) => {
                        if (newData.name.trim().length === 0){
                            return;
                        }
                        if (newData.type === 'Division'){
                            UpdateDivisionRequest(cookies.user_token, newData.id, newData.name, newData.desc).then((results)=>{
                                GetCompanyByIdRequest(cookies.user_token).then((results)=>{
                                    resolve(setTableData(tableData  => ({...tableData, data: results.result})));
                                    reject();
                                }).catch((error) => {
                                    return error;
                                });
                            }).catch((error) => {
                                return error;
                            });
                        } else {
                            UpdateCompanyRequest(cookies.user_token, newData.name, newData.desc, newData.id).then((results)=>{
                                GetCompanyByIdRequest(cookies.user_token).then((results)=>{
                                    resolve(setTableData(tableData  => ({...tableData, data: results.result})));
                                    reject();
                                }).catch((error) => {
                                    return error;
                                });
                            }).catch((error) => {
                                return error;
                            });
                        }
                    })    
            }
            const actions_res = [
                rowData => ({
                    icon: AddBox,
                    tooltip: Dic.text[appState.lanuage_index].Company.table.add_division,
                    hidden: rowData.p_id !== 0,
                    onClick: (event, rowData) => {
                        handleClick('left', event, rowData.id, rowData.name);
                        // alert("You are going to create a new Division for Company: " + rowData.name)
                    },
                }),
                rowData => ({
                    icon: DeleteOutline,
                    tooltip: Dic.text[appState.lanuage_index].common.remove,
                    hidden: rowData.p_id === 0,
                    onClick: (event, rowData) => {
                        DeleteDivisionRequest(cookies.user_token, rowData.id).then((results)=>{
                            if (results.code === 202){
                                setDialogDetail(dialogDetail => ({
                                    ...dialogDetail, 
                                    open: true, 
                                    title: Dic.text[appState.lanuage_index].common.opps, 
                                    content: Dic.text[appState.lanuage_index].common.delete_user_first, 
                                    has_ok: false
                                }));
                            } else {
                                GetCompanyByIdRequest(cookies.user_token).then((results)=>{
                                    setTableData(tableData  => ({...tableData, data: results.result}));
                                }).catch((error) => {
                                    return error;
                                });
                            }
                        }).catch((error) => {
                            return error;
                        });
                    }
                })
            ];
            setTableData({
                tableName: Dic.text[appState.lanuage_index].Company.table.table_name,
                columns: [
                    { title: Dic.text[appState.lanuage_index].Company.table.column.name, field: 'name', draggable: false },
                    { title: Dic.text[appState.lanuage_index].Company.table.column.description, field: 'desc', sorting: false, draggable: false },
                    { title: Dic.text[appState.lanuage_index].Company.table.column.type, field: 'type', sorting: false, draggable: false, editable: 'never' },
                ],
                data: results.result,
                options: {
                    // pageSize: 10,
                    defaultExpanded: true,
                    actionsColumnIndex: -1, 
                    draggable: false,
                    headerStyle: {
                        backgroundColor: '#607d8b',
                        color: '#FFF'
                    },
                    rowStyle: rowData => ({
                        backgroundColor: (rowData.type === 'Division') ? '#cfd8dc' : '#FFF'
                    }),
                    pageSizeOptions: [5, 10, 20],
                },
                localization: {
                    header: {
                        actions: Dic.text[appState.lanuage_index].common.actions,
                        editable: Dic.text[appState.lanuage_index].common.edit
                    },
                    body: {
                        emptyDataSourceMessage: Dic.text[appState.lanuage_index].common.empty_data,
                        editTooltip: Dic.text[appState.lanuage_index].common.edit,
                    }
                },
                parentChildData: true,
                editable: user_info.role_name === 'admin' || user_info.role_name === 'Manager' ? editable_res : {},
                actions: user_info.role_name === 'admin' || user_info.role_name === 'Manager' ? actions_res : []
            });
        }).catch((error) => {
            setShowLoading(true);
            return error;
        });
    }
    useEffect(()=>{
        let mounted = true;
        if (mounted){
            getCompanyById();
        }
        return () => {
            mounted = false;
        };
    }, [appState.lanuage_index]);
    return (
        <div id="company-details-page" className="page-content">
            {showLoading ? <Loading /> : '' }
            <Header showLogo={false} showIcons={true} />
            <div className="page-content-container">
                <div className="page-content-main">
                    {/* <div className="flex-content page-content-main-title">
                        <h3 className="width-stand-half without-bold">Company name: </h3>
                        <h3 className="width-stand-half without-bold">Company description: </h3>
                    </div> */}
                    <Dialog details={dialogDetail}/>
                    <Popper className="add-division-tooltip" open={open} anchorEl={anchorEl} placement={placement} transition>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <Paper className="add-division-tooltip-container">
                                    <h3>{Dic.text[appState.lanuage_index].Company.create_division_title}</h3>
                                    <h2>{companyInfo.c_name}</h2>
                                    <div><TextField type="text" 
                                        error={ errors } 
                                        className='division-input'
                                        name="div_name" label={Dic.text[appState.lanuage_index].Company.division_name}
                                        onChange={updateDivInfo} 
                                        helperText={ errors ? Dic.text[appState.lanuage_index].Company.division_name_err_text : '' }
                                    /></div>
                                    <div><TextField type="text" 
                                        // error={ errors.name_input } 
                                        className='division-input'
                                        name="div_desc" label={Dic.text[appState.lanuage_index].Company.division_description}
                                        onChange={updateDivInfo} 
                                        // helperText={ errors.name_input ? 'Invalid account ID' : '' }
                                    /></div>
                                    <div className="btn-area">
                                        <Button color="primary" onClick={createDiv}>{Dic.text[appState.lanuage_index].common.create}</Button>
                                        <Button color="secondary" onClick={closePopup}>{Dic.text[appState.lanuage_index].common.cancel}</Button>
                                    </div>
                                </Paper>
                            </Fade>
                        )}
                    </Popper>
                    <Table tableData={tableData} pageSize='5'/>
                </div>
            </div>
        </div>
    );
}