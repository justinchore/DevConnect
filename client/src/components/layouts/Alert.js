import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

const Alert = ({ alerts }) => alerts !== null && alerts.length > 0 && alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        { alert.msg }
    </div>
));

Alert.propTypes = {
    alerts: PropTypes.array.isRequired, //ptar
}
const mapStateToProps = state => ({
    alerts: state.alert
}); //we need access to props from index.js rootReducer

export default connect(mapStateToProps)(Alert)

