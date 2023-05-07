import React from 'react';
import styles from './vote-frame.css';

const VoteFrame = props => (
    <iframe
        className={styles.frame}
        style={props.id != '0' ? {} : { display: 'none' }}
        src={`http://localhost:5173/embed/vote?id=${props.id}`}
    ></iframe>
);

export default VoteFrame;
