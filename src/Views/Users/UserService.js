import axios from 'axios';
import '../../Config/Config'
import {
    Host, 
    GetUserRoleURI,
    CreateUserURI,
    checkEmailExistedURI,
    getUserListURI,
    deleteUserURI,
    updateUserURI
} from '../../Config/Config';

export const GetUserRoleRequest = async (token) => {
    let url = Host + GetUserRoleURI;
    let params = {
        "token": token
    };
    let headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }
    let res = await axios.post(url,params,headers)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        })
        .finally(function () {
        // always executed
        });  
    return res;
}

export const CreateUserRequest = async (token, details) => {
    let url = Host + CreateUserURI;
    let params = {
        "token": token,
        "details": details
    };
    let headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }
    let res = await axios.post(url,params,headers)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        })
        .finally(function () {
        // always executed
        });  
    return res;
}

export const checkEmailExistedRequest = async (token, email) => {
    let url = Host + checkEmailExistedURI;
    let params = {
        "token": token,
        "email": email
    };
    let headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }
    let res = await axios.post(url,params,headers)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        })
        .finally(function () {
        // always executed
        });  
    return res;
}

export const getUserListRequest = async (token) => {
    let url = Host + getUserListURI;
    let params = {
        "token": token
    };
    let headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }
    let res = await axios.post(url,params,headers)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        })
        .finally(function () {
        // always executed
        });  
    return res;
}

export const deleteUserRequest = async (token, id) => {
    let url = Host + deleteUserURI;
    let params = {
        "token": token,
        "user_id": id
    };
    let headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }
    let res = await axios.post(url,params,headers)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        })
        .finally(function () {
        // always executed
        });  
    return res;
}

export const updateUserRequest = async (token, details) => {
    let url = Host + updateUserURI;
    if (details.is_active === "true"){
        details.is_active = 1;
    } else {
        details.is_active = 0;
    }
    let params = {
        "token": token,
        "details": details
    };
    let headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }
    let res = await axios.post(url,params,headers)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        })
        .finally(function () {
        // always executed
        });  
    return res;
}