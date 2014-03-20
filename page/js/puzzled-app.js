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
        };

    function updateGameSrc() {
      console.log('Updating');
      $('iframe').fadeTo('fast', 0, function() {
        opt.imgPath = $('#img').val();
        opt.layoutX = $('#layoutx').val();
        opt.layoutY = $('#layouty').val();
        attr = '?img=' + opt.imgPath + '&x=' + opt.layoutX + '&y=' + opt.layoutY;
        $('#share').val('http://tsi.github.io/puzzled/' + attr);
        $('iframe')
          .attr('src', '../' + attr)
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

    $('form input#img').keydown(function() {
      updateGameSrc();
    });

    $('form input[type="number"]').change(function() {
      updateGameSrc();
    });

    updateGameSrc();

    $(window).load(function() {
      $('body').addClass('loaded');
    });

  }();

})(jQuery);
