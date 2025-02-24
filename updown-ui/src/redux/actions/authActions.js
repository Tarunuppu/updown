import { createAction } from 'redux-actions'
import axios from 'axios'
import urls from '../../config/api'

export const LOGIN_INIT = 'LOGIN_INIT'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

const loginInit = createAction(LOGIN_INIT)
const loginSuccess = createAction(LOGIN_SUCCESS)
const loginFailure = createAction(LOGIN_FAILURE)

export const REGISTER_INIT = 'REGISTER_INIT'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'REGISTER_FAILURE'

const registerInit = createAction(REGISTER_INIT)
const registerSuccess = createAction(REGISTER_SUCCESS)
const registerFailure = createAction(REGISTER_FAILURE)

export const login = (email, password, navigate) => async (dispatch) => {
  dispatch(loginInit())
  try {
    const response = await axios.post(urls.base + 'auth/login', {
      email,
      password,
    })
    const { access_token, user_name } = response.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('user_name', user_name)
    navigate('/dashboard')
    dispatch(loginSuccess())
  } catch (error) {
    alert(error.response?.data?.message || 'Login Failed')
    dispatch(loginFailure(error.response?.data?.message || 'Login Failed'))
  }
}

export const register =
  (name, email, password, navigate) => async (dispatch) => {
    dispatch(registerInit())
    try {
      const response = await axios.post(urls.base + 'auth/register', {
        name,
        email,
        password,
      })
      alert(response.data.message)
      window.location.href = '/login'
      dispatch(registerSuccess())
    } catch (error) {
      alert(error.response?.data?.message || 'Login Failed')
      dispatch(
        registerFailure(error.response?.data?.message || 'Register Failed')
      )
    }
  }
