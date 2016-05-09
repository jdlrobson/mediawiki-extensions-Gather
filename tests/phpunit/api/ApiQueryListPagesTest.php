<?php

require_once ( __DIR__ . '/GatherTestCase.php' );

/**
 * @group API
 * @group Database
 * @group medium
 */
class ApiQueryListPagesTest extends GatherTestCase {
	protected $tablesUsed = [ 'gather_list', 'gather_list_item' ];

	public function setUp() {
		parent::setUp();
		$this->setMwGlobals( 'wgGatherAutohideFlagLimit', 3 );
	}

	public function testSort() {
		$listId = $this->createList( 'gatherUser', [ 'P1', 'P2', 'Talk:P3', 'Help:P4', 'P5' ] );

		// FIXME pages are not created in order
		foreach ( [ 'P1', 'P2', 'P3', 'P4', 'P5' ] as $pos => $page ) {
			$this->db->update( 'gather_list_item', [ 'gli_order' => 1 . $pos ],
				[ 'gli_gl_id' => $listId, 'gli_title' => $page ], __METHOD__ );
		}

		$pages = $this->getPagenamesFromResults( $this->doApiRequest( [
			'action' => 'query',
			'list' => 'listpages',
			'lspid' => $listId,
			'lspsort' => 'position',
		] ) );
		$this->assertArrayEquals( [ 'P1', 'P2', 'Talk:P3', 'Help:P4', 'P5' ], $pages, true );

		$pages = $this->getPagenamesFromResults( $this->doApiRequest( [
			'action' => 'query',
			'list' => 'listpages',
			'lspid' => $listId,
			'lspsort' => 'namespace',
		] ) );
		$this->assertArrayEquals( [ 'P1', 'P2', 'P5', 'Talk:P3', 'Help:P4' ], $pages, true );
	}

	// also tests access control for the listmembership API as both use ApiMixinListAccess
	public function testAccessControl() {
		$listId = $this->createList( 'gatherUser', [ 'P1' ] );
		$this->addTestUsers( 'flagger1', 'flagger2', 'flagger3' );
		$request = [
			'action' => 'query',
			'list' => 'listpages',
			'lspid' => $listId,
		];

		$pages = $this->getPagenamesFromResults( $this->doApiRequest( $request ) );
		$this->assertArrayEquals( [ 'P1' ], $pages );

		$this->setListPermissionOverride( $listId, 'hidelist' );
		$this->assertRequestFails( $request );

		$this->setListPermissionOverride( $listId, 'showlist' );
		$this->flagList( 'flagger1', $listId );
		$this->flagList( 'flagger2', $listId );
		$this->flagList( 'flagger3', $listId );
		$this->assertRequestFails( $request );
	}

	/**
	 * Returns page names (without namespace) from a listpages API query result
	 * @param array $ret Return value of doApiRequest()
	 * @return array
	 */
	protected function getPagenamesFromResults( $ret ) {
		$results = $this->getFromResults( $ret, 'listpages' );
		return array_map( function ( $item ) {
			return $item['title'];
		}, $results );
	}
}
