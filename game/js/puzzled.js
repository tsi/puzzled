
(function($) {

  var settings = {};

  function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  function setPosition(width, height) {
    var pos = {},
        cont = $('.game');
    pos.top = Math.floor((Math.random() * (cont.height() - height)));
    pos.left = Math.floor((Math.random() * (cont.width() - width)));
    if (pos.top < (settings.image.height)) {
      if (cont.width() > settings.image.width) {
        pos.left = Math.floor((Math.random() * (cont.width() - width - settings.image.width))) + settings.image.width;
      }
      else {
        pos.top = Math.floor(Math.random() * (cont.height() - height - settings.image.height)) + settings.image.height;
      }
    }
    else if (pos.left < (settings.image.width)) {
      if (cont.height() > settings.image.height) {
        pos.top = Math.floor((Math.random() * (cont.height() - height - settings.image.height))) + settings.image.height;
      }
      else {
        pos.left = Math.floor((Math.random() * (cont.width() - width - settings.image.width))) + settings.image.width;
      }
    }
    return pos;
  }

  function createDraggable(x, y) {
    var wrp = $('.game'),
    width = settings.image.width/settings.layoutX,
    height = settings.image.height/settings.layoutY,
    pos = setPosition(width, height);
    elem = $('<div />')
      .addClass('puzzle-item')
      .attr('data-x', x)
      .attr('data-y', y)
      .width(width + 'px')
      .height(height + 'px')
      .css({
        'position': 'absolute',
        'top': pos.top,
        'left': pos.left,
        'background-image': 'url(' + settings.imgPath + ')',
        'background-position': settings.image.width/settings.layoutX * x + 'px ' + settings.image.height/settings.layoutY * y + 'px',
        'background-size': settings.image.width + 'px ' + settings.image.height + 'px'
      })
      .draggable({
        cursor: 'move',
        snap: '.puzzle-spot',
        snapMode: 'inner',
        containment: '.game',
        zIndex: 100
      })
      .appendTo(wrp);
  }

  function createDroppable(x, y) {
    $('<div />')
      .addClass('puzzle-spot')
      .attr('data-x', x)
      .attr('data-y', y)
      .width(100/settings.layoutX + '%')
      .height(100/settings.layoutY + '%')
      .appendTo('.puzzle-solution')
      .droppable({
        drop: function(event, ui) {
          var form = $('form#pm-games-game-submit-game'),
          itemX = ui.draggable.attr('data-x'),
          itemY = ui.draggable.attr('data-y');
          if (itemX == $(this).attr('data-x') && itemY == $(this).attr('data-y')) {
            // Drop in place
            ui.draggable
              .offset($(this).offset())
              .draggable("disable")
              .addClass("positioned");
            $(this).droppable( "disable" );
            // Items counter
            $('input[name="completed"]', form).val(function( index, value ) {
              return ++value;
            });
            // Finish the game
            if (ui.draggable.siblings('.puzzle-item').not('.positioned').length == 0) {
              $('.puzzle-item').addClass('game-complete');
              $('<span />')
                .text('WELL DONE!')
                .wrap('<div class="well-done" />')
                .parent()
                .appendTo('.puzzle-solution')
                .fadeTo('slow', 1)
                .delay(2000)
                .fadeOut('slow');
            }
          }
        }
      }
    );
  }

  var gameImgFromTmblr = function() {

    // var link = "http://api.tumblr.com/v2/blog/inspirational-images.tumblr.com/posts";
    var blogName = settings.imgPath.replace(/.*?:\/\//g, "").replace(/\/$/, ""),
        link = "http://api.tumblr.com/v2/blog/" + blogName + "/posts";

    $.ajax({
      type: "GET",
      url : link,
      dataType: "jsonp",
      data: {
        api_key: "fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4"
      }
    }).done(function( data ) {

        var photos,
            randomImg,
            randomPost;

        for (var i = data.response.posts.length - 1; i >= 0; i--) {
          randomPost = Math.floor(Math.random() * data.response.posts.length)
          // console.log(data.response.posts[randomPost]);
          if (data.response.posts[randomPost].photos) {
            photos = data.response.posts[randomPost].photos;
            // console.log(photos);
            for (var i = photos.length - 1; i >= 0; i--) {
              randomImg = Math.floor(Math.random() * photos.length);
              // console.log(photos[randomImg]);
              if (photos[randomImg].original_size.url) {
                settings.imgPath = photos[randomImg].original_size.url;
                break;
              }
            };
            break;
          }
          else {
            alert('Could not find an image. Try again.');
          }
        };

        getImageDimensions();

    });

  }

  var getImageDimensions = function() {
    var widthRatio = $(document).width() > 700 ? 0.7 : 1,
        pageHeight = $(document).height() - 60,
        pageWidth = $(document).width() * widthRatio,
        heightRatio = 1,
        widthRatio = 1,
        minRation = 1;
    $("<img />").attr("src", settings.imgPath).load(function() {
      if (this.height > pageHeight) {
        heightRatio = pageHeight / this.height;
      }
      if (this.width > pageWidth) {
        widthRatio = pageWidth / this.width;
      }
      minRation = Math.min(heightRatio, widthRatio);
      settings.image = {
        width: this.width * minRation * settings.zoom / 100,
        height: this.height * minRation * settings.zoom / 100
      };
      $(document).trigger('puzzled');
    });
  }

  var getGameImage = function(imgPath) {
    var isImg = /\.(jpg|png|gif)$/.test(imgPath) || imgPath.search("http://lorempixel") >= 0;
    var isTmblr = imgPath.search("tumblr.com") >= 0;
    if (isImg) {
      getImageDimensions();
    }
    else if (isTmblr) {
      // http://jsbin.com/sozolajato/1/edit?html,output
      gameImgFromTmblr();
    }
  }

  var puzzled = function(options) {

    // Set up defaults
    var defaults = {
      layoutX: getParameterByName('x') || 5,
      layoutY: getParameterByName('y') || 5,
      zoom: getParameterByName('zoom') || 100,
      imgPath: getParameterByName('img') || 'http://lorempixel.com/400/400/'
    };

    // Overwrite default options with user provided ones.
    settings = $.extend({}, defaults, options);

    getGameImage(settings.imgPath);

    $(document).bind('puzzled', function() {

      $('<div />')
        .addClass('puzzle-solution')
        .width(settings.image.width)
        .height(settings.image.height)
        .appendTo($('.game'));

      for (var y = settings.layoutY; y > 0; y--) {
        for (var x = settings.layoutX; x > 0; x--) {
          createDroppable(x, y);
          createDraggable(x, y);
        }
      }

    });

  }();

})(jQuery);
