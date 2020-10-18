import React, {useState, useEffect, useContext} from 'react';
import './Header.scss';
import Modal from '@material-ui/core/Modal';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import TranslateIcon from '@material-ui/icons/Translate';
import Dic from '../../assets/dic/dictionary.json';
import { AppContext } from '../../Util/Store';

function Header (props){
    const { showLogo, showIcons } = props;
    const [showHideItems, setShowHideItems] = useState({
        show_hide_lang: null,
        show_hide_notify: null,
        show_hide_my_setting: null
    });
    const history = useHistory();
    const cookies = new Cookies();
    const [ langList, setLangList ] = useState([]);
    const { appState, setAppState } = useContext(AppContext);
    
    const openNotify = (e) =>{
        let checked = e.currentTarget;
        setShowHideItems(showHideItems  => ({...showHideItems, show_hide_notify: checked}));
    }
    const closeNotify = ()=>{
        setShowHideItems(showHideItems  => ({...showHideItems, show_hide_notify: null}));
    }
    const openMySetting = (e) =>{
        let checked = e.currentTarget;
        setShowHideItems(showHideItems  => ({...showHideItems, show_hide_my_setting: checked}));
    }
    const closeMySetting = ()=>{
        setShowHideItems(showHideItems  => ({...showHideItems, show_hide_my_setting: null}));
    }
    const myProfile = () => {
        closeMySetting();
        history.push("/profile");
    }
    const openLang = (e) => {
        let checked = e.currentTarget;
        setShowHideItems(showHideItems  => ({...showHideItems, show_hide_lang: checked}));
    }
    const closeLang = () => {
        setShowHideItems(showHideItems  => ({...showHideItems, show_hide_lang: null}));
    }
    const Logout = ()=>{
        cookies.remove('user_token');
        localStorage.removeItem('user_info');
        history.push("/login");
    }
    
    const changeLanguage = (lang_id) => {
        if (appState.lang_id !== lang_id){
            setAppState({
                lanuage_index: lang_id
            });
        }
        // history.push(window.location.hash.split('#')[1]);
        closeLang();
    }

    useEffect(() => {
        let langArr = [];
        Dic.text.forEach((element, id) => {
            langArr.push({
                "lang": element.language,
                "name": element.l_name
            })
        });
        setLangList(langArr);
    }, []);

    return (
        <nav className="app-header">
            {showLogo ? 
                <div className="defautl-header">
                    <h2><FingerprintIcon className="logo-icon"/>项目流程一体化 - Process Ops</h2> 
                    <div className="default-header-icon">
                        <TranslateIcon onClick={openLang} />
                        <Menu
                            className="my-lang-menu"
                            anchorEl={showHideItems.show_hide_lang}
                            keepMounted
                            open={Boolean(showHideItems.show_hide_lang)}
                            onClose={closeLang}
                        >
                            {
                                langList.map((item, index) => (
                                    <MenuItem key={index} selected={ appState.lanuage_index === index ? true : false} onClick={ () => {changeLanguage(index)}}>{item.name}</MenuItem>
                                ))
                            }
                        </Menu>
                    </div>
                </div>
            : '' } 
            {showIcons ? 
            <div className="header-icons">
                <TranslateIcon onClick={openLang} />
                <Menu
                    className="my-lang-menu"
                    anchorEl={showHideItems.show_hide_lang}
                    keepMounted
                    open={Boolean(showHideItems.show_hide_lang)}
                    onClose={closeLang}
                >
                    {
                        langList.map((item, index) => (
                            <MenuItem key={index} selected={ appState.lanuage_index === index ? true : false} onClick={ (e) => {changeLanguage(index)}}>{item.name}</MenuItem>
                        ))
                    }
                </Menu>
                <span className="notify-icon">
                    <NotificationsIcon onClick={openNotify}/><span className="notify-number">5</span>
                    <Menu
                        className="notify-menu"
                        anchorEl={showHideItems.show_hide_notify}
                        keepMounted
                        open={Boolean(showHideItems.show_hide_notify)}
                        onClose={closeNotify}
                    >
                        <MenuItem><ArrowRightIcon />Mike John responded to your email</MenuItem>
                        <MenuItem><ArrowRightIcon />You have 5 new tasks</MenuItem>
                        <MenuItem><ArrowRightIcon />Your task just got rejected from QA</MenuItem>
                    </Menu>
                </span> 
                <PersonIcon onClick={openMySetting}/>
                <Menu
                    className="my-setting-menu"
                    anchorEl={showHideItems.show_hide_my_setting}
                    keepMounted
                    open={Boolean(showHideItems.show_hide_my_setting)}
                    onClose={closeMySetting}
                >
                    <MenuItem onClick={myProfile}>{ Dic.text[appState.lanuage_index].common.my_profile }</MenuItem>
                    <MenuItem onClick={Logout}>{ Dic.text[appState.lanuage_index].common.logout }</MenuItem>
                </Menu>
            </div>
            : ''}
        </nav>
    );
}

export default Header;