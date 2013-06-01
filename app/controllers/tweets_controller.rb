class TweetsController < ApplicationController

  respond_to :json

  def index
    @tweets = twitter.search_tweets('rain&' + params[:geocode])['statuses']

    respond_with @tweets
  end
end
