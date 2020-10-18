import React, {useState, useEffect, useContext} from 'react';
import './Login.scss'
import Header from '../../Components/Header/Header';
import {TextField, Button} from '@material-ui/core/';
import LockIcon from '@material-ui/icons/Lock';
import { UserLogin } from './LoginService';
import Loading from '../../Components/Loading/Loading';
import { useCookies } from 'react-cookie';
// import Cookie from 'universal-cookie';
import { AppContext } from '../../Util/Store';
import Dic from '../../assets/dic/dictionary.json';

export default function Login (props){
    const { appState, setAppState } = useContext(AppContext);
    const [cookies, setCookie] = useCookies();
    const [userInfo, setUserInfo] = useState({
        user_name: '',
        user_pwd: '',
        id: '',
        nickname: '',
        email: '',
        is_active: '',
        role_id: '',
        role_name: '',
        role_active: '',
        company_name: ''
    });
    const [errors, setErrors] = useState({
        name_input: false,
        pwd_input: false
    });
    const [showLoading, setShowLoading] = useState(false);
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    
    const updateUserInfo = (e) => {
        if (e.target.name === "username"){
            setUserInfo(userInfo  => ({...userInfo, user_name: e.target.value}));
        } else {
            setUserInfo(userInfo  => ({...userInfo, user_pwd: e.target.value}));
        }
        e.persist();
    }

    const validation = async() => {
        let emreg=/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/;
        if(emreg.test(userInfo.user_name) === false || userInfo.user_name === ''){
            setErrors(errors => ({...errors, name_input: true}));
            return false;
        } else {
            setErrors(errors => ({...errors, name_input: false}));
        }

        if(userInfo.user_pwd === '' || userInfo.user_pwd.length < 6){
            setErrors(errors => ({...errors, pwd_input: true}));
            return false;
        } else {
            setErrors(errors => ({...errors, pwd_input: false}));
        }
        setShowLoading(true);
        await UserLogin(userInfo).then((results)=>{
            if (results.code === 200){
                if (results.result){
                    setShowLoading(false);
                    setCookie('user_token', results.token, { path: '/' });
                    setUserInfo(userInfo  => ({...userInfo, ...results.result}));
                    const user_info_res = {
                        id: results.result.user_id,
                        name: results.result.user_name,
                        nickname: results.result.user_nickname,
                        email: results.result.user_email,
                        is_active: results.result.is_active,
                        role_id: results.result.role_id,
                        role_name: results.result.role_name,
                        role_active: results.result.role_active,
                        company_id: results.result.company_id,
                        company_name: results.result.company_name,
                        company_desc: results.result.company_desc,
                        division_name: results.result.division_name,
                        division_id: results.result.division_id,
                        phone: results.result.phone,
                        birthday: results.result.birthday,
                        address: results.result.address,
                        image: results.result.image
                    }
                    localStorage.setItem('user_info', JSON.stringify(user_info_res));
                    props.history.push('/home');
                } else {
                    setShowLoading(false);
                    setErrors(errors => ({...errors, name_input: true}));
                    setErrors(errors => ({...errors, pwd_input: true}));
                }
            } else {
                setShowLoading(false);
                setErrors(errors => ({...errors, name_input: true}));
                setErrors(errors => ({...errors, pwd_input: true}));
                console.log('can not get response');
            }
        }).catch((error) => {
            setShowLoading(false);
            return error;
        });
        
        // props.history.push({
        //     pathname: '/home',
        //     // search: '?query=abc',
        //     // state: { detail: menu.data }
        // });
    }

    return (
        <div id="login-page">
            {showLoading ? <Loading /> : '' }
            <Header showLogo={true}/>
            <div className="login-dialog">
            
                <div className="login-title">
                <h1 className="text-align-center"><LockIcon />{ Dic.text[appState.lanuage_index].Login.title }</h1>
                </div>
                <div className="login-content text-align-center">
                
                    <TextField type="email" 
                        // error={ errNameInput } 
                        error={ errors.name_input } 
                        className='signin'
                        name="username" label={ Dic.text[appState.lanuage_index].Login.user_name_label }
                        onChange={updateUserInfo} 
                        helperText={ errors.name_input ? Dic.text[appState.lanuage_index].Login.user_name_incorrect_label : '' }
                    />
                    <TextField 
                        type="password" 
                        error={ errors.pwd_input } 
                        // error={ errPwdInput }
                        className="signin" name="password" label={ Dic.text[appState.lanuage_index].Login.password_label }
                        onChange={updateUserInfo}
                        helperText={ errors.pwd_input ? Dic.text[appState.lanuage_index].Login.password_incorrect_label : '' }
                    />
                    
                    <p className="note-text">{ Dic.text[appState.lanuage_index].Login.description }</p>
                    <Button variant="contained" color="primary" onClick={validation}>{ Dic.text[appState.lanuage_index].Login.sign_in }</Button>
                
                </div>
            </div>
        </div>
    );
}
