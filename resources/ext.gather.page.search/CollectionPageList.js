( function ( M, $ ) {

	var PageList = M.require( 'mobile.pagelist/PageList' ),
		Page = M.require( 'mobile.startup/Page' ),
		Icon = M.require( 'mobile.startup/Icon' ),
		CollectionPageList;

	/**
	 * List of items page view
	 * @class PageList
	 * @uses Page
	 * @uses WatchstarApi
	 * @uses Watchstar
	 * @extends View
	 */
	CollectionPageList = PageList.extend( {
		/**
		 * @inheritdoc
		 * @cfg {CollectionsGateway} defaults.collectionGateway
		 */
		defaults: {
			pages: undefined,
			collection: undefined,
			iconButton: new Icon( {
				name: 'tick',
				additionalClassNames: 'status',
				label: mw.msg( 'gather-collection-member' )
			} ).toHtmlString(),
			iconDisabledButton: new Icon( {
				name: 'tick-disabled',
				additionalClassNames: 'status',
				label: mw.msg( 'gather-collection-non-member' )
			} ).toHtmlString()
		},
		/** @inheritdoc */
		events: $.extend( {}, PageList.prototype.events, {
			'click li': 'onChangeMemberStatus'
		} ),
		/** @inheritdoc */
		templatePartials: {
			item: mw.template.get( 'ext.gather.page.search', 'item.hogan' )
		},
		/** @inheritdoc */
		initialize: function ( options ) {
			this._removals = [];
			this._additions = [];
			PageList.prototype.initialize.apply( this, arguments );
			this.collectionsGateway = options.collectionsGateway;
		},
		/**
		 * Event handler for when a member changes status in the collection
		 * @param {jQuery.Event} ev
		 */
		onChangeMemberStatus: function ( ev ) {
			var index,
				$target = $( ev.currentTarget ),
				title = $target.data( 'title' ),
				inCollection = $target.data( 'is-member' ),
				page = new Page( {
					title: title
				} );

			if ( inCollection ) {
				this._removals.push( title );
				index = this._additions.indexOf( title );
				if ( index > -1 ) {
					this._additions.splice( index, 1 );
				}
				$target.find( '.status' ).replaceWith( this.options.iconDisabledButton );
				$target.data( 'is-member', false );
				/**
				 * @event member-removed
				 * @param {Page} page
				 * Fired when member is removed from collection
				 */
				this.emit( 'member-removed', page );
			} else {
				this._additions.push( title );
				index = this._removals.indexOf( title );
				if ( index > -1 ) {
					this._removals.splice( index, 1 );
				}
				$target.find( '.status' ).replaceWith( this.options.iconButton );
				$target.data( 'is-member', true );
				page.options.isMember = true;
				/**
				 * @event member-added
				 * @param {Page} page
				 * Fired when member is removed from collection
				 */
				this.emit( 'member-added', page );
			}
			return false;
		},
		/**
		 * Save any changes made to the collection.
		 */
		saveChanges: function () {
			var d = $.Deferred(),
				additions = this._additions,
				removals = this._removals,
				collection = this.options.collection,
				calls = [];

			if ( additions.length || removals.length ) {
				if ( additions.length ) {
					calls.push( this.collectionGateway.addPagesToCollection( collection.id, additions ) );
				}
				if ( removals.length ) {
					calls.push( this.collectionGateway.removePagesFromCollection( collection.id, removals ) );
				}
				return $.when.apply( $, calls );
			} else {
				return d.resolve();
			}
		},
		/**
		 * Adds or removes an item from the internal changes
		 * @param {String} title of the member to add/remove
		 * @param {Boolean} isRemoved if it is a removal or an addition
		 */
		toggleMember: function ( title, isRemoved ) {
			var index;
			if ( isRemoved ) {
				this._removals.push( title );
				index = this._additions.indexOf( title );
				if ( index > -1 ) {
					this._additions.splice( index, 1 );
				}
			} else {
				this._additions.push( title );
				index = this._removals.indexOf( title );
				if ( index > -1 ) {
					this._removals.splice( index, 1 );
				}
			}
		}
	} );

	M.define( 'ext.gather.page.search/CollectionPageList', CollectionPageList );

}( mw.mobileFrontend, jQuery ) );
