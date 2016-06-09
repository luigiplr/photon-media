import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Backdrop from 'components/Backdrop.react'
import * as BackdropActions from 'actions/backdrop'

export default connect(
  ({ backdrop }) => backdrop,
  dispatch => bindActionCreators(BackdropActions, dispatch)
)(Backdrop)
