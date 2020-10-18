import axios from 'axios';
import {
    Host, 
    GetTaskDetailURI,
    TaskAssignToMeURI,
    AddTaskCommentURI
} from '../../Config/Config';

export const GetTaskDetailRequest = async (token, task_id) => {
    const url = Host + GetTaskDetailURI;
    const params = {
        "token": token,
        "task_id": task_id,
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

export const TaskAssignToMeRequest = async (token, task_id) => {
    const url = Host + TaskAssignToMeURI;
    const params = {
        "token": token,
        "task_id": task_id,
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

export const AddTaskCommentRequest = async (token, task_id, comment) => {
    const url = Host + AddTaskCommentURI;
    const params = {
        "token": token,
        "task_id": task_id,
        "comment": comment
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