import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../Util/Store';
import { useCookies } from 'react-cookie';
import Header from '../../Components/Header/Header';
import Loading from '../../Components/Loading/Loading';
import { GetMyTaskListRequest } from '../MyTaskList/MyTaskListService';
import Dic from '../../assets/dic/dictionary.json';
import Table from '../../Components/Table/Table';
import RefreshIcon from '@material-ui/icons/Refresh';
import MoreIcon from '@material-ui/icons/More';
import { useHistory } from "react-router-dom";

import './TaskHaveWorked.scss';

export default function TaskHavWorked(){
    const { appState } = useContext(AppContext);
    const [showLoading, setShowLoading] = useState(false);
    const [cookies] = useCookies();
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    const [tableData, setTableData] = useState({});
    const history = useHistory();

    const taskDetail = (rowData) => {
        history.push(`/task/details/${rowData.id}`);
    }

    const getMyTaskList = async () => {
        setShowLoading(true);
        setTableData({
            tableName: Dic.text[appState.lanuage_index].Task.table.my_task_list,
            actions: [
                {
                    icon: RefreshIcon,
                    tooltip: Dic.text[appState.lanuage_index].Users.user_list_tab.table.action_tooltip,
                    isFreeAction: true,
                    onClick: (e) => getMyTaskList(),//reloadTable(e),
                },
                rowData => ({
                    icon: MoreIcon,
                    tooltip: Dic.text[appState.lanuage_index].Project.table.action_tooltip,
                    onClick: (event, rowData) => {
                        taskDetail(rowData);
                    },
                })
            ],
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
                { title: Dic.text[appState.lanuage_index].Task.table.column.date_created, field: 'date_created', sorting: true, render: rowData => {
                    let res = rowData.date_created.split('.')[0];
                    res = res.replace(/T/, ' ');
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
        await GetMyTaskListRequest(cookies.user_token, true).then((results)=>{
            setShowLoading(false);
            setTableData( tableData => ({
                ...tableData, 
                data: results.result
                })
            );
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    };
    useEffect(() => {
        let mounted = true;
        
        if (mounted){
            getMyTaskList();
        }
        
        return () => {
            mounted = false;
        };
    }, [appState.lanuage_index]);

    return (
        <div id="have-worked-page" className="page-content">
            {showLoading ? <Loading /> : '' }
            <Header showLogo={false} showIcons={true} />
            <div className="page-content-container">
                <div className="page-content-main">
                    <Table tableData={tableData} pageSize='10'/>
                </div>
            </div>
        </div>
    );
}
