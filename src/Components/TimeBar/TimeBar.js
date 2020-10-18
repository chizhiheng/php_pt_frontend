import React, {useState, useEffect} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import './TimeBar.scss';

export default function TimeBar(props) {
    const [propState, setPropState] = useState(props);
    const { timeList, fromTop, toBottom, callBack } = props;
    const [columnHeight, setColumnHeight] = useState(0);
    
    let taskIdList = [];
    let taskTimeList = [];
    timeList.forEach((element) => {
        if(taskIdList.indexOf(element.task_id)<0){
            taskIdList.push(element.task_id);
        }
    });
    
    taskIdList.forEach((element, id) => {
        let tmpTaskList = [];
        timeList.forEach((item) => {
            if (element === item.task_id){
                tmpTaskList.push(item);
            }
        });
        taskTimeList.push({
            task_id: element,
            items: tmpTaskList
        });
    });

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
        <div className="time-bar-container position-absolute overflow-scroll">
            {
                taskTimeList.map((item, index) => {
                    return (
                        <div className="time-bar" key={`item_bar_${index}`}>
                            <br />
                            <TimeItem item={item} fromTop={fromTop} toBottom={toBottom}/>
                        </div>
                    );
                })
            }
        </div>
    );
}

const TimeItem = (props) => {
    const {item, index, fromTop, toBottom, callback} = props;
    const itemStyleArr = [];
    const defaultHight = 28;
    
    item.items.forEach((element, id) => {
        const startTime = element.start_working_time.split('T')[1];
        const startTimeHour = parseInt(startTime.split(':')[0]);
        const startTimeMin = parseInt(startTime.split(':')[1]);
        
        const stopTime = element.stop_working_time.split('T')[1];
        const stopTimeHour = parseInt(stopTime.split(':')[0]);
        const stopTimeMin = parseInt(stopTime.split(':')[1]);

        // console.log('startTimeHour: ', startTimeHour, 'stopTimeHour: ', stopTimeHour, "startTimeMin: ", startTimeMin, 'stopTimeMin: ', stopTimeMin);
        let topPosition = '';
        let height = '';
        if (fromTop && toBottom){
            topPosition = defaultHight.toString()+'px';
            height = (document.getElementsByClassName('time-bar-container')[0].offsetHeight - defaultHight).toString()+'px';
        } else if (fromTop && !toBottom){
            topPosition = defaultHight.toString()+'px';
            height = ((stopTimeHour-0)*60+(stopTimeMin-0)).toString()+'px';
        } else {
            topPosition = (startTimeHour*2*30+startTimeMin+defaultHight).toString()+'px';
            if (toBottom){
                height = (document.getElementsByClassName('time-bar-container')[0].offsetHeight - (startTimeHour*2*30+startTimeMin+defaultHight)).toString()+'px';
            } else {
                height = ((stopTimeHour-startTimeHour)*60+(stopTimeMin-startTimeMin)).toString()+'px';
            }
        }
        
        itemStyleArr.push({
            top: topPosition,
            height: height
        });
    });
    return (
        <>
            {
                item.items.map((item, id) => {
                    return (
                        <Tooltip key={`item_index_${id}`} title={`${item.start_working_time.split('T')[1]} - ${item.stop_working_time.split('T')[1]}`}>
                            <button className="time-bar-content" style={itemStyleArr[id]}>{item.task_name}</button>
                        </Tooltip>
                    )
                })
            }
        </>
    );
}