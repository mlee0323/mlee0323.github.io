Jekyll::Hooks.register :posts, :pre_render do |post|
  # Only run for posts in 'C.Test' category
  if post.categories.include? 'C.Test'
    
    custom_html = '<div class="ctest-meta" style="margin-bottom: 1.5rem; font-size: 0.95em;">'
    has_data = false

    # 1. Check for Difficulty (which is an array)
    if post.data['difficulty'] && post.data['difficulty'].any?
      has_data = true
      difficulty_tags = post.data['difficulty'].map do |diff|
        "<span style='background-color: #494949; padding: 2px 6px; border-radius: 4px; margin-left: 4px; font-weight: normal; color: white;'>#{diff}</span>"
      end.join('')
      
      custom_html += "<p style='color: #FFD700; margin-bottom: 0.5rem; margin-top: 0;'>"\
                     "  <i class='fa-solid fa-star fa-fw me-1'></i>"\
                     "  <strong>난이도:</strong>#{difficulty_tags}"\
                     "</p>"
    end

    # 2. Check for Retest Date (which is a string)
    if post.data['retest_date']
      has_data = true
      custom_html += "<p style='color: #FF6347; margin-bottom: 0.5rem; margin-top: 0;'>"\
                     "  <i class='fa-solid fa-calendar-check fa-fw me-1'></i>"\
                     "  <strong>Retest:</strong>"\
                     "  <span style='font-weight: normal; margin-left: 4px;'>#{post.data['retest_date']}</span>"\
                     "</p>"
    end
    
    custom_html += '</div>'
    
    # Prepend the custom HTML to the post's content
    if has_data
      post.content = custom_html + post.content
    end
  end
end
