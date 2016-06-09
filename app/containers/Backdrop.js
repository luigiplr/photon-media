import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Backdrop from '../components/Backdrop'
import * as BackdropActions from '../actions/backdrop'


function mapStateToProps({ backdrop }) {
  return {...backdrop }
}

export default connect(mapStateToProps, dispatch => bindActionCreators(BackdropActions, dispatch))(Backdrop)
