import React, { Component } from 'react'
import styled from 'styled-components'

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #22a6b3;
  margin: auto;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`
export default class Loading extends Component {
  render() {
    return <Spinner></Spinner>
  }
}
