class ApplicationController < ActionController::Base
  protect_from_forgery

  def twitter
    twitter ||= PoormanTwitter.new
  end
end
