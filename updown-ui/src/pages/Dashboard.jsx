import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { getFiles, uploadFile } from '../redux/actions/dashboardActions'
import download from '../assets/download.png'
import logout from '../assets/logout.png'
import upload from '../assets/upload.png'

const Template = styled.div`
  height: 100vh;
  padding: 0 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const NavBar = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .greetings {
    font-weight: bold;
    font-size: 20px;
  }
  .logout {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .text {
      font-size: 16px;
      margin-right: 10px;
    }
    img {
      height: 35px;
      opacity: 0.5;
      &:hover {
        opacity: 1;
      }
    }
  }
`
const UploadContainer = styled.div`
  width: 100%;
  height: 15%;
  display: flex;
`

const Pagination = styled.div`
  width: 100%;
  height: calc(10% - 10px);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  button {
    padding: 10px 20px;
    margin: 0 10px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: #00879e;
    color: white;
    cursor: pointer;
    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    &:hover:not(:disabled) {
      background-color: #007a8c;
    }
  }
  span {
    font-size: 16px;
    margin: 0 10px;
  }
`

const FilesContainer = styled.div`
  width: 100%;
  height: 65%;
  .file-title {
    font-size: 2em;
    font-weight: bold;
    margin: 20px 0;
  }
  .files-list {
    height: calc(100% - 138px);
    overflow-y: auto;
  }
`

const FileInput = styled.input`
  display: none;
`

const FileInputLabel = styled.label`
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px 0;
  width: 100%;
  border: 1px dashed #e5d9f2;
  background-color: #99d5e1;
  text-align: center;
  align-content: center;
  &:hover {
    background-color: #66bbcb;
    img {
      opacity: 1;
    }
  }
  img {
    height: 35px;
    opacity: 0.5;
  }
`

const FileItem = styled.div`
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #cceaf0;
  border-radius: 5px;
  margin: 5px 0;
  padding: 0 20px;
  align-items: center;
  &.item {
    background-color: white;
    border: 1.5px dashed rgb(31, 140, 167);
    .field {
      cursor: default;
      &.name {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
      &.download {
        img {
          cursor: pointer;
          height: 30px;
          opacity: 0.5;

          &:hover {
            opacity: 1;
          }
        }
      }
      &:hover {
        text-decoration: none;
      }
    }
  }
  .field {
    text-align: center;
    width: calc(20% - 20px);
    margin-right: 20px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      filesPerPage: 10,
      orderBy: 'created_at',
      order: 'asc',
    }
  }
  componentDidMount() {
    const { getFiles } = this.props
    const { currentPage, filesPerPage, orderBy, order } = this.state
    getFiles({
      page_number: currentPage,
      page_limit: filesPerPage,
      sort_order: order,
      sort_by: orderBy,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { getFiles } = this.props
    const { currentPage, filesPerPage, orderBy, order } = this.state
    if (
      prevState.currentPage !== currentPage ||
      prevState.filesPerPage !== filesPerPage ||
      prevState.orderBy !== orderBy ||
      prevState.order !== order
    ) {
      getFiles({
        page_number: currentPage,
        page_limit: filesPerPage,
        sort_order: order,
        sort_by: orderBy,
      })
    }
  }
  handleFileUpload = (e) => {
    const { uploadFile } = this.props
    uploadFile(e.target.files)
    e.target.value = ''
  }

  handlePrev = () => {
    const { currentPage } = this.state
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 })
    }
  }

  handleNext = (noOfPages) => {
    const { currentPage } = this.state
    if (currentPage < noOfPages) {
      this.setState({ currentPage: currentPage + 1 })
    }
  }

  handleOrder = (e) => {
    const { order, orderBy: prevOrderBy } = this.state
    let orderBy = e.target.getAttribute('name')
    if (prevOrderBy === orderBy) {
      this.setState({ order: order === 'asc' ? 'desc' : 'asc', currentPage: 1 })
    } else {
      this.setState({ orderBy: orderBy, order: 'asc', currentPage: 1 })
    }
  }

  handleDownload = (downloadUrl, fileName) => {
    if (downloadUrl) {
      let element = document.createElement('a')
      element.href = downloadUrl
      element.download = fileName
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  handleView = (viewUrl, fileName) => {
    if (viewUrl) {
      window.open(viewUrl, '_blank')
    }
  }
  handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  render() {
    const {
      filesLoading,
      filesError,
      files,
      uploadFileInit,
      uploadFileError,
      totalNoOfFiles,
    } = this.props

    const { currentPage, filesPerPage } = this.state

    let userName = localStorage.getItem('user_name') || 'User'
    let noOfPages = Math.ceil(totalNoOfFiles / filesPerPage)
    let filesList = files.map((file) => {
      return (
        <FileItem className="item" key={file.id}>
          <div
            className="field name"
            title={file.file_name}
            onClick={() => {
              this.handleView(file.view_url, file.file_name)
            }}>
            {file.file_name}
          </div>
          <div className="field">{file.type}</div>
          <div className="field">{file.size}</div>
          <div className="field" title={file.created_at}>
            {file.created_at}
          </div>
          <div
            className="field download"
            onClick={() =>
              this.handleDownload(file.download_url, file.file_name)
            }>
            <img src={download} alt="download" />
          </div>
        </FileItem>
      )
    })

    return (
      <Template>
        <NavBar>
          <div className="greetings">Welcome {userName}!</div>
          <div className="logout" onClick={this.handleLogout}>
            <div className="text">Logout</div>
            <img src={logout} alt="logout" />
          </div>
        </NavBar>
        <UploadContainer>
          <FileInput
            type="file"
            id="file-upload"
            onChange={this.handleFileUpload}
            multiple
          />
          <FileInputLabel htmlFor="file-upload">
            <img src={upload} alt="upload image" />
          </FileInputLabel>
        </UploadContainer>
        <FilesContainer>
          <div className="file-title">Files</div>
          <FileItem>
            <div className="field" onClick={this.handleOrder} name="file_name">
              Name
            </div>
            <div className="field" onClick={this.handleOrder} name="file_type">
              Type
            </div>
            <div className="field" onClick={this.handleOrder} name="file_size">
              Size
            </div>
            <div className="field" onClick={this.handleOrder} name="created_at">
              Created At
            </div>
            <div className="field" name="download"></div>
          </FileItem>
          <div className="files-list">
            {filesLoading || filesError ? <p>Loading...</p> : filesList}
          </div>
        </FilesContainer>
        <Pagination>
          <button onClick={this.handlePrev} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {noOfPages}
          </span>
          <button
            onClick={() => this.handleNext(noOfPages)}
            disabled={currentPage === noOfPages}>
            Next
          </button>
        </Pagination>
      </Template>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    files: state.dashboard.files,
    totalNoOfFiles: state.dashboard.totalNoOfFiles,
    filesLoading: state.dashboard.getFilesInit,
    filesError: state.dashboard.getFilesError,
    uploadFileInit: state.dashboard.uploadFileInit,
    uploadFileError: state.dashboard.uploadFileError,
  }
}

const mapDispatchToProps = { getFiles, uploadFile }

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
