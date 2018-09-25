---
title: Flickr Viewer - Part 2 The Search Bar
---
_This is the second post in a series about building a browser application using nodejs, npm and browserify...and that's it. The current version of the code can be found on [GitHub](http://github.com/wilhelmson/flickr-viewer)_

In my last post, I showed how to get all of the basics set up to build an application using nodejs, npm and browserify. This time we're going to create the first feature: a search bar.

##Objectives
With this project I wanted to set up some constraints in a hope to enfocre what I thought would be good coding practices.
-	Structure the project based on features; rather than your typical Models/, Views/, Controllers/ structure.
-	Break the UI into components
-	Components only know about themselves and their children. They don't know who is using them or abouth any other part of the application for that matter.
-	Components should do only one thing.
-	All communication should be through events.

With those objectives in mind, I think we can get started.

##Just One More Thing
I'm going to be using [Zurb Foundation](http://foundation.zurb.com/) for the CSS. Since writing this project, Foundation has gone from version 4 to 5; this project is using version 4...and a custom build of it at that.

Before you get going, download Foundation (which will also come along with normalize.css) and add the to a new directory called css/; when we build the project, all of the CSS in that directory will be bundled up and written to public/css (make sure you create that directory too).

While we're at it, let's get rid of everything that was in public/index.html and put in something a little more meaningful.

{% highlight html linenos %}
<!Doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Flicker Viewer</title>
    <script src="app.js"></script>
    <link href="css/site.css" rel="stylesheet">
  </head>
  <body>
    <nav class="top-bar">
      <ul class="title-area">
        <li class="name">
          <h1>
          <a href="/">flickr viewer</a>
          <h1>
        </li>
      </ul>
    </nav>
    <div class="row" id="search-container"></div>
  </body>
</html>
{% endhighlight %}

The HTML above sets up a couple of things: a <code>top-bar</code> and a <code>search-container</code>. The <code>search-container</code> is the interesting bit. This is where our Search Bar will be rendered. So let's build it.

##The First Feature
My perference, whenever possible, is to break a project up by feature. All of the source files for a single feature exist in that directory. I find it is a nice way to organize files that are concerned with the same thing. 

{% highlight bash %}
mkdir searchbar && cd searchbar/
{% endhighlight %}

Let's start with the view, shall we?
{% highlight bash %}
touch index.hbs
{% endhighlight %}

Notice the file extension? We'll be writing all of our views in Handlebars.

{% highlight HTML linenos %}
<!-- index.hbs -->
<div class="small-12 columns">
  <h1>Find Photos</h1>
    <div class="row collapse">
      <div class="small-10 columns">
        <input type="text" class="search-term" value="{{term}}" placeholder="Tag Search"/>
	  </div>
	  <div class="small-2 columns">
	    <button class="search-button button prefix">Search</button>
	  </div>
	</div>
</div>
{% endhighlight %}

Pretty simple, no? We've got your typical boiler-plate HTML as you would expect when using a CSS framework. Then we've got an input and we're setting it's value to the <code>term</code> property.

Boring, right? Let's get to the good stuff. But first, a word on modules.

##npm For Much Win
Just because this project doesn't use a framework doesn't mean we're going to build everything from scracth; that would be crazy. One of the reasons for avoiding a framework is to allow us the freedom to develop our abstractions based on the needs of our application. There are plenty of libraries and modules that we can use regardless of how we design our application.

[npm](http://npmjs.org) has everything we need to build our app. Want to listen from when the dom is ready? [Done](https://npmjs.org/package/domready). Want to do event delegation? [No problem](https://npmjs.org/package/dom-delegate).

###Why not jQuery?
jQuery is great, and jQuery is not a framework, so yeah we could bring it in. Personally, I'm trying to remove my dependencies on jQuery. I prefer to use small, specialized components and jQuery is not that. Personally, I primarily use jQuery for DOM manipulation, and modern browsers have made the standard DOM APIs pretty easy to use. I also use it for XHR, but we'll talk about that in a minute.

##The Flickr API
I almost forgot, you'll need to get a [Flickr API key](https://secure.flickr.com/services/apps/create/apply/). We're going to be using <code>flickr.tags.getClusterPhotos</code> method, so take a minute to get [acquainted](https://secure.flickr.com/services/api/flickr.tags.getClusterPhotos.html).

##The Search Bar
Let's write some JS. First, we need a file.
{% highlight bash %}
touch index.js
{% endhighlight %}

Now to bring a few modules. This component is going to be responsible for making a request to the FlickrAPI when a button is clicked and emitting an event with the results of the call. For XHR I chose to use [reqwest](https://npmjs.org/package/reqwest). For event delegation of DOM events, [dom-delegate](https://npmjs.org/package/dom-delegate). For event emitting, well, nodejs has that built in.

{% highlight bash %}
npm install reqwest dom-delegate --save
{% endhighlight %}

{% highlight javascript linenos %}
var Delegate = require('dom-delegate'),
    EventEmitter = require('events').EventEmitter,
    inherit = require('util').inherits
    template = require('./index.hbs'),
    reqwest = require('reqwest'),
    apiKey = 'yourkeyhere',
    baseUrl = "http://api.flickr.com/services/rest/?&api_key=" + apiKey;
    urlSuffix = "&format=json&nojsoncallback=1"

function SearchBar(element){
    EventEmitter.call(this);
    this.element = element;
    this.term = '';
    this.delegate = new Delegate(this.element);
    this.delegate.on('click', '.search-button', this.search.bind(this));
    this.delegate.on('blur', '.search-term', this.update.bind(this));
}

inherit(SearchBar, EventEmitter);

SearchBar.prototype.render = function(){
    this.element.innerHTML = template(this);
};

SearchBar.prototype.update = function(e){
    var term = e.target.value;
    this.term = term || '';
};

SearchBar.prototype.search = function(){
    var url;
    if(this.term){
            url = baseUrl +
            	  "&method=flickr.tags.getClusterPhotos&tag=" + 
            	  this.term + 
            	  urlSuffix;        
            reqwest({
                    url: url,
                    method: 'get',
                    type: 'json',
                    crossOrigin: true,
                    success: function (resp){
                            this.emit('success', resp.photos.photo);
                    }.bind(this),
                    error: function (err){
                            console.log(err);
                    }
            });
    }
};

module.exports = SearchBar;
{% endhighlight %}

So what's going on here? First we need to bring in all of our dependencies. In addition to the modules already discussed, we've got the nodejs EventEmitter, the standard nodejs inherit method, and our Handlebars template; followed by our Flickr API info.

Next we have our SearchBar function. It takes in its containing element, sets up some internal state (term) and registers some handlers using its delegate. If you're not familiar with <code>EventEmitter.call(this)</code>, we're calling the EventEmitter function, but supplying the context of <code>this</code>. Which means our SearchBar gets all of the EventEmitter properties. To make sure we get all of the prototype methods, we use the inherit function. Lastly, we add our own prototype methods; one to update the current term, and one to perform a search then emit the results.

###Bind vs Self
You might have noticed the calls to <code>.bind(this)</code>. This ensures the context of <code>this</code> when our handlers are called. We could have also created a variable to hold <code>this</code>, added all our methods to it, and referenced that variable everywhere instead of <code>this</code>. I have no idea which is better. So if somebody wants to enlighten me, I would love to hear the benefits of either.

##Finishing Up
Obviously our current app.js isn't go to do us any good now. Let's update it.

{% highlight javascript linenos %}
var SearchBar = require('./searchbar'),
    domready = require('domready');

function run(){
    var searchContainer = document.getElementById("search-container"),
    searchbar = new SearchBar(searchContainer);
    searchbar.on('success', alert('wow. so search. very results.')));
    searchbar.render();
};

domready(run);
{% endhighlight %}
Here we bring in our new SearchBar module, and dom-ready. We get our container, create the search bar, listen for the success event, and render our template. Of course, we wait until the DOM is ready.

All that's left to do is bundle everything and see what we've got.

{% highlight bash %}
npm run watch && npm run start
{% endhighlight %}

##When Next We Meet
In the next installment, we'll actually do something interesting with those search result: display a list of clickable thumbnails.
