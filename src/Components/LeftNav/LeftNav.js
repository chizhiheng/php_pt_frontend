import React, {useState, useContext}from 'react';
import './LeftNav.scss'
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import Nav from './Nav/Nav'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@material-ui/core/IconButton';
import Dic from '../../assets/dic/dictionary.json';
import { AppContext } from '../../Util/Store';

export default function LeftNav(props){
    const { appState } = useContext(AppContext);
    const [navOpen, setNavOpen] = useState({
        display_hide_button: true,
        show_nav: true
    });
    
    const navShowHide = () => {
        setNavOpen(navOpen => ({...navOpen, display_hide_button: !navOpen.display_hide_button, show_nav: !navOpen.show_nav}));
    }

    return(
        <div className={`left-nav ${navOpen.show_nav ? 'isActive' : 'inActive'}`}>
            <div className="left-nav-container">
                <div className="nav-title">
                    <FingerprintIcon className="logo-icon"/>
                    <h3 className="sys-name">{Dic.text[appState.lanuage_index].site.name}</h3>
                    <span className="nav-control">
                        <IconButton aria-label="upload picture" component="span" onClick={navShowHide}>
                            {navOpen.display_hide_button ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                        </IconButton>
                    </span>
                </div>
                <div className="nav-list">
                    <Nav items={props.items}/>
                </div>
            </div>
            <div className="laf-nav-bg-img"></div>
        </div>
    );
}