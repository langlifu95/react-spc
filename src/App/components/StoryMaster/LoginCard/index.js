import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Wrapper } from '../../Card/style';
import { Button } from '../../../../shared/Globals';
import { Body, Title, Description } from './style';
import { login } from '../../../../actions/user';

class LoginCard extends Component {
  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  render() {
    return (
      <Wrapper static overflow={'visible'}>
        <Body>
          <Description emoji>👋</Description>
          <Title>C'mon in, the water's fine</Title>
          <Description>
            Welcome to Spectrum, a place to share news and stories with your community. Sign in with Twitter to get started.
          </Description>
          <Button width={'100%'} onClick={this.login}>
            Sign in with Twitter
          </Button>
        </Body>
      </Wrapper>
    );
  }
}

export default connect()(LoginCard);
