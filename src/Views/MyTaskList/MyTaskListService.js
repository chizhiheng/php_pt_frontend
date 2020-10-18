import axios from 'axios';
import {
    Host,
    GetMyTaskListURI
} from '../../Config/Config';

export const GetMyTaskListRequest = async (token, isWorkedPage) => {
    const url = Host + GetMyTaskListURI;
    const params = {
        "token": token,
        "isWorkedPage": isWorkedPage
    };
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }
    return await axios.post(url,params,headers).then(function (response) {
        return response.data;
    }).catch(function (error) {
        return error;
    }).finally(function () {
        // always executed
    });
};