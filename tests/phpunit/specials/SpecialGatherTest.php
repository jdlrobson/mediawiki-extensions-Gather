<?php

/**
 * @group Gather
 */
class SpecialGatherTest extends MediaWikiTestCase {
	public function provideRoutes() {
		return [
			[
				'id/501',
				[ 'id/501', '501', '', 'id' => '501' ],
			],
			[
				'id/501/Title',
				[ 'id/501/Title', '501', '/Title', 'id' => '501' ],
			],
			[
				'id/501Title',
				false,
			],
			[
				'id/',
				false
			],
			[
				'foo',
				false
			],
		];
	}

	/**
	 * @dataProvider provideRoutes
	 *
	 */
	public function testCheckRoute( $subpage, $expected ) {
		$sp = new Gather\SpecialGather();
		$this->assertEquals( $expected, $sp->checkRoute( $subpage ) );
	}
}
