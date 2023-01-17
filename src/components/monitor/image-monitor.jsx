import React from 'react';
import PropTypes from 'prop-types';
import styles from './monitor.css';

const ImageMonitor = ({width, label, value}) => (
    <div
        className={styles.ListMonitor}
        style={{
            width: `${width}px`,
            height: `${height}px`
        }}
    >
        <div className={styles.ListHeader}>
            {label}
        </div>
        <div className={styles.ListBody}>
            <image 
                src={value}
                width={width}
            ></image>
        </div>
    </div>
);

ImageMonitor.propTypes = {
    categoryColor: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType(PropTypes.string),
    width: PropTypes.number
};

ImageMonitor.defaultProps = {
    width: 110,
};

export default ImageMonitor;
