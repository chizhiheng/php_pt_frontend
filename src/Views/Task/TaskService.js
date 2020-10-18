import axios from 'axios';
import {
    Host, 
    GetTaskURI,
    CreateTaskURI,
    GetAllStatusURI,
    GetUsersByDivisionIDURI,
    GetProjectByDivisionURI,
    SkipTaskToMeURI,
    GetComplexityURI,
    GetPriorityURI,
    UpdateTaskURI,
    TaskWorkingURI,
    ReassignTaskToURI
} from '../../Config/Config';

export const GetAllTasksForMemberRequest = async (token, project_id) => {
    const url = Host + GetTaskURI;
    const params = {
        "token": token,
        "project_id": project_id,
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

export const GetAllTasksForAMLRequest = async (token, division_id) => {
    const url = Host + GetTaskURI;
    const params = {
        "token": token,
        "division_id": division_id
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

export const GetAllStatusRequest = async (token) => {
    const url = Host + GetAllStatusURI;
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
};


export const GetComplexityRequest = async (token) => {
    const url = Host + GetComplexityURI;
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
};


export const GetPriorityRequest = async (token) => {
    const url = Host + GetPriorityURI;
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
};

export const UpdateTaskRequest = async (token, details, task_id) => {
    const url = Host + UpdateTaskURI;
    const params = {
        "token": token,
        "details": details,
        "task_id": task_id
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

export const GetUsersByDivisionIDRequest = async (token, division_id) => {
    const url = Host + GetUsersByDivisionIDURI;
    const params = {
        "token": token,
        "division_id": division_id
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

export const GetProjectByDivisionRequest = async (token, division_id) => {
    const url = Host + GetProjectByDivisionURI;
    const params = {
        "token": token,
        "division_id": division_id
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


export const CreateTaskRequest = async (token, content) => {
    const url = Host + CreateTaskURI;
    const params = {
        "token": token,
        "content": content
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

export const SkipTaskToMeRequest = async (token, task_id, skip_reason) => {
    const url = Host + SkipTaskToMeURI;
    const params = {
        "token": token,
        "task_id": task_id,
        "skip_reason": skip_reason
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

export const TaskWorkingRequest = async (token, task_id, start_stop, working_time) => {
    const url = Host + TaskWorkingURI;
    const params = {
        "token": token,
        "task_id": task_id,
        "start_stop": start_stop,
        "working_time": working_time
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

export const ReassignTaskRequest = async (token, task_id, reassign_user_id) => {
    const url = Host + ReassignTaskToURI;
    const params = {
        "token": token,
        "task_id": task_id,
        "reassign_user_id": reassign_user_id
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