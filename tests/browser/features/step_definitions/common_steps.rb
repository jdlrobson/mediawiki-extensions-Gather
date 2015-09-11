Given(/^I am using the mobile site$/) do
  visit(MainPage)
  on(MainPage) do |page|
    page_uri = URI.parse(page.page_url_value)
    # A domain is explicitly given to avoid a bug in earlier versions of Chrome
    domain = page_uri.host == 'localhost' ? nil : page_uri.host
    browser.cookies.add 'mf_useformat', 'true', domain: domain
    page.refresh
  end
end

Given(/^I view one of my public collections$/) do
  # create a collection with a random name
  response = make_collection(@random_string)
  visit(GatherUserCollectionPage, using_params: { id: response.data['id'] })
end

Given(/^I am logged into the mobile website$/) do
  step 'I am using the mobile site'
  visit(LoginPage).login_with(user, password, false)
  expect(on(ArticlePage).is_authenticated_element.when_present(20)).to exist
end

Then(/^I wait$/) do
  sleep 5
end

Given(/^I have Gather$/) do
  on(MainPage) do |page|
    page.goto
    # Disable the onboarding tutorials
    page.browser.execute_script("localStorage.setItem('gather-has-dismissed-tutorial','true');")
    page.browser.execute_script("localStorage.setItem('gather-has-dismissed-mainmenu','true');")

    # A domain is explicitly given to avoid a bug in earlier versions of Chrome
    page_uri = URI.parse(page.page_url_value)
    # A domain is explicitly given to avoid a bug in earlier versions of Chrome
    domain = page_uri.host == 'localhost' ? nil : page_uri.host
    page.browser.cookies.add 'optin', 'beta', domain: domain
    page.refresh
  end
end

Then(/^I see a toast panel$/) do
  expect(on(ArticlePage).toast_panel_element.when_present).to be_visible
end

Given(/^I am on the "(.+)" page$/) do |article|
  # Ensure we do not cause a redirect
  article = article.sub(/ /, '_')
  # article parameters need to be encoded.
  visit(ArticlePage, using_params: { article_name: article })
end

When(/^I click the watchstar$/) do
  on(ArticlePage) do |page|
    page.wait_until do
      # Wait for JS to have fully executed
      browser.execute_script("return mw.loader.getState('ext.gather.init') === 'ready'")
    end
  end
  expect(on(ArticlePage).watch_star_element.when_present).to be_visible
  on(ArticlePage).watch_star_element.when_present.click
end
