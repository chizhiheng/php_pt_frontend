import React from 'react';
import Header from '../../Components/Header/Header';
import { useCookies } from 'react-cookie';

export default function Error(){
    const [cookies, setCookie] = useCookies();

    return (
        <div id="error-page" className="page-content">
            <Header showLogo={ cookies.user_token ? false : true }  showIcons={ cookies.user_token ? true : false }/>
            <div className="page-content-container">
                <div className="page-content-main">
                    404 error
                </div>
            </div>
        </div>
    );
}