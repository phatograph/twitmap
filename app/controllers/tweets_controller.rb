class TweetsController < ApplicationController

  respond_to :json

  def index
    @tweets = twitter.search_tweets("#{CGI::escape(params[:q])}&geocode=#{params[:geocode]}")['statuses']

    respond_with @tweets
  end
end
