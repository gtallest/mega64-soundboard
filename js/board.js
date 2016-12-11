$(document).ready(function(){

  //Initialize
  var boardHTML = "";
  var quoteArray = [];
  var charArray = [];
  var quotesAndChars;
  var noAudio = '';
  var displayCookieWarning = true;

  //Cookie actions
  //Check for Cookie Warning cookie
  if(!document.cookie.indexOf('cookieWarning')){
    displayCookieWarning = true;
    setWarningCookie();
  }
  else {
    displayCookieWarning = false;
    console.log('warning cookie exists');
  }

  //Sort alphabetically by cast
  json.sort(function(a,b) {return (a["characterName"] > b["characterName"]) ? 1 : ((b["characterName"] > a["characterName"]) ? -1 : 0);} );

  //Create board
  for(var j in json){

    if(json[j].audio.length === 0){
      noAudio = '<div class="noAudio"><i class="fa fa-microphone-slash"></i><div class="audioSlash"></div></div>';
    }
    else {
      noAudio = '';
    }

    var portraitHTML = '<li>      <div class="portrait-image ' + json[j].characterClass + ' ' + json[j].cast + '" data-id=' + json[j].id + '>      </div>      <div class="tool-tip">' + json[j].characterName + '<div class="triangle">        </div>      </div>      <div class="speech-bubble"><span class="quote-text">"' + json[j].quote + '"</span><span class="quote-divider"></span><span class="quote-source">-<a href="' + json[j].sourceLink + '" target="_blank">' + json[j].source + '</a></span></div> ' + noAudio + '     <audio preload="none">      <source src="' + json[j].audio[0] + '" type="audio/mp3"/></audio>    </li>\n';

    boardHTML += portraitHTML;

    quoteArray.push(json[j].quote);
    if(charArray.indexOf(json[j].characterName) > -1){

    }
    else {
      charArray.push(json[j].characterName);
    }

  }

  quotesAndChars = quoteArray.concat(charArray);

  $('#board-list').html(boardHTML);


  // //Touch behavior modification for mobile
  // $('.portrait-image').bind('touchend', function(){
  //   var audio = this.parentNode.getElementsByTagName('audio')[0];
  //   audio.play();
  // });

  $('.portrait-image').on('click',function(){
    var audio = this.parentNode.getElementsByTagName('audio')[0];
    audio.play();
  });

  $('.quote-filter').on('click',function(){
    $(this).toggleClass('filter-inactive');
    $('.' + this.innerHTML).parent().toggle();
  });


$('#filter-highlight').css('left', $('#search-glass').position().left + 5);

$('#filter-icon').on('click',function(){
  if(!$(this).hasClass('filter-active')){
    $(this).toggleClass('filter-active');
    $('#search-glass').removeClass('filter-active');
    $('#favorites-star').removeClass('filter-active');
  }
  $('#board-list').slideUp();
  $('.quote-filter').addClass('filter-inactive');
  $('#search input').val('');
  $('#search input').keyup();
  $('#filter-highlight').css('left', $('#filter-icon').position().left);
  $('#search').slideUp((function(){
    $('#favorites').hide();
    $('#board-list li').hide();
    $('#filter-list').slideDown();
    $('#board-list').slideDown();
  }));
});
$('#search-glass').on('click',function(){
  if(!$(this).hasClass('filter-active')){
    $(this).toggleClass('filter-active');
    $('#filter-icon').removeClass('filter-active');
    $('#favorites-star').removeClass('filter-active');
  }
  $('#board-list').slideUp();
  $('#filter-highlight').css('left', $('#search-glass').position().left + 1);
  $('#filter-list').slideUp(function(){
    $('#favorites').hide();
    $('.quote-filter').removeClass('filter-inactive');
    $('#search').slideDown();
    $('#board-list li').show();
    $('#board-list').slideDown();
  });
});
$('#favorites-star').on('click',function(){
  if(!$(this).hasClass('filter-active')){
    $(this).toggleClass('filter-active');
    $('#filter-icon').removeClass('filter-active');
    $('#search-glass').removeClass('filter-active');
  }
  $('#board-list').slideUp();
  $('#filter-highlight').css('left', $('#favorites-star').position().left + 1);
  $('#filter-list').slideUp(function(){
    $('.quote-filter').removeClass('filter-inactive');
    $('#search').slideUp();
    $('#search input').val('');
    $('#search input').keyup();
    $('#favorites').slideDown();
    // $('#board-list li').show();
    // $('#board-list').slideDown();
  });
})


//Search Filter
$quotes = $('#board-list li');
$('#search input').keyup(function(){
  var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\.*:*-*,*\s+/).join('\\b)(?=.*\\b') + ').*$',
        reg = RegExp(val, 'i'),
        text;
console.log('val: ' + val);
    $quotes.show().filter(function() {
        text = $(this).text().replace(/\s+/g, ' ');
        return !reg.test(text);
    }).hide();
});

//Clear search
$('#search-clear').on('click', function(){
  clearSearch();
});

function clearSearch() {
  $('#search input').val('');
  $('#search input').keyup();
  $('#search-clear').fadeOut();
}

$('#search input')
  .focus(function(){
    $('#search-clear').fadeIn();
    })
    .blur(function(){
      if($(this).val() == ''){
        $('#search-clear').fadeOut();
      }
    });

//Auto Complete?
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

$('#close-timtams').on('click', function(){
  $('#cookies').slideToggle();
});

//Adjust filter highlight for mobile
//$('#filter-highlight').css('left', $('#search-glass').position().left + 2);

var slide = function() {
  $('#board-list').slideDown();
  };

var cookieUp = function() {
  $('#cookies').slideToggle();
};

function setWarningCookie() {
  var warningDate = new Date();
  warningDate.setDate(warningDate.getDate() + 7);
  document.cookie = "cookieWarning=true; expires=" + warningDate.toUTCString() + ";";
  console.log('warning cookie set');
}

  setTimeout(slide,500);

  if(displayCookieWarning){
    setTimeout(cookieUp,1000);
  }


});
