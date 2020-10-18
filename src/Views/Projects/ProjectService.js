import axios from 'axios';
import {
    Host, 
    GetProjectURI,
    CreateProjectURI
} from '../../Config/Config';

export const GetAllProjectsRequest = async (token) => {
    const url = Host + GetProjectURI;
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

export const SaveProjectRequest = async (token, company_id, division_id, project_name) => {
    const url = Host + CreateProjectURI;
    const params = {
        "token": token,
        "company_id": company_id,
        "division_id": division_id,
        "project_name": project_name
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