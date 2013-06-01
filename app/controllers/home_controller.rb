class HomeController < ApplicationController
  def index
    puts I18n.translate('raining', :locale => :th)
    @tweets = twitter.search_tweets('rain')['statuses'].map { |t| t['text'] }
  end
end
