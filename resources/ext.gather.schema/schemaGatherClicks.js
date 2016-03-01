( function ( M ) {
	var skinName = mw.config.get( 'skin' ),
		context = M.require( 'mobile.context/context' ),
		mobileMode = context.getMode(),
		user = M.require( 'mobile.user/user' ),
		schemaGather;

	if ( mobileMode ) {
		skinName += '-' + mobileMode;
	}

	/**
	 * Gather schema
	 * https://meta.wikimedia.org/wiki/Schema:GatherClicks
	 *
	 * @class schemaGather
	 * @singleton
	 */
	schemaGather = new mw.eventLog.Schema(
		'GatherClicks',
		0,
		{
			skin: skinName,
			userId: mw.user.getId(),
			// FIXME: use mw.user when method available
			// Null when user is anon, set to 0
			userEditCount: user.getEditCount() || 0
		}
	);

	mw.trackSubscribe( 'gather.schemaGatherClicks', function ( topic, data ) {
		schemaGather.log( data );
	} );

}( mw.mobileFrontend ) );
