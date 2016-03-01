( function ( M ) {
	var schemaGatherFlags,
		user = M.require( 'mobile.user/user' );

	/**
	 * GatherFlags schema
	 * https://meta.wikimedia.org/wiki/Schema:GatherFlags
	 *
	 * @class schemaGatherFlags
	 * @singleton
	 */
	schemaGatherFlags = new mw.eventLog.Schema(
		'GatherFlags',
		0,
		{
			userId: mw.user.getId(),
			// FIXME: use mw.user when method available
			// Null when user is anon, set to 0
			userEditCount: user.getEditCount() || 0,
			userGroups: mw.config.get( 'wgUserGroups' ).join( ',' )
		}
	);

	mw.trackSubscribe( 'gather.schemaGatherFlags', function ( topic, data ) {
		schemaGatherFlags.log( data );
	} );

}( mw.mobileFrontend ) );
