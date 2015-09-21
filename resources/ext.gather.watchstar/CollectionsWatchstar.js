// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
( function ( M ) {

	var CollectionsWatchstar,
		SchemaGather = M.require( 'ext.gather.logging/SchemaGather' ),
		schema = new SchemaGather(),
		CtaDrawer = M.require( 'mobile.drawers/CtaDrawer' ),
		CollectionsContentOverlay = M.require( 'ext.gather.watchstar/CollectionsContentOverlay' ),
		Icon = M.require( 'mobile.startup/Icon' ),
		// FIXME: MobileFrontend code duplication
		watchIcon = new Icon( {
			name: 'watch',
			additionalClassNames: 'icon-32px watch-this-article'
		} ),
		watchedIcon = new Icon( {
			name: 'watched',
			additionalClassNames: 'icon-32px watch-this-article'
		} ),
		user = M.require( 'mobile.user/user' ),
		View = M.require( 'mobile.view/View' );

	/**
	 * A clickable watchstar for managing collections
	 * @class CollectionsWatchstar
	 * @extends View
	 */
	CollectionsWatchstar = View.extend( {
		/**
		 * @inheritdoc
		 */
		events: {
			// Disable clicks on original link
			'click a': 'onLinksClick',
			click: 'onStatusToggle'
		},
		tagName: 'li',
		className: 'collection-star-container',
		template: mw.template.get( 'ext.gather.watchstar', 'star.hogan' ),
		/** @inheritdoc */
		ctaDrawerOptions: {
			content: mw.msg( 'gather-anon-cta' ),
			queryParams: {
				campaign: 'gather',
				returntoquery: 'article_action=add_to_collection',
				warning: 'gather-purpose-login-action'
			},
			signupQueryParams: {
				warning: 'gather-purpose-signup-action'
			}
		},
		/**
		 * @inheritdoc
		 * @cfg {Object} defaults Default options hash.
		 * @cfg {Number} defaults.inCollections number of collections the current page appears in
		 * @cfg {Array} defaults.collections definitions of the users existing collections
		 * @cfg {Boolean} defaults.wasUserPrompted a flag which identifies if the user was prompted
		 *  e.g. by WatchstarPageActionOverlay
		 */
		defaults: {
			page: undefined,
			inCollections: 0,
			label: mw.msg( 'gather-watchstar-button-label' ),
			wasUserPrompted: false,
			collections: undefined
		},
		/** @inheritdoc */
		preRender: function () {
			this.options.watchIconClass = this.options.isWatched ? watchedIcon.getClassName() :
				watchIcon.getClassName();
		},
		/** @inheritdoc */
		postRender: function () {
			var $el = this.$el;
			// For newly authenticated users via CTA force dialog to open.
			if ( this.options.isNewlyAuthenticatedUser ) {
				setTimeout( function () {
					$el.trigger( 'click' );
				}, 500 );
				delete this.options.isNewlyAuthenticatedUser;
			}
			$el.removeClass( 'hidden' );
		},
		/**
		 * Prevent default on incoming events
		 * @param {jQuery.Event} ev
		 */
		onLinksClick: function ( ev ) {
			ev.preventDefault();
		},
		/**
		 * Triggered when a user anonymously clicks on the watchstar.
		 * @method
		 */
		onStatusToggleAnon: function () {
			if ( !this.drawer ) {
				this.drawer = new CtaDrawer( this.ctaDrawerOptions );

			}
			this.drawer.show();
		},
		/** @inheritdoc */
		onStatusToggleUser: function ( ev ) {
			// Open the collections content overlay to deal with this.
			var overlay = this.overlay,
				options = this.options,
				self = this;

			if ( !overlay ) {
				// cache it so state changes internally for this session
				this.overlay = overlay = new CollectionsContentOverlay( {
					page: options.page,
					// FIXME: Should be retrievable from Page
					description: mw.config.get( 'wgMFDescription' ),
					// FIXME: Should be retrievable from Page
					pageImageUrl: mw.config.get( 'wgGatherPageImageThumbnail' ),
					showTutorial: options.wasUserPrompted
				} );
				overlay.on( 'collection-watch', function ( collection, isNewCollection ) {
					/**
					 * @event completed
					 * @param {Boolean} firstTimeUser whether user was prompted
					 * @param {Boolean} newCollection whether the collection watched is new.
					 */
					self.emit(
						'completed',
						options.wasUserPrompted || options.isNewlyAuthenticatedUser,
						isNewCollection
					);
					if ( collection.isWatchlist ) {
						self.newStatus( true );
					}
				} );
				overlay.on( 'collection-unwatch', function ( collection ) {
					if ( collection.isWatchlist ) {
						self.newStatus( false );
					}
				} );
			}
			overlay.show();
			ev.stopPropagation();
		},
		/** @inheritdoc */
		onStatusToggle: function () {
			if ( user.isAnon() ) {
				this.onStatusToggleAnon.apply( this, arguments );
			} else {
				this.onStatusToggleUser.apply( this, arguments );
			}
			schema.log( {
				eventName: 'click',
				source: this.options.wasUserPrompted ? 'onboarding' : 'unknown'
			} );
		},
		/**
		 * Sets a new status on the watchstar.
		 * Only executed for the special Watchlist collection.
		 * @param {bool} newStatus
		 */
		newStatus: function ( newStatus ) {
			if ( newStatus ) {
				this.options.isWatched = true;
				this.render();
				/**
				 * @event watch
				 * Fired when the watch star is changed to watched status
				 */
				this.emit( 'watch' );
			} else {
				this.options.isWatched = false;
				this.render();
				/**
				 * @event unwatch
				 * Fired when the watch star is changed to unwatched status
				 */
				this.emit( 'unwatch' );
			}
		}
	} );
	M.define( 'ext.gather.watchstar/CollectionsWatchstar', CollectionsWatchstar );

}( mw.mobileFrontend ) );
