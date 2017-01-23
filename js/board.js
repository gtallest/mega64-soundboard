$(document).ready(function(){

  /* Initialize */
  var boardHTML = "",
      quoteArray = [],
      charArray = [],
      quotesAndChars,
      noAudio = '',
      displayCookieWarning = true;

  /* Assign Cookie Actions */
  //Check for Cookie Warning cookie
  if(document.cookie.indexOf('cookieWarning') == -1){
    displayCookieWarning = true;
  }
  else {
    displayCookieWarning = false;
    console.log('warning cookie exists');
  }

  /* Handle Board Data */
  //Sort alphabetically by character name
  json.sort(function(a,b) {return (a["characterName"] > b["characterName"]) ? 1 : ((b["characterName"] > a["characterName"]) ? -1 : 0);} );

  // Create board
  for(var j in json){

    // If quote has no audio file, include no-audio icon
    if(json[j].audio.length === 0){
      noAudio = '<div class="noAudio"><i class="fa fa-microphone-slash"></i><div class="audioSlash"></div></div>';
    }
    else {
      noAudio = '';
    }

    var portraitHTML = '<li>      <div class="portrait-image ' + json[j].characterClass + ' ' + json[j].cast + '" data-id=' + json[j].id + '>      </div>      <div class="tool-tip">' + json[j].characterName + '<div class="triangle">        </div>      </div>      <div class="speech-bubble"><span class="quote-text">"' + json[j].quote + '"</span><span class="quote-divider"></span><span class="quote-source">-<a href="' + json[j].sourceLink + '" target="_blank">' + json[j].source + '</a></span></div> ' + noAudio + '     <audio preload="none">      <source src="' + json[j].audio[0] + '" type="audio/mp3"/></audio>    </li>\n';

    boardHTML += portraitHTML;

    // Build arrays of quotes and character names for
    // search and auto complete
    quoteArray.push(json[j].quote);
    if(charArray.indexOf(json[j].characterName) > -1){

    }
    else {
      charArray.push(json[j].characterName);
    }

  }
  // Combine quote & characters array
  quotesAndChars = quoteArray.concat(charArray);

  $('#board-list').html(boardHTML);


  /* Board Logic */


  // Ron Paul
  $('div[data-id=016]').on('click',function(e){
    if(window.confirm("You've been warned. Do you really want to continue?")){
      $('body').addClass('trippy');
      $('.portrait-image').css('background-image','url("./images/ron-paul.png")');
      $('div[data-id=016] + .tool-tip + .speech-bubble').css({'display':'block','opacity':'1'});
      $('.ron-paul').toggleClass('super-ron');
      $('.super-ron').css('transition','35s');
      setTimeout(function(){ronReturn();}, 35000);
    } else {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  });

  // Play audio on click
  $('.portrait-image').on('click',function(){
    var audio = this.parentNode.getElementsByTagName('audio')[0];
    audio.play();
  });

  /* Search View */
  $('#search-clear').on('click', function(){
    clearSearch();
  });

  $('#search input')
    .focus(function(){
      $('#search-clear').fadeIn();
      })
      .blur(function(){
        if($(this).val() == ''){
          $('#search-clear').fadeOut();
        }
      });


  /* Filter View */
  $('.quote-filter').on('click',function(){
    $(this).toggleClass('filter-inactive');
    $('.' + this.innerHTML).parent().toggle();
  });

  /* Favorites View */



  /* Change Views Logic */
  $('#filter-icon').on('click',function(){
    changeBoardViewIcon($(this), $('#search-glass'), $('#favorites-star'));
    $('#board-list').slideUp();
    $('.quote-filter').addClass('filter-inactive');
    alignHighlight($(this), 0);
    $('#search').slideUp((function(){
      clearSearch();
      $('#favorites').hide();
      $('#board-list li').hide();
      $('#filter-list').slideDown();
      $('#board-list').slideDown();
    }));
  });
  $('#search-glass').on('click',function(){
    changeBoardViewIcon($(this), $('#filter-icon'), $('#favorites-star'));
    $('#board-list').slideUp();
    alignHighlight($(this), 1);
    $('#filter-list').slideUp(function(){
      $('#favorites').hide();
      $('.quote-filter').removeClass('filter-inactive');
      $('#search').slideDown();
      $('#board-list li').show();
      $('#board-list').slideDown();
    });
  });
  $('#favorites-star').on('click',function(){
    changeBoardViewIcon($(this), $('#filter-icon'), $('#search-glass'));
    $('#board-list').slideUp();
    alignHighlight($(this), 2);
    $('#filter-list').slideUp(function(){
      $('.quote-filter').removeClass('filter-inactive');
      $('#search').slideUp();
      clearSearch();
      $('#favorites').slideDown();
      // $('#board-list li').show();
      // $('#board-list').slideDown();
    });
  });

  /* Scroll Back to Top Logic */
  $(window).scroll(function(){
          if ($(this).scrollTop() > 50) {
              $('#backToTop').fadeIn('slow');
          } else {
              $('#backToTop').fadeOut('slow');
          }
      });

  $('#backToTop').on('click',function(){
    backToTop();
  });

  /* Close Cookie Warning */
  $('#close-timtams').on('click', function(){
    $('#cookies').slideToggle();
    setWarningCookie();
  });


  /* Search Filter Logic */
  $quotes = $('#board-list li');
  $('#search input').keyup(function(){
    var val = '^(?=.*\\b' + $.trim($(this).val().replace(/\*/g,'\\*')).split(/;*\/*<*>*=*\.*:*-*,*!*\&*\'*\s+/).join('\\b)(?=.*\\b') + ').*$';
    val = val.replace(/\\b\\\*/g, '\\B\\*');
    val = val.replace(/\\b\\\:/g, '\\B\\:');
    val = val.replace(/\\\*\\b/g, '\\*\\B');
    val = val.replace(/\\\:\\b/g, '\\:\\B');
    var reg = RegExp(val.replace(/\\b\\\*/g, '\\B\\*'), 'i');
    var text;

  console.log('val: ' + val.replace(/\\b\\\*/g, '\\B\\*'));
      $quotes.show().filter(function() {
          text = $(this).text().replace(/\s+/g, ' ');
          return !reg.test(text);
      }).hide();
  });

  /* Code for AutoComplete */
  var ac = new autoComplete({
      selector: 'input[name="search"]',
      minChars: 1,
      source: function(term, suggest){
          term = term.toLowerCase();
          var choices = quotesAndChars;
          var matches = [];
          for (i=0; i<choices.length; i++)
              if (~choices[i].toLowerCase().indexOf(term)) matches.push(/*"\"" + */choices[i]/*.toUpperCase() + "\""*/);
          suggest(matches);
      },
      onSelect: function(e, term, item){
        $('#search input').keyup();
      }
  });


  /* Mobile Logic */
  $('#gotIt').on('click', function() {
    $('#mobileInstructions').slideUp();
  });

  setTimeout(slide(),500);

  if(displayCookieWarning){
    setTimeout(cookieUp,1000);
  }


  /* Function Declarations */
  function slide() {
    $('#board-list').slideDown();
    }

  function alignHighlight(icon, offset) {
    $('#filter-highlight').css('left', icon.position().left + offset);
  }

  function cookieUp() {
    $('#cookies').slideToggle();
  }

  function backToTop() {
    $("html, body").animate({ scrollTop: 0}, 500);
  }

  function ronReturn() {
    $('.super-ron').css('transition','1s');
    $('.ron-paul').toggleClass('super-ron');
    $('body').removeClass('trippy');
    ronDefault();
  }

  function ronDefault() {
    setTimeout(function(){
      $('div[data-id=016] + .tool-tip + .speech-bubble').css({'display':'none','opacity':'0'});
    }, 1000);
  }

  function setWarningCookie() {
    var warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + 7);
    document.cookie = "cookieWarning=true; expires=" + warningDate.toUTCString() + ";";
    console.log('warning cookie set');
  }

  function changeBoardViewIcon(clicked, other1, other2) {
    if(!clicked.hasClass('filter-active')){
      clicked.toggleClass('filter-active');
      other1.removeClass('filter-active');
      other2.removeClass('filter-active');
    }
  }

  function clearSearch() {
    $('#search input').val('');
    $('#search input').keyup();
    $('#search-clear').fadeOut();
  }

});


/* Extra code for possible future use */

// Touch behavior modification for mobile
// $('.portrait-image').bind('touchend', function(){
//   var audio = this.parentNode.getElementsByTagName('audio')[0];
//   audio.play();
// });

// $('#filter-highlight').css('left', $('#search-glass').position().left + 6);

//Adjust filter highlight for mobile
//$('#filter-highlight').css('left', $('#search-glass').position().left + 2);
