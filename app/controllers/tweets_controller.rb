class TweetsController < ApplicationController
  include ActionView::Helpers::DateHelper
  respond_to :json

  def index
    @tweets = twitter.search_tweets("#{CGI::escape(params[:q])}&geocode=#{params[:geocode]}")['statuses']
    @tweets.each do |tweet|
      tweet['created_at'] = time_ago_in_words(DateTime.parse(tweet['created_at']))
    end
    respond_with @tweets
  end

  def trends_closest
    @trends = twitter.trends_closet(params[:lat], params[:long])
    respond_with @trends
  end
end
