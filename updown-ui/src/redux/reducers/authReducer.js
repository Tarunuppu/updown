import { handleActions } from 'redux-actions'
import {
  LOGIN_INIT,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_INIT,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from '../actions/authActions'

const initialState = {
  accessToken: localStorage.getItem('access_token') || null,
  loginInit: false,
  loginError: null,
  registerInit: false,
  registerError: null,
}

const authReducer = handleActions(
  {
    [LOGIN_INIT]: (state, action) => {
      return {
        ...state,
        loginInit: true,
        loginError: null,
        accessToken: null,
      }
    },
    [LOGIN_SUCCESS]: (state, action) => {
      return {
        ...state,
        loginInit: false,
        loginError: null,
        accessToken: localStorage.getItem('access_token'),
      }
    },
    [LOGIN_FAILURE]: (state, action) => {
      return {
        ...state,
        loginInit: false,
        loginError: action.payload,
        accessToken: null,
      }
    },
    [REGISTER_INIT]: (state, action) => {
      return {
        ...state,
        registerInit: true,
        registerError: null,
      }
    },
    [REGISTER_SUCCESS]: (state, action) => {
      return {
        ...state,
        registerInit: false,
        registerError: null,
      }
    },
    [REGISTER_FAILURE]: (state, action) => {
      return {
        ...state,
        registerInit: false,
        registerError: action.payload,
      }
    },
  },
  initialState
)

export default authReducer
