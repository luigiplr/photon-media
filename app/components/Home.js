import React, { Component } from 'react'
import { Link } from 'react-router'

const styles = {}

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Home</h2>
          <Link to="/settings">to Counter</Link>
        </div>
      </div>
    );
  }
}
