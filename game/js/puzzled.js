
(function($) {

  var settings = {};

  function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  function setPosition(width, height) {
    var pos = {},
        cont = $('.game'),
        margin = 60;
    pos.top = Math.floor((Math.random() * (cont.height() - height)));
    if (pos.top < (settings.image.height + margin)) {
      pos.left = Math.floor((Math.random() * (cont.width() - width - settings.image.width - margin))) + settings.image.width + margin;
    }
    else {
      pos.left = Math.floor((Math.random() * (cont.width() - width)));
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

  var gameImgFromRss = function() {
    $.ajax({
      url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(settings.imgPath),
      dataType: 'json',
      error: function() {
        alert('Could not load ' + settings.imgPath);
      },
      success: function(data) {
        var random = Math.round(Math.random() * data.responseData.feed.entries.length),
            img = $(data.responseData.feed.entries[random].content)[0];
        settings.imgPath = $(img).attr('src');
        getImageDimensions();
      }
    });
  }

  var getImageDimensions = function() {
    var pageHeight = $(document).height() - 60,
        pageWidth = $(document).width() * 0.7,
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

  var getGameImage = function() {
    if (settings.rss) {
      gameImgFromRss();
    }
    else {
      getImageDimensions();
    }
  }

  var puzzled = function(options) {

    // Set up defaults
    var defaults = {
      layoutX: getParameterByName('x') || 5,
      layoutY: getParameterByName('y') || 5,
      zoom: getParameterByName('zoom') || 100,
      imgPath: getParameterByName('img') || 'http://lorempixel.com/400/400/',
      rss: getParameterByName('rss') || 0
    };

    // Overwrite default options with user provided ones.
    settings = $.extend({}, defaults, options);

    getGameImage();

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
