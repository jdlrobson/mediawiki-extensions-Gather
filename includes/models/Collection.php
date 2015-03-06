<?php

/**
 * Collection.php
 */

namespace Gather\models;

use \IteratorAggregate;
use \ArrayIterator;
use \User;

/**
 * A collection with a list of items, which are represented by the CollectionItem class.
 */
class Collection extends CollectionBase implements IteratorAggregate {

	/**
	 * The internal collection of items.
	 *
	 * @var CollectionItem[]
	 */
	protected $items = array();

	/**
	 * Adds a item to the collection.
	 *
	 * @param CollectionItem $item
	 */
	public function add( CollectionItem $item ) {
		$this->items[] = $item;
	}

	/**
	 * Adds an array of items to the collection
	 *
	 * @param CollectionItem[] $items list of items to add
	 */
	public function batch( $items ) {
		foreach ( $items as $item ) {
			$this->add( $item );
		}
	}

	/**
	 * Gets the iterator for the internal array
	 *
	 * @return ArrayIterator
	 */
	public function getIterator() {
		return new ArrayIterator( $this->items );
	}

	/**
	 * @return array list of items
	 */
	public function getItems() {
		return $this->items;
	}

	/**
	 * Whether collection has a given title as a member
	 *
	 * @param Title $title
	 *
	 * @return boolean [description]
	 */
	public function hasMember( $title ) {
		foreach ( $this->items as $item ) {
			if ( $item->getTitle()->getFullText() === $title->getFullText() ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns items count
	 *
	 * @return int count of items in collection
	 */
	public function getCount() {
		return count( $this->items );
	}

	/** @inheritdoc */
	public function toArray() {
		$data = parent::toArray();
		$data['items'] = array();
		foreach ( $this->this as $item ) {
			$data['items'][] = $item->toArray();
		}
		return $data;
	}
}
