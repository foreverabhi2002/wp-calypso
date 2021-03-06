/**
 * External dependencies
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import DocumentHead from 'components/data/document-head';
import SecurityIcon from 'landing/jetpack-cloud/components/security-icon';
import Main from 'components/main';
import SidebarNavigation from 'my-sites/sidebar-navigation';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import StatsFooter from 'landing/jetpack-cloud/components/stats-footer';
import Upsell from 'landing/jetpack-cloud/components/upsell';
import { getSelectedSiteSlug } from 'state/ui/selectors';
import { recordTracksEvent } from 'state/analytics/actions';

function ScanVPActiveBody() {
	const translate = useTranslate();
	const dispatch = useDispatch();
	return (
		<Upsell
			headerText={ translate( 'Your site has VaultPress' ) }
			bodyText={ translate(
				'Your site already is protected by VaultPress. You can find a link to your VaultPress dashboard below.'
			) }
			buttonLink="https://dashboard.vaultpress.com/"
			buttonText={ translate( 'Visit Dashboard' ) }
			onClick={ () => dispatch( recordTracksEvent( 'cloud_scan_vaultpress_click' ) ) }
			iconComponent={ <SecurityIcon icon="info" /> }
		/>
	);
}

function ScanUpsellBody() {
	const selectedSiteSlug = useSelector( getSelectedSiteSlug );
	const dispatch = useDispatch();
	const translate = useTranslate();
	return (
		<Upsell
			headerText={ translate( 'Your site does not have scan' ) }
			bodyText={ translate(
				'Automatic scanning and one-click fixes keep your site one step ahead of security threats.'
			) }
			buttonLink={ `https://wordpress.com/checkout/jetpack_scan/${ selectedSiteSlug }` }
			onClick={ () => dispatch( recordTracksEvent( 'cloud_scan_upsell_click' ) ) }
			iconComponent={ <SecurityIcon icon="info" /> }
		/>
	);
}

export default function ScanUpsellPage( { reason } ) {
	return (
		<Main className="scan__main">
			<DocumentHead title="Scanner" />
			<SidebarNavigation />
			<PageViewTracker path="/scan/:site" title="Scanner Upsell" />
			<div className="scan__content">
				{ 'vp_active_on_site' === reason ? <ScanVPActiveBody /> : <ScanUpsellBody /> }
			</div>
			<StatsFooter
				noticeText="Failing to plan is planning to fail. Regular backups ensure that should the worst happen, you are prepared. Jetpack Backups has you covered."
				noticeLink="https://jetpack.com/upgrade/backups"
			/>
		</Main>
	);
}
