// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
// Note this code should only ever run in Minerva
( function ( M, $ ) {

	var $star, watchstar, pageActionPointer, actionOverlay,
		bucket, useGatherStar,
		CollectionsGateway = M.require( 'ext.gather.api/CollectionsGateway' ),
		sampleRate = mw.config.get( 'wgGatherEnableSample' ),
		CollectionsWatchstar = M.require( 'ext.gather.watchstar/CollectionsWatchstar' ),
		Watchstar = M.require( 'mobile.watchstar/Watchstar' ),
		PageActionOverlay = M.require( 'mobile.contentOverlays/PointerOverlay' ),
		WatchstarPageActionOverlay = M.require( 'ext.gather.watchstar/WatchstarPageActionOverlay' ),
		Tag = M.require( 'ext.gather.watchstar/Tag' ),
		settingOverlayWasDismissed = 'gather-has-dismissed-tutorial',
		mainMenuPointerDismissed = 'gather-has-dismissed-mainmenu',
		user = M.require( 'mobile.user/user' ),
		context = M.require( 'mobile.context/context' ),
		Page = M.require( 'mobile.startup/Page' ),
		page = new Page( {
			title: mw.config.get( 'wgPageName' ).replace( /_/g, ' ' ),
			isMainPage: mw.config.get( 'wgIsMainPage' ),
			isWatched: $( '#ca-watch' ).hasClass( 'watched' ),
			id: mw.config.get( 'wgArticleId' ),
			namespaceNumber: mw.config.get( 'wgNamespaceNumber' )
		} );

	/**
	 * Determines if collection tutorial should be shown
	 *
	 * @method
	 * @ignore
	 * @returns {Boolean}
	 */
	function shouldShowCollectionTutorial() {
		if (
			mw.config.get( 'wgNamespaceNumber' ) === 0 &&
			// Show when not on the main page
			!page.isMainPage() &&
			// Don't show this when mobile is showing edit tutorial
			mw.util.getParamValue( 'article_action' ) !== 'signup-edit' &&
			// Don't show if the overlay is open as user could have clicked watchstar
			!$( 'html' ).hasClass( 'gather-overlay-enabled' ) &&
			// Tutorial has never been dismissed
			!mw.storage.get( settingOverlayWasDismissed ) &&
			// Feature flag is enabled
			mw.config.get( 'wgGatherShouldShowTutorial' )
		) {
			return true;
		}
		return false;
	}

	/**
	 * Overlay was dismissed.
	 * @method
	 * @ignore
	 */
	function overlayDismissed() {
		mw.storage.set( settingOverlayWasDismissed, true );
	}

	/**
	 * Show a pointer that points to the collection feature.
	 * @method
	 * @param {Watchstar} watchstar to react when actionable
	 * @ignore
	 */
	function showPointer( watchstar ) {
		var $star = watchstar.$el;

		actionOverlay = new WatchstarPageActionOverlay( {
			target: $star
		} );

		// Dismiss when watchstar is clicked
		$star.on( 'click', function () {
			actionOverlay.hide();
			overlayDismissed();
		} );
		// Dismiss when 'No thanks' button is clicked
		actionOverlay.on( 'cancel', overlayDismissed );
		// Toggle WatstarOverlay and dismiss
		actionOverlay.on( 'action', function ( ev ) {
			watchstar.onStatusToggle( ev );
			overlayDismissed();
		} );
		actionOverlay.show();
		// Refresh pointer otherwise it is not positioned
		// FIXME: Remove when ContentOverlay is fixed
		actionOverlay.refreshPointerArrow( $star );
	}

	/**
	 * Reveal the collections link in the main menu.
	 * @return {jQuery.Object} representing the main menu collections link item.
	 * @ignore
	 */
	function revealCollectionsInMainMenu() {
		var mainMenu;
		try {
			mainMenu = M.require( 'skins.minerva.scripts/mainMenu' );
		} catch ( e ) {
			// In desktop mode, nothing to do
			return $();
		}
		if ( !mw.storage.get( mainMenuPointerDismissed ) ) {
			mainMenu.advertiseNewFeature( '.collection-menu-item',
				mw.msg( 'gather-main-menu-new-feature' ) ).done( function ( pointerOverlay ) {
					pointerOverlay.on( 'hide', function () {
						mw.storage.set( mainMenuPointerDismissed, true );
					} );
				} );
		}

		mainMenu.on( 'open', function () {
			if ( actionOverlay ) {
				actionOverlay.hide();
			}
			if ( pageActionPointer ) {
				pageActionPointer.hide();
			}
		} );
		return mainMenu.$( '.collection-menu-item' ).removeClass( 'hidden' );
	}

	/**
	 * Swap out the default watchstar for our link
	 * @param {Page} page
	 * @param {jQuery.Object} $star element to bind to
	 * @ignore
	 */
	function init( page, $star ) {
		var shouldShow = shouldShowCollectionTutorial(),
			$menuItem = revealCollectionsInMainMenu();

		watchstar = new CollectionsWatchstar( {
			gateway: new CollectionsGateway( new mw.Api() ),
			page: page,
			isAnon: user.isAnon(),
			isWatched: $star.hasClass( 'watched' ),
			wasUserPrompted: shouldShow,
			isNewlyAuthenticatedUser: mw.util.getParamValue( 'article_action' ) === 'add_to_collection'
		} );

		watchstar.insertBefore( $star );
		$star.remove();

		// Delay tutorial so it's more noticeable to the user
		setTimeout( function () {
			if ( shouldShow ) {
				showPointer( watchstar );
			}
		}, 1000 );

		watchstar.on( 'completed', function ( firstTimeUser, isNewCollection ) {
			if ( isNewCollection ) {
				// FIXME: Rename pointer overlay?
				// Only append the overlay if it is not there yet
				if ( $( '#mw-mf-page-center .tutorial-overlay' ).length === 0 ) {
					pageActionPointer = new PageActionOverlay( {
						target: $( '#mw-mf-main-menu-button' ),
						summary: mw.msg( 'gather-menu-guider' ),
						cancelMsg: mw.msg( 'gather-add-to-collection-cancel' )
					} ).show();
				}
				// FIXME: Hacky.. Should use MainMenu but Bug: T93257.
				// Only append the tag if there is none.
				if ( $menuItem.find( '.gather-tag' ).length === 0 ) {
					new Tag( {
						label: 'new'
					} ).appendTo( $menuItem );
				}
			}
		} );
	}

	if ( sampleRate > 0 && sampleRate <= 1 ) {
		bucket = mw.experiments.getBucket( {
			name: 'gather',
			enabled: true,
			buckets: {
				control: 1 - sampleRate,
				A: sampleRate
			}
		}, user.getSessionId() );
		useGatherStar = context.isBetaGroupMember() || bucket === 'A';
	} else {
		useGatherStar = context.isBetaGroupMember();
	}

	// Only init when current page is an article
	if ( !page.inNamespace( 'special' ) ) {
		$star = $( '#ca-watch, #ca-unwatch' );
		if ( useGatherStar ) {
			init( page, $star );
		} else {
			watchstar = new Watchstar( {
				el: $star,
				page: page,
				api: new mw.Api(),
				funnel: 'page',
				isAnon: user.isAnon(),
				isWatched: $star.hasClass( 'watched' )
			} );
		}
	} else if ( useGatherStar ) {
		revealCollectionsInMainMenu();
	}

}( mw.mobileFrontend, jQuery ) );
