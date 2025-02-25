import { handleActions } from 'redux-actions'
import {
  GET_FILES_INIT,
  GET_FILES_SUCCESS,
  GET_FILES_FAILURE,
  UPLOAD_FILE_INIT,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,
  DELETE_FILE_INIT,
  DELETE_FILE_SUCCESS,
  DELETE_FILE_FAILURE,
} from '../actions/dashboardActions'

const initialState = {
  files: [],
  totalNoOfFiles: 0,
  totalFilteredFiles: 0,
  getFilesInit: false,
  getFilesError: null,
  uploadFileInit: false,
  uploadFileError: null,
  deleteFileInit: false,
  deleteFileError: null,
}

const dashboardReducer = handleActions(
  {
    [GET_FILES_INIT]: (state, action) => {
      return {
        ...state,
        getFilesInit: true,
        getFilesError: null,
      }
    },
    [GET_FILES_SUCCESS]: (state, action) => {
      return {
        ...state,
        getFilesInit: false,
        getFilesError: null,
        files: action.payload.files,
        totalFilteredFiles: action.payload.total_filtered_files,
        totalNoOfFiles: action.payload.total_files,
      }
    },
    [GET_FILES_FAILURE]: (state, action) => {
      return {
        ...state,
        getFilesInit: false,
        getFilesError: action.payload,
      }
    },
    [UPLOAD_FILE_INIT]: (state, action) => {
      return {
        ...state,
        uploadFileInit: true,
        uploadFileError: null,
      }
    },
    [UPLOAD_FILE_SUCCESS]: (state, action) => {
      return {
        ...state,
        uploadFileInit: false,
        uploadFileError: null,
      }
    },
    [UPLOAD_FILE_FAILURE]: (state, action) => {
      return {
        ...state,
        uploadFileInit: false,
        uploadFileError: action.payload,
      }
    },
    [DELETE_FILE_INIT]: (state, action) => {
      return {
        ...state,
        deleteFileInit: true,
        deleteFileError: null,
      }
    },
    [DELETE_FILE_SUCCESS]: (state, action) => {
      return {
        ...state,
        deleteFileInit: false,
        deleteFileError: null,
      }
    },
    [DELETE_FILE_FAILURE]: (state, action) => {
      return {
        ...state,
        deleteFileInit: false,
        deleteFileError: action.payload,
      }
    },
  },
  initialState
)

export default dashboardReducer
