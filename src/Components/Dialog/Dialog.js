import React from 'react';
import Button from '@material-ui/core/Button';
import DialogComponent from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function Dialog(props){
    
    return (
        <>
            <DialogComponent
                open={props.details.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.details.title}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                {props.details.content}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                {props.details.has_ok ? 
                <Button onClick={props.details.ok_callback} color="primary">
                    {props.details.ok_text}
                </Button> : ''}
                <Button onClick={props.details.cancel_callback} color="primary" autoFocus>
                    {props.details.cancel_text}
                </Button>
                </DialogActions>
            </DialogComponent>
        </>
    )
}