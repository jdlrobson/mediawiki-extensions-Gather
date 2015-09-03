// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
( function ( M, $ ) {

	var $star, watchstar, pageActionPointer, actionOverlay,
		bucket, useGatherStar,
		CollectionsWatchstar = M.require( 'ext.gather.watchstar/CollectionsWatchstar' ),
		Watchstar = M.require( 'mobile.watchstar/Watchstar' ),
		PageActionOverlay = M.require( 'mobile.contentOverlays/PointerOverlay' ),
		WatchstarPageActionOverlay = M.require( 'ext.gather.watchstar/WatchstarPageActionOverlay' ),
		Tag = M.require( 'ext.gather.watchstar/Tag' ),
		settings = M.require( 'settings' ),
		settingOverlayWasDismissed = 'gather-has-dismissed-tutorial',
		mainMenuPointerDismissed = 'gather-has-dismissed-mainmenu',
		user = M.require( 'user' ),
		experiments = M.require( 'experiments' ),
		context = M.require( 'context' ),
		skin = M.require( 'skin' ),
		mainMenu = M.require( 'mainMenu' ),
		Page = M.require( 'Page' ),
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
			!settings.get( settingOverlayWasDismissed ) &&
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
		settings.save( settingOverlayWasDismissed, true );
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
			skin: skin,
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
		if ( !settings.get( mainMenuPointerDismissed ) ) {
			mainMenu.advertiseNewFeature( '.collection-menu-item',
				mw.msg( 'gather-main-menu-new-feature' ), skin ).done( function ( pointerOverlay ) {
					pointerOverlay.on( 'hide', function () {
						settings.save( mainMenuPointerDismissed, true );
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
						skin: skin,
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

	try {
		bucket = experiments.getBucket( 'gather' );
		useGatherStar = context.isBetaGroupMember() || bucket === 'A';
	} catch ( e ) {
		// experiment hasn't been defined. Only enable in beta.
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
				funnel: 'page',
				isAnon: user.isAnon(),
				isWatched: $star.hasClass( 'watched' )
			} );
		}
		skin.emit( 'changed' );
	} else if ( useGatherStar ) {
		revealCollectionsInMainMenu();
	}

}( mw.mobileFrontend, jQuery ) );
