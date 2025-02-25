import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { login, register } from '../redux/actions/authActions'
import withNavigate from '../components/withNavigate'

const Template = styled.div`
  height: 100vh;
  padding: 0 150px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const TextContainer = styled.div`
  width: 50%;
  height: 50%;
  border: 5px solid #00879e;
  border-radius: 10px;
  padding-left: 50px;
  align-content: center;
  .text {
    font-size: 60px;
    font-weight: 300;
  }
  .app-title {
    font-size: 100px;
    font-weight: 700;
    font-family: 'Montserrat', sans-serif;
    font-style: italic;
  }
`

const LoginContainer = styled.div`
  width: 50%;
  height: 80%;
  border-color: blue;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    font-size: 30px;
    margin-bottom: 20px;
    width: fit-content;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #00879e;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #007a8c;
  }
`

const Span = styled.span`
  margin-bottom: 10px;
  font-size: 16px;
`
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      name: '',
      renderLoginPage: true,
    }
  }
  componentDidMount() {
    let accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      window.location.href = '/dashboard'
    }
  }

  handleLogin = (e) => {
    e.preventDefault()
    const { login, navigate } = this.props
    const { email, password } = this.state
    login(email, password, navigate)
  }

  handleSignUp = (e) => {
    e.preventDefault()
    const { register, navigate } = this.props
    const { email, password, name } = this.state
    register(name, email, password, navigate)
  }

  handleChange = (e) => {
    e.preventDefault()
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  toggleForm = () => {
    this.setState({
      renderLoginPage: !this.state.renderLoginPage,
      name: '',
      email: '',
      password: '',
    })
  }
  render() {
    const { renderLoginPage, email, password, name } = this.state
    const { accessToken, loginInit, loginError, registerInit, registerError } =
      this.props

    return (
      <Template>
        <TextContainer>
          <div className="app-title">UpDown</div>
          <div className="text">Simplified Box</div>
        </TextContainer>
        {renderLoginPage ? (
          <LoginContainer>
            <div className="title">Login</div>
            <Form onSubmit={this.handleLogin}>
              <Input
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                required
                onChange={this.handleChange}
              />
              <Input
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                required
                onChange={this.handleChange}
              />
              <Button type="submit">Login</Button>
              <Span>New to UpDown?</Span>
              <Button type="button" onClick={this.toggleForm}>
                Sign Up
              </Button>
            </Form>
          </LoginContainer>
        ) : (
          <LoginContainer>
            <div className="title">Sign Up</div>
            <Form onSubmit={this.handleSignUp}>
              <Input
                type="text"
                name="name"
                value={name}
                placeholder="Name"
                required
                onChange={this.handleChange}
              />
              <Input
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                required
                onChange={this.handleChange}
              />
              <Input
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                required
                onChange={this.handleChange}
              />
              <Button type="submit">Sign Up</Button>
              <Span>Already have an account?</Span>
              <Button type="button" onClick={this.toggleForm}>
                Login
              </Button>
            </Form>
          </LoginContainer>
        )}
      </Template>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accessToken: state.auth.accessToken,
    loginInit: state.auth.loginInit,
    loginError: state.auth.loginError,
    registerInit: state.auth.registerInit,
    registerError: state.auth.register,
  }
}

const mapDisptachToProps = {
  login,
  register,
}
export default connect(mapStateToProps, mapDisptachToProps)(withNavigate(Login))
