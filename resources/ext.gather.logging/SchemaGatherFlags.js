( function ( M, $ ) {
	var Schema = M.require( 'mobile.startup/Schema' ),
		user = M.require( 'mobile.user/user' );

	/**
	 * @class SchemaGatherFlags
	 * @extends Schema
	 */
	function SchemaGatherFlags( options ) {
		Schema.call( this, options );
	}

	OO.mfExtend( SchemaGatherFlags, Schema, {
		/**
		 * @inheritdoc
		 */
		defaults: $.extend( {}, Schema.prototype.defaults, {
			userId: mw.user.getId(),
			// FIXME: use mw.user when method available
			// Null when user is anon, set to 0
			userEditCount: user.getEditCount() || 0,
			userGroups: mw.config.get( 'wgUserGroups' ).join( ',' )
		} ),
		/**
		 * @inheritdoc
		 */
		name: 'GatherFlags'
	} );

	M.define( 'ext.gather.logging/SchemaGatherFlags', SchemaGatherFlags );

}( mw.mobileFrontend, jQuery ) );
