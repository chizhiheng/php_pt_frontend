import React, {useState, useEffect} from 'react';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import './Table.scss';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import RefreshIcon from '@material-ui/icons/Refresh';

export default function MaterialTableDemo(props) {
  const [state, setState] = useState({});

  useEffect(()=>{
    setState(props.tableData);
  },[props, state]);
  // const [state, setState] = useState({
  //   actions: [
  //     rowData => ({
  //       icon: AddBox,
  //       tooltip: 'Add Division',
  //       hidden: rowData.hidden,
  //       onClick: (event, rowData) => alert("You want to delete " + rowData.name),
  //     })
  //   ],
  //   columns: [
  //     { title: 'ID', field: 'c_id' },
  //     { title: 'Name', field: 'c_name' },
  //     { title: 'Descrption', field: 'c_desc', sorting: false },
  //     { title: 'Type', field: 'type', removable: false },
  //   ],
  //   data: [
  //     {
  //       id: 1,
  //       c_id: 1,
  //       c_name: 'a',
  //       c_desc: 'Baran',
  //       type: 'Company',
  //       parentId: 0,
  //       hidden: false,
  //     },
  //     {
  //       id: 2,
  //       c_id: 2,
  //       c_name: 'b',
  //       c_desc: 'Baran',
  //       type: 'Division',
  //       parentId: 1,
  //       hidden: true,
  //     },
  //     {
  //       id: 3,
  //       c_id: 3,
  //       c_name: 'c',
  //       c_desc: 'Baran',
  //       type: 'Division',
  //       parentId: 1,
  //       hidden: true,
  //     },
  //     {
  //       id: 4,
  //       c_id: 4,
  //       c_name: 'd',
  //       c_desc: 'Baran',
  //       type: 'Division',
  //       parentId: 1,
  //       hidden: true,
  //     },
  //     {
  //       id: 5,
  //       c_id: 5,
  //       c_name: 'e',
  //       c_desc: 'Baran',
  //       type: 'Company',
  //       parentId: 0,
  //       hidden: false,
  //     },
  //     {
  //       id: 6,
  //       c_id: 6,
  //       c_name: 'f',
  //       c_desc: 'Baran',
  //       type: 'Division',
  //       parentId: 5,
  //       hidden: true,
  //     },
  //   ],
  // });

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    Refresh: forwardRef((props, ref) => <RefreshIcon {...props} ref={ref} />),
  };
  return (
    <MaterialTable
      tableRef={props.tableRef}
      icons={tableIcons}
      options={{...state.options, pageSize: props.pageSize*1}}
      title={state.tableName}
      columns={state.columns}
      data={state.data}
      actions={state.actions}
      localization={state.localization}
      
      parentChildData={(row, rows) => {
        return  !state.parentChildData ?  rows.find(a => a.id === row.p_id) : null;
      }}
      editable={{...state.editable}}
    />
  );
}
