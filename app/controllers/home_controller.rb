class HomeController < ApplicationController
  def index
    puts I18n.translate('raining', :locale => :th)
    @tweets = twitter.search_tweets('rain')['statuses']
    gon.tweet_geos = @tweets.collect do |tweet|
      if tweet['geo_enabled'].eql? true
        {lat: tweet['geo']['coordinates'][0], lng: tweet['geo']['coordinates'][1]}
      end
    end
  end
end
