class LoginPage
  include PageObject
  page_url "Special:Userlogin"

  form(:login_form, index: 0)
end
