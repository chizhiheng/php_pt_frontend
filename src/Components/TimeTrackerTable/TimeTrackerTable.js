import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from '../../Util/Store';
import Dic from '../../assets/dic/dictionary.json';

export default function TimeTrackerTable(props) {
    const [propState, setPropState] = useState(props);
    const { appState } = useContext(AppContext);
    let timeNumArr = [];
    let min = '00';
    let hour = 0;

    for (let i=0; i<48; i++){
        if (i%2 === 0){
            min = ':00';
            hour = i/2;
        } else {
            min = ':30';
        }
        
        timeNumArr.push(hour+min);
    }
    
    useEffect(()=>{
        let mounted = true;

        if (mounted){
            setPropState(props);
        }
        
        return () => {
            mounted = false;
        };
    }, [props]);

    return (
        <table className="border-table">
            <thead>
                <tr>
                    <th className="width-stand-10">{Dic.text[appState.lanuage_index].common.time}</th>
                    <th className="width-stand-90">{`${Dic.text[appState.lanuage_index].common.weekDays[new Date(propState.currentDate).getDay()]} (${new Date(propState.currentDate).getMonth()}/${new Date(propState.currentDate).getDate()})`}</th>
                </tr>
            </thead>
            <tbody>
                {
                    timeNumArr.map((item, key) => {
                        return (
                            <tr key={key}>
                                <td className="padding-left-right text-align-center height-30px">{item}</td>
                                <td className="padding-left-right"></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}