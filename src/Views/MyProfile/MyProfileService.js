import axios from 'axios';
import {
    Host, 
    UpdateUserInfoURI,
    UploadUserImageURI,
    GetByEmail
} from '../../Config/Config';

export const GetUserInfoRequest = async (token, email) => {
    const url = Host + GetByEmail;
    const params = {
        "token": token,
        "email": email
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
}

export const UpdateUserInfoRequest = async (token, details) => {
    const url = Host + UpdateUserInfoURI;
    const params = {
        "token": token,
        details: details
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
}

export const UploadUserImageRequest = async (token, image) => {
    const url = Host + UploadUserImageURI;
    const params = {
        "token": token
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
}