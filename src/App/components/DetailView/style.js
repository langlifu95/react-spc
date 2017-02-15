import styled from 'styled-components'
import { Palette, Scale, H1, H4 } from '../../../shared/Globals'

export const Header = styled.div`
	flex: 0 0 auto;
	align-self: flex-start;
	width: 100%;
	display: flex;
	background-color: ${Palette.bg.default};
	padding: 32px;
`;

export const StoryTitle = styled(H1)`
	font-size: 28px;
	line-height: 40px;
	font-weight: 800;
	color: ${Palette.text.default};
`;

export const Byline = styled(H4)`
	color: ${Palette.brand.default};
`;

export const FlexColumn = styled.div`
	display:flex;
	flex-direction: column;
`;

export const ViewContainer = styled.div`
	display: flex;
	flex: 1 1 auto;
	height: 100%;
	flex-direction: column;
`;

export const LogicContainer = styled.div`
	flex: 1 0 auto;
	max-height: 100%;
	align-self: stretch;
	flex-direction: column;
	display: flex;
`;

export const NullContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	background: #F5F6F7;
`

export const NullText = styled.h1`
	position: relative;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	margin: 0 auto;
	display: inline-block;
	font-size: 2rem;
	font-weight: 800;
	text-shadow: 0px 1px 0px rgba(255,255,255,0.3);
	color: #c9ccd0;
`
