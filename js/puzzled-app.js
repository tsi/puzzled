(function($) {

  function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  var app = function() {

    // Set up defaults
    var src,
        opt = {
          imgPath: getParameterByName('img') || 'http://lorempixel.com/400/400/',
          layoutX: getParameterByName('x') || 5,
          layoutY: getParameterByName('y') || 5
        },
        typewatch = (function(){
          var timer = 0;
          return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
          }
        })();

    function updateGameSrc() {
      $('iframe').fadeTo('fast', 0, function() {
        opt.imgPath = $('#img').val();
        opt.layoutX = $('#layoutx').val();
        opt.layoutY = $('#layouty').val();
        attr = '?img=' + opt.imgPath + '&x=' + opt.layoutX + '&y=' + opt.layoutY;
        $('#share').val('http://tsi.github.io/puzzled/' + attr);
        $('iframe')
          .attr('src', 'game/' + attr)
          .load(function() {
            $(this).fadeTo('slow', 1);
          });
      })
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

    $('span.rand').mouseup(function () {
      $('form input#img').val('');
      typewatch(function () {
        updateGameSrc();
      }, 500);
    });

    updateGameSrc();

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
