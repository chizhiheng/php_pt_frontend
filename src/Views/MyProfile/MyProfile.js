import React, {useEffect, useState, useContext} from 'react';
import './MyProfile.scss';
import { 
    GetUserInfoRequest,
    UpdateUserInfoRequest,
    UploadUserImageRequest
} from './MyProfileService';
import { AppContext } from '../../Util/Store';
import Header from '../../Components/Header/Header';
import Loading from '../../Components/Loading/Loading';
import { useCookies } from 'react-cookie';
import moment from 'moment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import PersonIcon from '@material-ui/icons/Person';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import BusinessIcon from '@material-ui/icons/Business';
import PhoneIcon from '@material-ui/icons/Phone';
import CakeIcon from '@material-ui/icons/Cake';
import ApartmentIcon from '@material-ui/icons/Apartment';
import UpdateIcon from '@material-ui/icons/Update';
import PublishIcon from '@material-ui/icons/Publish';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
  } from '@material-ui/pickers';
import {
    Divider,
    Button
} from '@material-ui/core/';
import Dic from '../../assets/dic/dictionary.json';

import DateFnsUtils from '@date-io/date-fns';
import enLocale from "date-fns/locale/en-US";
import zhLocale from "date-fns/locale/zh-CN";

export default function MyProfile() {
    const { appState } = useContext(AppContext);
    const [showLoading, setShowLoading] = useState(false);
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    const [phoneErr, setPhoneErr] = useState(false);
    const [cookies] = useCookies();

    const [userInfo, setUserInfo] = useState({});
    const [birthday, setBirthday] = useState('');

    const updateUserInfo = (e, flag) => {
        const val = e.currentTarget.textContent;
        setUserInfo((res) => {
            if (flag === 'nickname') {
                res.nickname = val;
            } else if (flag === 'address') {
                res.address = val;
            } else if (flag === 'phone') {
                res.phone = val;
            }
            return res;
        });
        e.persist();
    }
    const uploadImage = () => {
        console.log('upload image: ');
    }
    const saveUserInfo = async () => {
        setPhoneErr(false);
        if (userInfo.phone){
            const reg = /^([0-9]*)?$/;	
            if (!reg.test(userInfo.phone) || userInfo.phone.length < 8){
                setPhoneErr(true);
                return;
            }
        }        
        setShowLoading(true);
        await UpdateUserInfoRequest(cookies.user_token, userInfo).then(()=>{
            setShowLoading(false);
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }

    const getUserInfo = async () => {
        setShowLoading(true);
        await GetUserInfoRequest(cookies.user_token, user_info.email).then((results)=>{
            setUserInfo((res) => {
                res.user_id = results.result[0].user_id;
                res.nickname = results.result[0].user_nickname;
                res.birthday = results.result[0].birthday ? results.result[0].birthday : moment().format("YYYY-MM-DD");
                res.phone = results.result[0].phone;
                res.address = results.result[0].address;
                res.division_name = results.result[0].division_name;
                setBirthday(res.birthday);
                return res;
            });
            setShowLoading(false);
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
    }

    const updateBirthday = (date) => {
        setUserInfo((res) => {
            res.birthday = date;
            setBirthday(date);
            return res;
        });
    }

    useEffect(() => {
        let mounted = true;
        
        if (mounted){
            getUserInfo();
        }
        
        return () => {
            mounted = false;
        };
    }, [appState.lanuage_index]);

    return (
        <div id="profile-page" className="page-content">
            {showLoading ? <Loading /> : '' }
            <Header showLogo={false} showIcons={true} />
            <div className="page-content-container">
                <div className="page-content-main">
                    <div className="flex-content">
                        <div className="width-stand-35 text-align-center">
                            {/* <div className="profile-image"></div> */}
                            <AccountCircleIcon className="profile-image" />
                            <div><Button color="default" startIcon={<PublishIcon />} onClick={uploadImage}>{Dic.text[appState.lanuage_index].common.upload}</Button></div>
                        </div>
                        <div className="width-stand-65">
                            <div><PersonIcon className="text-link-icon" /><h2 onInput={(e) => {updateUserInfo(e, 'nickname')}} className="text-link-text" contentEditable={true} dangerouslySetInnerHTML={{__html: `${userInfo.nickname}`}}></h2></div>
                            <div><MailIcon className="text-link-icon" /><a className="text-link-text" href={`mailto:${user_info.email}`}>{user_info.email}</a></div>
                            <div><AssignmentIndIcon className="text-link-icon" /><p className="text-link-text">{user_info.role_name}</p></div>
                            <div><CakeIcon className="text-link-icon" />
                                <div className="text-link-text">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} className="data-picker" locale={appState.lanuage_index === 0 ? enLocale : zhLocale}>
                                        <KeyboardDatePicker
                                            value={birthday}
                                            onChange={date => {
                                                updateBirthday(date);
                                            }}
                                            format="yyyy/MM/dd"
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                            </div>
                            <div><PhoneIcon className="text-link-icon" /><p onInput={(e) => {updateUserInfo(e, 'phone')}} className={`text-link-text ${phoneErr ? 'error-border' : ''}`} contentEditable={true} dangerouslySetInnerHTML={{__html: `${userInfo.phone ? userInfo.phone : ''}`}}></p></div>
                            <div><ApartmentIcon className="text-link-icon" /><p onInput={(e) => {updateUserInfo(e, 'address')}} className="text-link-text" contentEditable={true} dangerouslySetInnerHTML={{__html: `${userInfo.address ? userInfo.address : ''}`}}></p></div>
                            <Divider />
                            {user_info.role_name === 'Leader' || user_info.role_name === 'Member' ? <div><GraphicEqIcon className="text-link-icon" /><p className="text-link-text">{userInfo.division_name}</p></div> : '' }
                            <div><BusinessIcon className="text-link-icon" /><p className="text-link-text">{user_info.company_name}</p></div>
                            <div className="text-align-right"><Button color="primary" startIcon={<UpdateIcon />} onClick={saveUserInfo}>{Dic.text[appState.lanuage_index].common.update}</Button></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}