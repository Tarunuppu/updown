import { createAction } from 'redux-actions'
import axios from 'axios'
import urls from '../../config/api'

export const GET_FILES_INIT = 'GET_FILES_INIT'
export const GET_FILES_SUCCESS = 'GET_FILES_SUCCESS'
export const GET_FILES_FAILURE = 'GET_FILES_FAILURE'

const getFilesInit = createAction(GET_FILES_INIT)
const getFilesSuccess = createAction(GET_FILES_SUCCESS)
const getFilesFailure = createAction(GET_FILES_FAILURE)

export const getFiles = (filters) => async (dispatch) => {
  dispatch(getFilesInit())
  try {
    let accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      alert('Token expired or not available, please login again')
      window.location.href = '/login'
    }
    const response = await axios.get(urls.base + 'dashboard/list', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: filters,
    })
    const data = response.data
    dispatch(getFilesSuccess(data))
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert('Session expired, please login again')
      window.location.href = '/login'
    } else {
      dispatch(getFilesFailure(error))
    }
  }
}

export const UPLOAD_FILE_INIT = 'UPLOAD_FILE_INIT'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'
export const UPLOAD_FILE_FAILURE = 'UPLOAD_FILE_FAILURE'

const uploadFileInit = createAction(UPLOAD_FILE_INIT)
const uploadFileSuccess = createAction(UPLOAD_FILE_SUCCESS)
const uploadFileFailure = createAction(UPLOAD_FILE_FAILURE)

export const uploadFile = (files) => async (dispatch) => {
  dispatch(uploadFileInit())
  try {
    let accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      alert('Token expired or not available, please login again')
      window.location.href = '/login'
    }
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i])
    }
    const response = await axios.post(
      urls.base + 'dashboard/upload',
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    const data = response.data
    dispatch(uploadFileSuccess(data))
    dispatch(getFilesSuccess(data))
    alert('File uploaded successfully')
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert('Session expired, please login again')
      window.location.href = '/login'
    } else {
      alert('File upload failed, Please try again')
      dispatch(uploadFileFailure(error))
    }
  }
}
