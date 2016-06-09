import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Settings from '../components/Settings'
import * as SettingsActions from '../actions/settings'


function mapStateToProps({ settings }) {
  return {
    ...settings
  }
}

export default connect(mapStateToProps, dispatch => bindActionCreators(SettingsActions, dispatch))(Settings)
