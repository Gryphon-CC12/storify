import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Typography from '@material-ui/core/Typography';
import './PageFooter.styles.scss';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        textAlign: 'center',
    },
});


function PageFooter() {
    const classes = useStyles();

    return (
        <Container id="container">
            <BottomNavigation id="footer-component" className={classes.root}>
                <Typography id="footer"> 
                    Made with <FavoriteIcon id="heart" /> |   <a href="https://github.com/Gryphon-CC12/storify">GitHub</a><br></br>
                    <span id="copyright">Copyright 2020 Carlos Salazar, Aizhan Imankulova, Phuong Tran, Polly Sutcliffe</span>
                </Typography>
            </BottomNavigation>
        </Container>
    );
}

export default PageFooter;