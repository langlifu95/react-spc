// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
import { Button, LinkButton } from '../buttons';
import { addToastWithTimeout } from '../../actions/toasts';
import { LoadingCard } from '../loading';
import { Input, UnderlineInput, TextArea } from '../formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  Description,
  Actions,
  ImgPreview,
} from './style';
import {
  editCommunityMutation,
  deleteCommunityMutation,
} from '../../api/community';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

class CommunityWithData extends Component {
  constructor(props) {
    super(props);

    const { data: { community } } = this.props;
    this.state = {
      name: community.name,
      slug: community.slug,
      description: community.description,
      id: community.id,
      website: community.website,
      image: community.photoURL,
      file: null,
    };
  }

  changeName = e => {
    const name = e.target.value;
    this.setState({
      name,
    });
  };

  changeDescription = e => {
    const description = e.target.value;
    this.setState({
      description,
    });
  };

  changeSlug = e => {
    const slug = e.target.value;
    this.setState({
      slug,
    });
  };

  changeWebsite = e => {
    const website = e.target.value;
    this.setState({
      website,
    });
  };

  setCommunityPhoto = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  save = e => {
    e.preventDefault();
    const { name, slug, description, website, file, id } = this.state;
    const input = {
      name,
      slug,
      description,
      website,
      file,
      id,
    };
    this.props
      .editCommunity(input)
      .then(data => {
        const community = data.editCommunity;
        if (community !== undefined) {
          // community was successfully edited
          this.props.history.push(`/${community.slug}`);
        }
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', "You can't do that!"));
      });
  };

  triggerDeleteCommunity = e => {
    e.preventDefault();

    const { data: { community }, deleteCommunity, history } = this.props;

    deleteCommunity(community.id)
      .then(community => {
        if (community !== undefined) {
          // community was successfully deleted
          history.push(`/`);
        }
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', "You can't do that!"));
      });
  };

  render() {
    const { name, slug, description, image, website } = this.state;
    const { data: { community } } = this.props;

    if (!community) {
      return (
        <StyledCard>
          <FormTitle>This community doesn't exist yet.</FormTitle>
          <Description>Want to make it?</Description>
          <Actions>
            <Button>Create</Button>
          </Actions>
        </StyledCard>
      );
    }

    return (
      <StyledCard>
        <FormTitle>Community Settings</FormTitle>
        <Form>
          <Input defaultValue={name} onChange={this.changeName}>Name</Input>
          <UnderlineInput defaultValue={slug} onChange={this.changeSlug}>
            sp.chat/
          </UnderlineInput>
          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
          >
            Description
          </TextArea>

          <Input
            inputType="file"
            accept=".png, .jpg, .jpeg, .gif"
            defaultValue={name}
            onChange={this.setCommunityPhoto}
            multiple={false}
          >
            Add a logo or photo

            {!image ? <span>add</span> : <ImgPreview src={image} />}
          </Input>

          <Input
            defaultValue={website}
            onChange={this.changeWebsite}
            autoFocus={true}
          >
            Optional: Add your community's website
          </Input>

          <Actions>
            <LinkButton color={'warn.alt'}>Cancel</LinkButton>
            <Button onClick={this.save}>Save</Button>
          </Actions>

          <Actions>
            <LinkButton
              color={'warn.alt'}
              onClick={this.triggerDeleteCommunity}
            >
              Delete Community
            </LinkButton>
          </Actions>
        </Form>
      </StyledCard>
    );
  }
}

const Community = compose(
  deleteCommunityMutation,
  editCommunityMutation,
  displayLoadingState,
  withRouter,
  pure
)(CommunityWithData);
export default connect()(Community);
