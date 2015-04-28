( function ( M, $ ) {

	var CollectionsApi = M.require( 'ext.gather.api/CollectionsApi' ),
		CollectionFlagOverlay = M.require( 'ext.gather.flag/CollectionFlagOverlay' ),
		Icon = M.require( 'Icon' ),
		api = new CollectionsApi();

	$( function () {
		var flagIcon, $flag,
			$collection = $( '.collection' );

		if ( !$collection.data( 'is-owner' ) && mw.config.get( 'skin' ) === 'minerva' ) {
			flagIcon = new Icon( {
				name: 'collection-flag',
				title: mw.msg( 'gather-flag-collection-flag-label' )
			} );
			// FIXME: See T97077
			$flag = $( flagIcon.toHtmlString() );
			$flag.on( 'click', function ( ev ) {
				var flagOverlay;
				ev.stopPropagation();
				ev.preventDefault();

				if ( !$flag.hasClass( 'disabled' ) ) {
					// Prevent multiple clicks
					$flag.addClass( 'disabled' );
					api.getCollection( $collection.data( 'id' ) ).done( function ( collection ) {
						flagOverlay = new CollectionFlagOverlay( {
							collection: collection
						} );
						flagOverlay.show();
						flagOverlay.on( 'collection-flagged', function () {
							// After flagging, remove flag icon.
							$flag.detach();
						} );
						flagOverlay.on( 'hide', function () {
							$flag.removeClass( 'disabled' );
						} );
					} );
				}
			} );
			$flag.prependTo( '.collection-moderation' );
		}

		$( '.collection-actions' ).addClass( 'visible' );
	} );
}( mw.mobileFrontend, jQuery ) );