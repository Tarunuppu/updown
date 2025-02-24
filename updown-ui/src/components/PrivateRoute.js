import React, { Component } from 'react'
import axios from 'axios'
import urls from '../config/api'

class PrivateRoute extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuth: null,
      loading: true,
    }
  }
  async componentDidMount() {
    let access_token = localStorage.getItem('access_token')
    if (!access_token) {
      this.setState({ loading: false, isAuth: false })
      return
    }
    try {
      let response = await axios.get(urls.base + 'auth/verify-token', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      this.setState({ isAuth: response.data.isAuthenticated, loading: false })
    } catch (error) {
      this.setState({ isAuth: false, loading: false })
    }
  }
  render() {
    const { isAuth, loading } = this.state
    const { children } = this.props

    if (loading) {
      return <h1>Loading...</h1>
    }
    if (!isAuth) {
      window.location.href = '/login'
      return null
    }
    return <>{children}</>
  }
}

export default PrivateRoute
