import clsx from "clsx";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import isSameDay from "date-fns/isSameDay";
import endOfWeek from "date-fns/endOfWeek";
import React, { PureComponent } from "react";
import startOfWeek from "date-fns/startOfWeek";
import isWithinInterval from "date-fns/isWithinInterval";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { createStyles } from "@material-ui/styles";
// this guy required only on the docs site to work with dynamic date library
import { IconButton, withStyles } from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import enLocale from "date-fns/locale/en-US";
import zhLocale from "date-fns/locale/zh-CN";
import Dic from '../../assets/dic/dictionary.json';

class CustomElements extends PureComponent {
    makeJSDateObject = (date) => {
        const res = new Date(date.getTime());
        return res;
    }
    state = {
        selectedDate: new Date(),
        endDate: null
    };

    handleWeekChange = date => {
        this.setState({
            selectedDate: startOfWeek(this.makeJSDateObject(date)),
            endDate: endOfWeek(this.makeJSDateObject(date))
        });
    };

    formatWeekSelectLabel = (date, invalidLabel) => {
        let dateClone = this.makeJSDateObject(date);
        let text = '';
        if (this.props.lanuageIndex === 0){
            text = 'Week of';
        } else {
            text = '那周';
        }
        
        return dateClone && isValid(dateClone)
        ? this.props.lanuageIndex === 0 ? `${text} ${format(startOfWeek(dateClone), "MMM do")}` : `${format(startOfWeek(dateClone), "MMM do")} ${text}`
        : invalidLabel;
    };

    renderWrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {
        const { classes } = this.props;
        let dateClone = this.makeJSDateObject(date);
        let selectedDateClone = this.makeJSDateObject(selectedDate);

        const start = startOfWeek(selectedDateClone);
        const end = endOfWeek(selectedDateClone);

        const dayIsBetween = isWithinInterval(dateClone, { start, end });
        const isFirstDay = isSameDay(dateClone, start);
        const isLastDay = isSameDay(dateClone, end);

        const wrapperClassName = clsx({
        [classes.highlight]: dayIsBetween,
        [classes.firstHighlight]: isFirstDay,
        [classes.endHighlight]: isLastDay,
        });

        const dayClassName = clsx(classes.day, {
        [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
        [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
        });

        return (
        <div className={wrapperClassName}>
            <IconButton className={dayClassName}>
            <span> {format(dateClone, "d")} </span>
            </IconButton>
        </div>
        );
    };

    render() {
        const { selectedDate } = this.state;

        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} className="data-picker">
                <DatePicker
                    label={Dic.text[this.props.lanuageIndex].common.week}
                    value={selectedDate}
                    onChange={this.handleWeekChange}
                    renderDay={this.renderWrappedWeekDay}
                    labelFunc={this.formatWeekSelectLabel}
                    okLabel={Dic.text[this.props.lanuageIndex].common.ok}
                    cancelLabel={Dic.text[this.props.lanuageIndex].common.cancel}
                    onAccept={(selectedDate) => {
                        this.props.callBack(selectedDate);
                    }}
                />
            </MuiPickersUtilsProvider>
        );
    }
}

const styles = createStyles(theme => ({
    dayWrapper: {
        position: "relative",
    },
    day: {
        width: 36,
        height: 36,
        fontSize: theme.typography.caption.fontSize,
        margin: "0 2px",
        color: "inherit",
    },
    customDayHighlight: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "2px",
        right: "2px",
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: "50%",
    },
    nonCurrentMonthDay: {
        color: theme.palette.text.disabled,
    },
    highlightNonCurrentMonthDay: {
        color: "#676767",
    },
    highlight: {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    firstHighlight: {
        extend: "highlight",
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
    },
    endHighlight: {
        extend: "highlight",
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
    },
}));

export default withStyles(styles)(CustomElements);