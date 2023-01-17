import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ListMonitorComponent from '../components/monitor/image-monitor.jsx';

class ListMonitor extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleActivate',
            'handleDeactivate',
        ]);

        this.state = {
            width: props.width || 100,
        };
    }

    render () {
        const { ...props } = this.props;
        return (
            <ListMonitorComponent
                {...props}
                width={this.state.width}
            />
        );
    }
}

ListMonitor.propTypes = {
    id: PropTypes.string,
    targetId: PropTypes.string,
    value: PropTypes.oneOfType(PropTypes.string),
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
};

const mapStateToProps = state => ({
    customStageSize: state.scratchGui.customStageSize
});

export default connect(mapStateToProps)(ListMonitor);
