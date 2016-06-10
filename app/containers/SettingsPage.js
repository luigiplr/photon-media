import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Settings from 'components/Settings.react'
import * as SettingsActions from 'actions/settings'
import * as BackdropActions from 'actions/backdrop'

const mapStateToProps = ({ settings }) => ({ settings })

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(SettingsActions, dispatch),
  backdrop: bindActionCreators(BackdropActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
