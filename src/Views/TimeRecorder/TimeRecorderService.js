import axios from 'axios';
import {
    Host, 
    getUserWorkingDataURI
} from '../../Config/Config';

export const GetTaskDetailRequest = async (token, date) => {
    const url = Host + getUserWorkingDataURI;
    const params = {
        "token": token,
        "date": date,
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