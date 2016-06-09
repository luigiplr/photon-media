import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../components/Header.react'
import * as HeaderActions from '../actions/header'

function mapStateToProps({ header }) {
  return {...header }
}

export default connect(mapStateToProps, dispatch => bindActionCreators(HeaderActions, dispatch))(Header)
