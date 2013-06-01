class HomeController < ApplicationController
  def index
    raining = CGI::escape(I18n.translate('raining', :locale => :th))
    tweets = twitter.search_tweets(raining)
    @tweets = tweets['statuses'].map { |t| t['text'] }
  end
end
