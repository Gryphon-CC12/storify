import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Typography from '@material-ui/core/Typography';
import './PageFooter.styles.scss';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        textAlign: 'center',
    },
});

//TODO fix overlapping

function PageFooter() {
    const classes = useStyles();

    return (
        <Grid>
            <BottomNavigation
                id="footer-component" className={classes.root}>
                <Typography
                    id="footer"
                    > 
                    Made with <FavoriteIcon id="heart" /> |   <a href="https://github.com/Gryphon-CC12/storify">GitHub</a><br></br>
                    <span id="copyright">Copyright 2020 Carlos Salazar, Aizhan Imankulova, Phuong Tran, Polly Sutcliffe</span>
                </Typography>
            </BottomNavigation>
        </Grid>
    );
}

export default PageFooter;