import React, {useState, useEffect, useContext} from 'react';
import Divider from "@material-ui/core/Divider";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsIcon from '@material-ui/icons/Settings';
import AdjustIcon from '@material-ui/icons/Adjust';
import Fade from '@material-ui/core/Fade';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import BallotIcon from '@material-ui/icons/Ballot';
import DescriptionIcon from '@material-ui/icons/Description';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import ListAltIcon from '@material-ui/icons/ListAlt';
import BusinessIcon from '@material-ui/icons/Business';
import { useHistory } from "react-router-dom";
import { AppContext } from '../../../Util/Store';

const NavItem = (props) => {
    
    const { appState } = useContext(AppContext);
    const [collapsed, setCollapsed] = useState(false);
    const { label_en_US, label_zh_CN, items, icon } = props.item;
     
    function toggleCollapse() {
        setCollapsed(prevValue => !prevValue);
    }
    
    let expandIcon;

    if (Array.isArray(items) && items.length) {
        expandIcon = !collapsed ? (
            <ExpandLess className="expandless" />
        ) : (
            <ExpandMore className="expandmore" />
        );
    }
    
    useEffect(() => {
        // console.log('on init');
        // console.log('NavItem props is: ', props);
        // console.log('NavItem props.item: ', props.item);
    }, []);

    return (
        <>
            <ListItem
                button
                onClick={ (e) => {
                    items && items.length ? toggleCollapse() : props.callBack(props.item);
                }}
                selected = { props.activeName === label_en_US ? true : false }
            >
                <ListItemIcon>
                    <Tooltip 
                    title={
                        label_en_US ? appState.lanuage_index === 0 ? `${label_en_US}` : `${label_zh_CN}` : ''
                    }
                    arrow TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                    {(() => {
                        switch (icon) {
                            case "DashboardIcon": return <DashboardIcon />;
                            case "AssessmentIcon": return <AssessmentIcon />;
                            case "AssignmentIcon": return <AssignmentIcon />;
                            case "DescriptionIcon": return <DescriptionIcon />;
                            case "BallotIcon": return <BallotIcon />;
                            case "SettingsIcon": return <SettingsIcon />;
                            case "PersonAddIcon": return <PersonAddIcon />;
                            case "VpnKeyIcon": return <VpnKeyIcon />;
                            case "SupervisorAccountIcon": return <SupervisorAccountIcon />;
                            case "AssignmentTurnedInIcon": return <AssignmentTurnedInIcon />;
                            case "QueryBuilderIcon": return <QueryBuilderIcon />;
                            case "ListAltIcon": return <ListAltIcon />;
                            case "BusinessIcon": return <BusinessIcon />;
                            default: return <AdjustIcon />;
                        }
                    })()}
                    </Tooltip>
                </ListItemIcon>
                <ListItemText primary={ appState.lanuage_index === 0 ? label_en_US : label_zh_CN }/>
                <span className="has-sub-item-icon">{expandIcon}</span>
            </ListItem>
            <Collapse 
                in={!collapsed} 
                // in = { props.parentName === props.item.label_en_US ? (!collapsed) : '' }
                timeout="auto" 
                unmountOnExit
            >
                {Array.isArray(items) ? (
                <List disablePadding className="sub-nav">
                    {items.map((subItem, index) => (
                    <React.Fragment key={`${subItem.label_en_US}${index}`}>
                        {subItem === "divider" ? (
                        <Divider style={{ margin: "6px 0" }} />
                        ) : (
                        <NavItem
                            item={subItem} 
                            callBack={props.callBack} 
                            activeName={props.activeName} 
                            parentName={props.parentName}
                        />
                        )}
                    </React.Fragment>
                    ))}
                </List>
                ) : null}
            </Collapse>
        </>
    )
}

export default function Nav(props){

    const { appState } = useContext(AppContext);
    const [state, setState] = useState({activeName: '', parentName: ''});
    const pathName = window.location.hash.split('#')[1];
    const history = useHistory();

    const getCurrentLeftNavItem = (nav) => {
        nav.forEach(element => {
            if (element.path !== '' && element.path === pathName){
                setState({activeName: element.label_en_US});
            } else if (element.path === '' && element.items && element.items.length > 0){
                getCurrentLeftNavItem(element.items);
            }
        });
    }
    
    useEffect(()=>{
        getCurrentLeftNavItem(appState.left_nav);
    }, [props, appState.lanuage_index]);

    const parentCallBack = (i) => {
        setState({activeName: i.label_en_US});
        if (i.path){
            history.push({
                pathname: i.path,
                // search: '?query=abc',
                // state: { detail: menu.data }
            });
        }
    }

    return (
        <List className="nav-items">
            
            {props.items && props.items.map( (item, index) => (
                
                <React.Fragment key={`${item.label_en_US}${index}`}>
                    {item === "divider" ? (
                        <Divider style={{ margin: "6px 0" }} />
                        ) : (
                        <NavItem
                        item={item}
                        callBack={parentCallBack}
                        activeName={state.activeName}
                        parentName={state.parentName}
                        />
                    )}
                </React.Fragment>
            ))}


        </List>
    )
}