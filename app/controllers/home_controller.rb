class HomeController < ApplicationController
  def index
    @tweets = twitter.home_timeline.map { |t| t['text'] }
  end
end
