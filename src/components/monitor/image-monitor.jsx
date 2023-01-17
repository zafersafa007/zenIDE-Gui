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
    activeIndex: PropTypes.number,
    categoryColor: PropTypes.string.isRequired,
    draggable: PropTypes.bool.isRequired,
    height: PropTypes.number,
    label: PropTypes.string.isRequired,
    onActivate: PropTypes.func,
    onAdd: PropTypes.func,
    onResizeMouseDown: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]))
    ]),
    width: PropTypes.number
};

ImageMonitor.defaultProps = {
    width: 110,
    height: 200
};

export default ImageMonitor;
