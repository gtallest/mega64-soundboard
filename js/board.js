$(document).ready(function(){

  var boardHTML = "";
  var quoteArray = [];
  var charArray = [];
  var quotesAndChars;
  var noAudio = '';

  //Sort alphabetically by cast
  json.sort(function(a,b) {return (a["characterName"] > b["characterName"]) ? 1 : ((b["characterName"] > a["characterName"]) ? -1 : 0);} );

  for(var j in json){

    if(json[j].audio.length === 0){
      noAudio = '<div class="noAudio"><i class="fa fa-microphone-slash"></i><div class="audioSlash"></div></div>';
    }
    else {
      noAudio = '';
    }

    var portraitHTML = '<li>      <div class="portrait-image ' + json[j].characterClass + ' ' + json[j].cast + '">      </div>      <div class="tool-tip">' + json[j].characterName + '<div class="triangle">        </div>      </div>      <div class="speech-bubble"><span class="quote-text">"' + json[j].quote + '"</span><span class="quote-divider"></span><span class="quote-source">-<a href="' + json[j].sourceLink + '" target="_blank">' + json[j].source + '</a></span></div> ' + noAudio + '     <audio preload="none">      <source src="' + json[j].audio[0] + '" type="audio/mp3"/></audio>    </li>\n';

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

  // $('.portrait-image').on('mouseover',function(){
  //   $('.speech-bubble', $(this).parentNode).css('opacity','1');
  // });
  // $('.portrait-image').on('mouseout',function(){
  //   $('.speech-bubble', $(this).parentNode).css('opacity','0');
  // });



  $('.portrait-image').on('click',function(){
    var audio = this.parentNode.getElementsByTagName('audio')[0];
    audio.play();
  });

  $('.quote-filter').on('click',function(){
    $(this).toggleClass('filter-inactive');
  });

  $('.rocco-filter').on('click',function(){
    $('.Rocco').parent().toggle();
  });
  $('.derrick-filter').on('click',function(){
    $('.Derrick').parent().toggle();
  });
  $('.garrett-filter').on('click',function(){
    $('.Garrett').parent().toggle();
  });
  $('.eric-filter').on('click',function(){
    $('.Eric').parent().toggle();
  });
  $('.shawn-filter').on('click',function(){
    $('.Shawn').parent().toggle();
  });
  $('.kevin-filter').on('click',function(){
    $('.Kevin').parent().toggle();
  });
  $('.bryan-filter').on('click',function(){
    $('.Bryan').parent().toggle();
  });

$('#filter-highlight').css('left', $('#search-glass').position().left + 2);

$('#filter-icon').on('click',function(){
  if(!$(this).hasClass('filter-active')){
    $(this).toggleClass('filter-active');
    $('#search-glass').toggleClass('filter-active');
  }
  $('#board-list li').show();
  $('.quote-filter').removeClass('filter-inactive');
  $('#search input').val('');
  $('#search input').keyup();
  $('#filter-highlight').css('left', $('#filter-icon').position().left);
  $('#search').slideUp((function(){
    $('#filter-list').slideDown();
  }));
});
$('#search-glass').on('click',function(){
  if(!$(this).hasClass('filter-active')){
    $(this).toggleClass('filter-active');
    $('#filter-icon').toggleClass('filter-active');
  }
  $('#board-list li').show();
  $('.quote-filter').removeClass('filter-inactive');
  $('#filter-highlight').css('left', $('#search-glass').position().left + 1);
  $('#filter-list').slideUp(function(){
    $('#search').slideDown();
  });
});


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

//Clear
$('#search-clear').on('click',function(){
  $('#search input').val('');
  $('#search input').keyup();
  $('#search-clear').fadeOut();
});

$('#search input').focus(function(){
  $('#search-clear').fadeIn();
}).blur(function(){
  if($(this).val() !== ''){

  }
  else {
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




  var slide = function() {
    $('#board-list').slideDown();
  };
  setTimeout(slide,500);
});
