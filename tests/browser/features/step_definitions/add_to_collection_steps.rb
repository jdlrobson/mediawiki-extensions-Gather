When(/^I select a collection$/) do
  on(ArticlePage).collections_overlay_collection_one_element.when_present.click
end

Then(/^I see the collection dialog$/) do
  expect(on(ArticlePage).collections_overlay_element).to exist
end