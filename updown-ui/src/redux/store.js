import { createStore, applyMiddleware, combineReducers } from 'redux'
import { thunk } from 'redux-thunk'
import authReducer from './reducers/authReducer'
import dashboardReducer from './reducers/dashboardReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store
