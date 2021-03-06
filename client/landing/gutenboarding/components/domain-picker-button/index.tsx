/**
 * External dependencies
 */
import React, { createRef, FunctionComponent, useState } from 'react';
import { Button, Dashicon } from '@wordpress/components';

import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { Props as DomainPickerProps } from '../domain-picker';
import DomainPickerPopover from '../domain-picker-popover';
import DomainPickerModal from '../domain-picker-modal';
import { FLOW_ID } from '../../constants';
import { recordTrainTracksEvent, RecordTrainTracksEventProps } from '../../lib/analytics';

/**
 * Style dependencies
 */
import './style.scss';

type DomainSuggestion = import('@automattic/data-stores').DomainSuggestions.DomainSuggestion;

interface Props extends Omit< DomainPickerProps, 'onClose' >, Button.BaseProps {
	className?: string;
	currentDomain?: DomainSuggestion;
	hasContent?: boolean;
	hasPlaceholder?: boolean;
}

const DomainPickerButton: FunctionComponent< Props > = ( {
	children,
	className,
	onDomainSelect,
	currentDomain,
	hasContent,
	hasPlaceholder,
	...buttonProps
} ) => {
	const buttonRef = createRef< HTMLButtonElement >();

	const [ isDomainPopoverVisible, setDomainPopoverVisibility ] = useState( false );
	const [ isDomainModalVisible, setDomainModalVisibility ] = useState( false );

	const handlePopoverClose = ( e?: React.FocusEvent ) => {
		// Don't collide with button toggling
		if ( e?.relatedTarget === buttonRef.current ) {
			return;
		}
		setDomainPopoverVisibility( false );
	};

	const handleModalClose = () => {
		setDomainModalVisibility( false );
	};

	const handleModalCancel = () => {
		setDomainModalVisibility( false );
	};

	const handleMoreOptions = () => {
		setDomainPopoverVisibility( false );
		setDomainModalVisibility( true );
	};

	const recordAnalytics = ( event: RecordTrainTracksEventProps ) => {
		recordTrainTracksEvent( `/${ FLOW_ID }/domain-popover`, event );
	};

	return (
		<>
			<Button
				{ ...buttonProps }
				aria-expanded={ isDomainPopoverVisible }
				aria-haspopup="menu"
				aria-pressed={ isDomainPopoverVisible }
				className={ classnames( 'domain-picker-button', className, {
					'is-open': isDomainPopoverVisible,
					'is-modal-open': isDomainModalVisible,
					'has-content': hasContent,
					'has-placeholder': hasPlaceholder,
				} ) }
				onClick={ () => setDomainPopoverVisibility( ( s ) => ! s ) }
				ref={ buttonRef }
			>
				<span className="domain-picker-button__label">{ children }</span>
				<Dashicon icon="arrow-down-alt2" size={ 16 } />
			</Button>
			<DomainPickerPopover
				isOpen={ isDomainPopoverVisible }
				showDomainConnectButton={ false }
				showDomainCategories={ false }
				currentDomain={ currentDomain }
				onDomainSelect={ onDomainSelect }
				onMoreOptions={ handleMoreOptions }
				onClose={ handlePopoverClose }
				recordAnalytics={ recordAnalytics }
			/>
			<DomainPickerModal
				isOpen={ isDomainModalVisible }
				showDomainConnectButton
				showDomainCategories
				currentDomain={ currentDomain }
				onDomainSelect={ onDomainSelect }
				onClose={ handleModalClose }
				onCancel={ handleModalCancel }
				recordAnalytics={ recordAnalytics }
			/>
		</>
	);
};

export default DomainPickerButton;
