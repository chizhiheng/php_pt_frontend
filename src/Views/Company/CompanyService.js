import axios from 'axios';
import {
    Host, 
    GetCompanyByIdURI, 
    GetAllCompanyURI, 
    GetCompanyIdURI,
    CreateCompanyURI, 
    UpdateCompanyURI, 
    DeleteCompanyURI, 
    CreateDivisionURI, 
    UpdateDivisionURI, 
    DeleteDivisionURI
} from '../../Config/Config';

export const GetAllCompanyRequest = async (token) => { //admin
    let url = Host + GetAllCompanyURI;
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
export const GetCompanyByIdRequest = async (token) => { // manager & leader
    let url = Host + GetCompanyByIdURI;
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
export const GetCompanyIdRequest = async (token, user_id) => {
    let url = Host + GetCompanyIdURI;
    let params = {
        "token": token,
        "user_id": user_id,
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
export const CreateCompanyRequest = async (token, c_name, c_desc) => {
    let url = Host + CreateCompanyURI;
    let params = {
        "token": token,
        "c_name": c_name,
        "c_desc": c_desc
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
export const UpdateCompanyRequest = async (token, c_name, c_desc, c_id) => {
    let url = Host + UpdateCompanyURI;
    let params = {
        "token": token,
        "c_name": c_name,
        "c_desc": c_desc,
        "c_id": c_id
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
export const DeleteCompanyRequest = async (token, c_id) => {
    let url = Host + DeleteCompanyURI;
    let params = {
        "token": token,
        "c_id": c_id
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
export const CreateDivisionRequest = async (token, c_id, d_name, d_desc) => {
    let url = Host + CreateDivisionURI;
    let params = {
        "token": token,
        "c_id": c_id,
        "d_name": d_name,
        "d_desc": d_desc
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
export const UpdateDivisionRequest = async (token, d_id, d_name, d_desc) => {
    let url = Host + UpdateDivisionURI;
    let params = {
        "token": token,
        "d_id": d_id,
        "d_name": d_name,
        "d_desc": d_desc
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
export const DeleteDivisionRequest = async (token, d_id) => {
    let url = Host + DeleteDivisionURI;
    let params = {
        "token": token,
        "d_id": d_id
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