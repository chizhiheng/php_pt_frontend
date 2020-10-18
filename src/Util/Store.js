import React, {useState, createContext} from 'react';
import Dic from '../assets/dic/dictionary.json'

let initialState = {
    left_nav: [],
    lanuage_index: 0
};

Dic.text.forEach((element, id) => {
  if (window.navigator.language === element.language){
    initialState.lanuage_index = id;
  }
});

const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
    const [state, setState] = useState(initialState);

    const setAppState = (newState, callback) => {
        let mergedState = state;
        setState((prevState) => {
            mergedState = { ...prevState, ...newState };
            return { ...prevState, ...newState };
        });

        if (callback) {
            callback(mergedState);
        }
    };

    return (
        <AppContext.Provider
          value={{
            appState: state,
            setAppState,
          }}
        >
          { children }
        </AppContext.Provider>
      );

};

export {
    AppContext,
    AppContextProvider
};