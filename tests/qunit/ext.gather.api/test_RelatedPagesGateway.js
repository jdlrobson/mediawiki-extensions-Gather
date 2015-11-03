( function ( M, $ ) {
	var RelatedPagesGateway = M.require( 'ext.gather.api/RelatedPagesGateway' ),
		relatedPages = {
			query: {
				pages: {
					123: {
						id: 123,
						title: 'Oh noes',
						ns: 0,
						thumbnail: {
							source: 'http://placehold.it/200x100'
						}
					}
				}
			}
		},
		emptyRelatedPages = {
			query: {
				pages: {
				}
			}
		};

	QUnit.module( 'Gather - Related pages api', {
		/** @inherit */
		setup: function () {
		}
	} );

	QUnit.test( 'Returns an array with the results when api responds', 2, function ( assert ) {
		var api = new mw.Api(),
			gateway = new RelatedPagesGateway( api );
		this.sandbox.stub( api, 'get' ).returns( $.Deferred().resolve( relatedPages ) );
		gateway.getRelatedPages( 'Oh' ).then( function ( results ) {
			assert.ok( $.isArray( results ), 'Results must be an array' );
			assert.strictEqual( results[0].title, 'Oh noes' );
		} );
	} );

	QUnit.test( 'Empty related pages is handled fine.', 2, function ( assert ) {
		var api = new mw.Api(),
			gateway = new RelatedPagesGateway( api );

		this.sandbox.stub( api, 'get' ).returns( $.Deferred().resolve( emptyRelatedPages ) );
		gateway.getRelatedPages( 'Oh' ).then( function ( results ) {
			assert.ok( $.isArray( results ), 'Results must be an array' );
			assert.strictEqual( results.length, 0 );
		} );
	} );

}( mw.mobileFrontend, jQuery ) );
