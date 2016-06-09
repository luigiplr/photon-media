import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Home from 'components/Home.react'
import * as BackdropActions from 'actions/backdrop'


const mapDispatchToProps = dispatch => ({ backdrop: bindActionCreators(BackdropActions, dispatch) })

export default connect(null, mapDispatchToProps)(Home)
