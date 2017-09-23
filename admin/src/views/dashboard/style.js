import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

export const OverviewRow = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.text.default};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.border.default};
  background: ${props => props.theme.bg.default};
  margin: 8px 0 0 8px;
  border-radius: 4px;
`;

export const Subsection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 25%;

  @media (max-width: 768px) {
    flex: 1 0 100%;
  }
`;

export const Subtext = styled.h3`
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  color: ${props => props.theme.text.alt};
  margin: 16px 16px 8px;
`;

export const Count = styled.h4`
  font-size: 24px;
  font-weight: 800;
  margin: 0 16px 24px;
`;

export const HeaderZoneBoy = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.border.default};
  align-items: center;
  padding: 32px;
  background: ${props => props.theme.bg.default};

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const RangePicker = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    margin-top: 16px;
    width: 100%;
  }
`;

export const RangeItem = styled.li`
  display: inline-block;
  padding: 8px 24px;
  margin: 8px 0;
  background: ${props =>
    props.active ? props.theme.brand.default : props.theme.bg.wash};
  color: ${props => (props.active ? '#fff' : props.theme.text.default)};
  box-shadow: inset -1px 0 ${props => props.theme.border.default};
  font-size: 14px;
  font-weight: ${props => (props.active ? 600 : 500)};
  text-align: center;

  &:hover {
    background: ${props =>
      props.active ? props.theme.brand.default : props.theme.border.default};
    cursor: pointer;
  }

  &:first-of-type {
    border-radius: 8px 0 0 8px;
  }

  &:last-of-type {
    border-radius: 0 8px 8px 0;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    width: 33%;
  }
`;

export const Growth = styled.div`
  padding: 8px;
  border-top: 1px solid ${props => props.theme.border.default};
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  margin: 0 8px;
  justify-content: space-between;
  flex-direction: row-reverse;
`;

export const Positive = styled.div`
  color: ${props => props.theme.success.default};
`;

export const Negative = styled.div`color: ${props => props.theme.warn.alt};`;

export const Neutral = styled.div`color: ${props => props.theme.text.alt};`;

export const Label = styled.div``;
