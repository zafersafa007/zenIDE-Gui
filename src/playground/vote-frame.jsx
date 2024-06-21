import React from 'react';
import styles from './vote-frame.css';

const VoteFrame = props => (
    <iframe
        className={styles.frame}
        style={props.id != '0' ? {} : { display: 'none' }}
        src={
            props.id != '0'
                ? `https://penguinmod-home-git-new-backend-live-penguinmod.vercel.app//embed/vote?id=${props.id}#dark=${props.darkmode}`
                : 'about:blank'
        }
    ></iframe>
);

export default VoteFrame;
