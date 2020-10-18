import axios from 'axios';
import '../../Config/Config'
import {Host, GetByEmailPasswd, GetMenuList} from '../../Config/Config'


export const GetMenu = async (props) => {
  let url = Host + GetMenuList;
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

export const UserLogin = async (props) => {
  
  let url = Host + GetByEmailPasswd;
  
  let params = {
    "email": props.user_name,
    "passwd": props.user_pwd
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

  // let res = await axios.get('./dummy_data/LoginData.json', {
  //     params: {
  //       username: props.user_name,
  //       password: props.user_pwd
  //     }
  //   })
  //   .then(function (response) {
  //     return response.data;
  //   })
  //   .catch(function (error) {
  //     return error;
  //   })
  //   .finally(function () {
  //     // always executed
  // });  
  // return res;
}
