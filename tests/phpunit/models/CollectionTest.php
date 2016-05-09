<?php

/**
 * @group Gather
 */
class CollectionTest extends MediaWikiTestCase {
	public function provideHasMember() {
		return [
			[
				true,
				[ 'foo', 'bar', 'baz' ],
				'foo',
			],
			[
				true,
				[ 'foo', 'bar', 'baz' ],
				'baz',
			],
			[
				false,
				[ 'foo', 'bar', 'baz' ],
				'jon',
			],
		];
	}

	/**
	 * @dataProvider provideHasMember
	 *
	 */
	public function testHasMember( $expected, $items, $member ) {
		$collection = new Gather\models\Collection( 0, User::newFromName( 'test' ) );
		foreach ( $items as $item ) {
			$collection->add( new Gather\models\CollectionItem( Title::newFromText( $item ),
				false, 'Test' ) );
		}
		$this->assertEquals( $expected, $collection->hasMember( Title::newFromText( $member ) ) );
	}
}
