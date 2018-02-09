// @flow
import styled from 'styled-components';
import { zIndex, Transition } from '../../components/globals';

export const EmailListItem = styled.div`
  padding: 8px 0 16px;
  border-bottom: 2px solid ${props => props.theme.bg.wash};

  &:last-of-type {
    border-bottom: none;
  }

  input {
    margin-right: 8px;
  }
`;

export const CheckboxContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EmailForm = styled.form`
  display: flex;
  align-items: flex-end;

  button {
    align-self: flex-end;
    margin-left: 16px;
  }
`;
