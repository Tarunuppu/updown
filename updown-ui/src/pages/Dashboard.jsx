import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  getFiles,
  uploadFile,
  deleteFile,
} from '../redux/actions/dashboardActions'
import download from '../assets/download.png'
import logout from '../assets/logout.png'
import upload from '../assets/upload.png'
import Delete from '../assets/delete.png'
import Loading from '../components/Loading'

const Template = styled.div`
  height: 100vh;
  padding: 0 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Body = styled.div`
  width: 100%;
  height: 90%;
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
      margin-left: 10px;
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
  height: ${(props) => (props.maximize ? '50%' : '20%')};
  display: flex;
  flex-direction: column;
  .upload-title {
    font-size: 20px;
    font-weight: bold;
    font-style: italic;
    text-align: center;
  }
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
  height: 70%;
  .file-title {
    font-size: 20px;
    font-weight: bold;
    align-content: center;
    position: absolute;
    left: 0px;
    height: 100%;
  }
  .files-list {
    height: calc(100% - 132px);
    overflow-y: auto;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  margin: 30px 0px 10px 0px;
  justify-content: center;
  align-items: center;
  .search {
    width: 400px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
  }
`

const FileInput = styled.input`
  display: none;
`

const FileInputLabel = styled.label`
  height: 100%;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px 0;
  width: calc(100% - 10px);
  border: 5px dashed #cceaf0;
  //   background-color: #f2f8ff;
  text-align: center;
  align-content: center;
  &:hover {
    img {
      top: -5px;
      height: 40px;
    }
  }
  img {
    position: relative;
    height: 35px;
    transition: height top 2s ease-in-out;
  }
  p {
    margin: 5px 0px;
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
      &.download,
      &.delete {
        img {
          cursor: pointer;
          height: 30px;
          opacity: 0.5;

          &:hover {
            opacity: 1;
          }
        }
      }
      &.delete {
        img {
          height: 25px;
        }
      }
      &:hover {
        text-decoration: none;
      }
    }
  }
  .field {
    text-align: center;
    margin: 0px 5px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    cursor: pointer;
    &.name {
      width: calc(30% - 10px);
    }
    &.type {
      width: calc(10% - 10px);
    }
    &.size {
      width: calc(10% - 10px);
    }
    &.date {
      width: calc(30% - 10px);
    }
    &.download {
      cursor: default;
      width: calc(10% - 10px);
      &:hover {
        text-decoration: none;
      }
    }
    &.delete {
      cursor: default;
      width: calc(10% - 10px);
      &:hover {
        text-decoration: none;
      }
    }
    &:hover {
      text-decoration: underline;
    }
  }
`
const Dropdown = styled.div`
  .dropdown {
    width: 100px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
  }
  position: absolute;
  right: 0px;
`

const Arrow = styled.span`
  margin-left: 5px;
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: ${(props) =>
    props.order === 'asc'
      ? `5px solid ${props.active ? 'black' : 'grey'}`
      : 'none'};
  border-top: ${(props) =>
    props.order === 'desc'
      ? `5px solid ${props.active ? 'black' : 'grey'}`
      : 'none'};
`

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      filesPerPage: 10,
      orderBy: 'created_at',
      order: 'asc',
      searchQuery: '',
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
    const { currentPage, filesPerPage, orderBy, order, searchQuery } =
      this.state
    if (
      prevState.currentPage !== currentPage ||
      prevState.filesPerPage !== filesPerPage ||
      prevState.orderBy !== orderBy ||
      prevState.order !== order ||
      prevState.searchQuery !== searchQuery
    ) {
      getFiles({
        page_number: currentPage,
        page_limit: filesPerPage,
        sort_order: order,
        sort_by: orderBy,
        search_query: searchQuery,
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

  handleDelete = (fileName) => {
    const { deleteFile } = this.props
    deleteFile(fileName)
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

  handleDropdownChange = (e) => {
    this.setState({ filesPerPage: e.target.value })
  }

  handleSearch = (e) => {
    let value = e.target.value
    this.setState({ searchQuery: e.target.value })
  }

  render() {
    const {
      filesLoading,
      filesError,
      files,
      uploadFileInit,
      uploadFileError,
      totalFilteredFiles,
      totalNoOfFiles,
    } = this.props

    const { currentPage, filesPerPage, order, orderBy } = this.state

    let userName = localStorage.getItem('user_name') || 'User'
    let noOfPages = Math.ceil(totalFilteredFiles / filesPerPage)
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
          <div className="field type">{file.type}</div>
          <div className="field size">{file.size}</div>
          <div className="field date" title={file.created_at}>
            {file.created_at}
          </div>
          <div
            className="field download"
            onClick={() =>
              this.handleDownload(file.download_url, file.file_name)
            }>
            <img src={download} alt="download" />
          </div>
          <div
            className="field delete"
            onClick={() => this.handleDelete(file.file_name)}>
            <img src={Delete} alt="delete" />
          </div>
        </FileItem>
      )
    })

    return (
      <Template>
        <NavBar>
          <div className="greetings">Welcome {userName}!</div>
          <div className="logout" onClick={this.handleLogout}>
            <img src={logout} alt="logout" />
            <div className="text">Logout</div>
          </div>
        </NavBar>
        <Body>
          <UploadContainer maximize={!totalNoOfFiles}>
            {!totalNoOfFiles ? (
              <div className="upload-title">Upload a file to get started</div>
            ) : null}
            <FileInput
              type="file"
              id="file-upload"
              onChange={this.handleFileUpload}
              multiple
            />
            <FileInputLabel htmlFor="file-upload">
              {uploadFileInit ? (
                <Loading />
              ) : (
                <>
                  <img src={upload} alt="upload image" />
                  <p>
                    Supported file formats: JPG, JPEG, PNG, PDF, DOCX, JSON, and
                    TXT
                  </p>
                </>
              )}
            </FileInputLabel>
          </UploadContainer>
          {totalNoOfFiles ? (
            <>
              <FilesContainer>
                <Header>
                  <div className="file-title">Files</div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="search"
                    onChange={this.handleSearch}
                  />
                  <Dropdown>
                    <span>Files per page: </span>
                    <select
                      className="dropdown"
                      value={filesPerPage}
                      onChange={this.handleDropdownChange}>
                      <option value="">Select an option</option>
                      <option value="10">10</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </Dropdown>
                </Header>
                <FileItem>
                  <div
                    className="field name"
                    onClick={this.handleOrder}
                    name="file_name">
                    Name
                    <Arrow order={order} active={orderBy === 'file_name'} />
                  </div>
                  <div
                    className="field type"
                    onClick={this.handleOrder}
                    name="file_type">
                    Type
                    <Arrow order={order} active={orderBy === 'file_type'} />
                  </div>
                  <div
                    className="field size"
                    onClick={this.handleOrder}
                    name="file_size">
                    Size
                    <Arrow order={order} active={orderBy === 'file_size'} />
                  </div>
                  <div
                    className="field date"
                    onClick={this.handleOrder}
                    name="created_at">
                    Date Uploaded
                    <Arrow order={order} active={orderBy === 'created_at'} />
                  </div>
                  <div className="field download" name="download">
                    Download
                  </div>
                  <div className="field delete" name="delete">
                    Delete
                  </div>
                </FileItem>
                {totalFilteredFiles ? (
                  <div className="files-list">
                    {filesLoading || filesError ? <Loading /> : filesList}
                  </div>
                ) : null}
              </FilesContainer>
              {totalFilteredFiles > filesPerPage ? (
                <Pagination>
                  <button
                    onClick={this.handlePrev}
                    disabled={currentPage === 1}>
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
              ) : null}
            </>
          ) : null}
        </Body>
      </Template>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    files: state.dashboard.files,
    totalFilteredFiles: state.dashboard.totalFilteredFiles,
    totalNoOfFiles: state.dashboard.totalNoOfFiles,
    filesLoading: state.dashboard.getFilesInit,
    filesError: state.dashboard.getFilesError,
    uploadFileInit: state.dashboard.uploadFileInit,
    uploadFileError: state.dashboard.uploadFileError,
  }
}

const mapDispatchToProps = { getFiles, uploadFile, deleteFile }

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
