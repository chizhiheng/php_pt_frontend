import axios from 'axios';

import {
    Host,
    GetStatisticURI,
    GetDivisionURI,
    getProductivityURI,
    getUitilizationURI,
    getRejectionRateURI
} from '../../Config/Config';

export const GetStatisticRequest = async (props) => {
    let url = Host + GetStatisticURI;
    let params = {
      "token": props
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

export const GetDivisionRequest = async (props) => {
    let url = Host + GetDivisionURI;
    let params = {
      "token": props
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

export const getProductivityRequest = async (props, user_ids, date) => {
  let url = Host + getProductivityURI;
  let params = {
    "token": props,
    "user_ids": user_ids,
    "date": date
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

export const getRejectionRateRequest = async (props, user_ids, date) => {
  let url = Host + getRejectionRateURI;
  let params = {
    "token": props,
    "user_ids": user_ids,
    "date": date
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

export const getUitilizationRequest = async (props, user_ids, date) => {
  let url = Host + getUitilizationURI;
  let params = {
    "token": props,
    "user_ids": user_ids,
    "date": date
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