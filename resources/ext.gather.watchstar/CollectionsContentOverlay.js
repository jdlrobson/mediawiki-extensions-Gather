( function ( M, $ ) {

	var CollectionsContentOverlay,
		icons = M.require( 'icons' ),
		toast = M.require( 'toast' ),
		Icon = M.require( 'Icon' ),
		CollectionsApi = M.require( 'ext.gather.watchstar/CollectionsApi' ),
		ContentOverlay = M.require( 'modules/tutorials/ContentOverlay' );

	/**
	 * A clickable watchstar for managing collections
	 * @class CollectionsContentOverlay
	 * @extends ContentOverlay
	 */
	CollectionsContentOverlay = ContentOverlay.extend( {
		/**
		 * FIXME: re-evaluate content overlay default classes/css.
		 * @inheritdoc
		 */
		className: 'collection-overlay content-overlay overlay position-fixed',
		/** @inheritdoc */
		templatePartials: {
			content: mw.template.get( 'ext.gather.watchstar', 'content.hogan' )
		},
		/** @inheritdoc */
		events: {
			click: 'onClickInsideOverlay',
			'click .overlay-content li': 'onSelectCollection',
			'submit form': 'onCreateNewCollection'
		},
		/** @inheritdoc */
		hasFixedHeader: false,
		/** @inheritdoc */
		defaults: {
			/** @inheritdoc */
			fixedHeader: false,
			iconButton: new Icon( {
				name: 'tick',
				label: mw.msg( 'gather-collection-member' )
			} ).toHtmlString(),
			iconDisabledButton: new Icon( {
				name: 'tick-disabled',
				label: mw.msg( 'gather-collection-non-member' )
			} ).toHtmlString(),
			title: mw.config.get( 'wgTitle' ),
			spinner: icons.spinner().toHtmlString(),
			createButtonLabel: mw.msg( 'gather-create-new-button-label' ),
			subheadingNewCollection: mw.msg( 'gather-add-to-new' ),
			subheading: mw.msg( 'gather-add-to-existing' ),
			collections: []
		},
		/** @inheritdoc */
		initialize: function () {
			this.api = new CollectionsApi();
			ContentOverlay.prototype.initialize.apply( this, arguments );
		},
		/** @inheritdoc */
		postRender: function () {
			this.$( '.spinner' ).hide();
		},
		/**
		 * Event handler for setting up a new collection
		 * @param {jQuery.Event} ev
		 */
		onCreateNewCollection: function ( ev ) {
			var self = this,
				api = this.api,
				page = M.getCurrentPage(),
				title = $( ev.target ).find( 'input' ).val();

			ev.preventDefault();

			api.addCollection( title ).done( function ( collection ) {
				api.addPageToCollection( collection.id, page ).done( function () {
					toast.show( mw.msg( 'gather-add-toast', collection.title ), 'toast' );
					self.hide();
				} ).fail( function () {
					toast.show( mw.msg( 'gather-add-failed-toast', title ), 'toast' );
					// Hide since collection was created properly and list is outdated
					self.hide();
				} );
			} ).fail( function () {
				toast.show( mw.msg( 'gather-new-collection-failed-toast', title ), 'toast' );
			} );
		},
		/**
		 * Event handler for all clicks inside overlay.
		 * @param {jQuery.Event} ev
		 */
		onClickInsideOverlay: function ( ev ) {
			ev.stopPropagation();
		},
		/**
		 * Event handler for selecting an existing collection.
		 * @param {jQuery.Event} ev
		 */
		onSelectCollection: function ( ev ) {
			var self = this,
				api = this.api,
				collection,
				$target = $( ev.target ),
				page = M.getCurrentPage();

			collection = {
				title: $target.data( 'collection-title' ),
				id:  $target.data( 'collection-id' )
			};
			api.toggleStatus( page ).done( function () {
				var msg, page = M.getCurrentPage();
				// update current page
				page.options.isWatched = api.isWatchedPage( page );
				// show toast
				msg = api.isWatchedPage( page ) ? 'gather-add-toast' : 'gather-remove-toast';
				toast.show( mw.msg( msg, collection.title ), 'toast' );
				self.hide();
				if ( page.options.isWatched ) {
					/**
					 * @event watch
					 * Fired when the watch star is changed to watched status
					 */
					self.emit( 'watch' );
				} else {
					/**
					 * @event unwatch
					 * Fired when the watch star is changed to unwatched status
					 */
					self.emit( 'unwatch' );
				}
			} );
			this.$( '.spinner' ).show();
			ev.stopPropagation();
		}
	} );
	M.define( 'ext.gather.watchstar/CollectionsContentOverlay', CollectionsContentOverlay );

}( mw.mobileFrontend, jQuery ) );