class ArticlePage
  include PageObject

  include URL
  page_url URL.url('<%=params[:article_name]%><%=params[:hash]%>')

  # UI elements
  li(:watch_star, id: 'ca-watch')

  # toast
  div(:toast, class: 'toast')

  # collections
  div(:collections_overlay, css: '.collection-overlay')
  li(:collections_overlay_collection_one, css: '.collection-overlay ul li', index: 0)
end
