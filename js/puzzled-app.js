(function($) {

  function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  var app = function() {

    // Set up defaults
    var src,
        defaults = {
          imgPath: 'http://lorempixel.com/400/400/',
          layoutX: 5,
          layoutY: 5,
          zoom: 100
        },
        opt = {
          imgPath: getParameterByName('img') || defaults.imgPath,
          layoutX: getParameterByName('x') || defaults.layoutX,
          layoutY: getParameterByName('y') || defaults.layoutY,
          zoom: getParameterByName('zoom') || defaults.zoom
        },
        typewatch = (function(){
          var timer = 0;
          return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
          }
        })();

    function updateGameSrc() {
      $('#game').fadeTo('fast', 0, function() {
        opt.imgPath = $('#img').val();
        opt.layoutX = $('#layoutx').val();
        opt.layoutY = $('#layouty').val();
        opt.zoom = $('#zoom').val();
        var attr = gameAttr(opt);
        $('#share').val('http://tsi.github.io/puzzled/' + attr);
        window.history.pushState(null, null, window.location.protocol + "//" + window.location.host + window.location.pathname + attr);
        $('#game')
          .attr('src', 'game/' + attr)
          .load(function() {
            $(this).fadeTo('slow', 1);
          });
      })
    }

    function gameAttr(opt) {
      var attr = '';
      if (opt.imgPath != defaults.imgPath) {
        attr += 'img=' + opt.imgPath
      }
      if (opt.layoutX != defaults.layoutX) {
        if (attr) attr += '&';
        attr += 'x=' + opt.layoutX;
      }
      if (opt.layoutY != defaults.layoutY) {
        if (attr) attr += '&';
        attr += 'y=' + opt.layoutY;
      }
      if (opt.zoom != defaults.zoom) {
        if (attr) attr += '&';
        attr += 'zoom=' + opt.zoom;
      }
      if (attr) attr = '?' + attr;
      return attr;
    }

    function setGameDefaults() {
      if (!$('#img').val()) {
        $('#img').val(opt.imgPath);
      }
      if (!$('#layoutx').val()) {
        $('#layoutx').val(opt.layoutX);
      }
      if (!$('#layouty').val()) {
        $('#layouty').val(opt.layoutY);
      }
      if (!$('#zoom').val()) {
        $('#zoom').val(opt.zoom);
      }
    }

    setGameDefaults()

    $('form input#img').keyup(function () {
      typewatch(function () {
        // executed only 500 ms after the last keyup event.
        updateGameSrc();
      }, 500);
    });

    $('form input[type="number"]').change(function () {
      typewatch(function () {
        updateGameSrc();
      }, 500);
    });

    $('span.rand, .title').mouseup(function () {
      if ($('form input#img').val().toLowerCase().indexOf("lorempixel") < 0 ) {
        $('form input#img').val('http://lorempixel.com/400/400/');
      }
      typewatch(function () {
        updateGameSrc();
      }, 500);
    });

    updateGameSrc();

    $('input[type="text"]').mouseup(function() {
      if (this.selectionStart == this.selectionEnd) {
        this.setSelectionRange(0, this.value.length);
      }
    });

    $(window).load(function() {
      $('body').addClass('loaded');
    });

  }();

})(jQuery);

// Async Sharing Buttons (Facebook, Twitter)
// http://css-tricks.com/snippets/javascript/async-sharing-buttons-g-facebook-twitter/
(function(doc, script) {
  var js,
      fjs = doc.getElementsByTagName(script)[0],
      frag = doc.createDocumentFragment(),
      add = function(url, id) {
          if (doc.getElementById(id)) {return;}
          js = doc.createElement(script);
          js.src = url;
          id && (js.id = id);
          frag.appendChild( js );
      };

    // Facebook SDK
    add('//connect.facebook.net/en_US/all.js#xfbml=1&appId=200103733347528', 'facebook-jssdk');
    // Twitter SDK
    add('//platform.twitter.com/widgets.js');

    fjs.parentNode.insertBefore(frag, fjs);
}(document, 'script'));
