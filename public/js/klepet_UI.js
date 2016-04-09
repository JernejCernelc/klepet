function divElementEnostavniTekst(sporocilo) {
  var jeSmesko = sporocilo.indexOf('http://sandbox.lavbic.net/teaching/OIS/gradivo/') > -1;
  if (jeSmesko) {
    sporocilo = sporocilo.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace('&lt;img', '<img').replace('png\' /&gt;', 'png\' />');
    return $('<div style="font-weight: bold"></div>').html(sporocilo);
  } else {
    return $('<div style="font-weight: bold;"></div>').text(sporocilo);
  }
}

function divElementHtmlTekst(sporocilo) {
  return $('<div></div>').html('<i>' + sporocilo + '</i>');
}

function procesirajVnosUporabnika(klepetApp, socket) {
  var sporocilo = $('#poslji-sporocilo').val();
  sporocilo = dodajSmeske(sporocilo);
  var sistemskoSporocilo;

  if (sporocilo.charAt(0) == '/') {
    sistemskoSporocilo = klepetApp.procesirajUkaz(sporocilo);
    if (sistemskoSporocilo) {
      $('#sporocila').append(divElementHtmlTekst(sistemskoSporocilo));
<<<<<<< HEAD
      dodajSlike(sporocilo, true);
=======
      dodajVideo(sporocilo, true);
>>>>>>> youtube
    }
  } else {
    sporocilo = filtirirajVulgarneBesede(sporocilo);
    klepetApp.posljiSporocilo(trenutniKanal, sporocilo);
    $('#sporocila').append(divElementEnostavniTekst(sporocilo));
<<<<<<< HEAD
    dodajSlike(sporocilo, false);
=======
    dodajVideo(sporocilo, false);
>>>>>>> youtube
    $('#sporocila').scrollTop($('#sporocila').prop('scrollHeight'));
  }
  
  $('#poslji-sporocilo').val('');
}

var socket = io.connect();
var trenutniVzdevek = "", trenutniKanal = "";

var vulgarneBesede = [];
$.get('/swearWords.txt', function(podatki) {
  vulgarneBesede = podatki.split('\r\n');
});

function filtirirajVulgarneBesede(vhod) {
  for (var i in vulgarneBesede) {
    vhod = vhod.replace(new RegExp('\\b' + vulgarneBesede[i] + '\\b', 'gi'), function() {
      var zamenjava = "";
      for (var j=0; j < vulgarneBesede[i].length; j++)
        zamenjava = zamenjava + "*";
      return zamenjava;
    });
  }
  return vhod;
}

$(document).ready(function() {
  var klepetApp = new Klepet(socket);

  socket.on('vzdevekSpremembaOdgovor', function(rezultat) {
    var sporocilo;
    if (rezultat.uspesno) {
      trenutniVzdevek = rezultat.vzdevek;
      $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
      sporocilo = 'Prijavljen si kot ' + rezultat.vzdevek + '.';
    } else {
      sporocilo = rezultat.sporocilo;
    }
    $('#sporocila').append(divElementHtmlTekst(sporocilo));
  });

  socket.on('pridruzitevOdgovor', function(rezultat) {
    trenutniKanal = rezultat.kanal;
    $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
    $('#sporocila').append(divElementHtmlTekst('Sprememba kanala.'));
  });

  socket.on('sporocilo', function (sporocilo) {
    var novElement = divElementEnostavniTekst(sporocilo.besedilo);
    $('#sporocila').append(novElement);
    var original = sporocilo.besedilo;
    var temp = original.substr(original.indexOf(" ") + 1);
<<<<<<< HEAD
    dodajSlike(temp, false);
=======
    dodajVideo(temp, false);
>>>>>>> youtube
  });
  
  socket.on('kanali', function(kanali) {
    $('#seznam-kanalov').empty();

    for(var kanal in kanali) {
      kanal = kanal.substring(1, kanal.length);
      if (kanal != '') {
        $('#seznam-kanalov').append(divElementEnostavniTekst(kanal));
      }
    }

    $('#seznam-kanalov div').click(function() {
      klepetApp.procesirajUkaz('/pridruzitev ' + $(this).text());
      $('#poslji-sporocilo').focus();
    });

  });
  
  socket.on('uporabniki', function(uporabniki) {
    $('#seznam-uporabnikov').empty();
    for (var i=0; i < uporabniki.length; i++) {
      $('#seznam-uporabnikov').append(divElementEnostavniTekst(uporabniki[i]));
    }
    
     $('#seznam-uporabnikov div').click(function() {
      console.log("aaaa");
      $("#poslji-sporocilo").val('/zasebno "' + $(this).text() + '" ');
      $('#poslji-sporocilo').focus();
    });
  });

  setInterval(function() {
    socket.emit('kanali');
    socket.emit('uporabniki', {kanal: trenutniKanal});
  }, 1000);

  $('#poslji-sporocilo').focus();

  $('#poslji-obrazec').submit(function() {
    procesirajVnosUporabnika(klepetApp, socket);
    return false;
  });
});

function dodajSmeske(vhodnoBesedilo) {
  var preslikovalnaTabela = {
    ";)": "wink.png",
    ":)": "smiley.png",
    "(y)": "like.png",
    ":*": "kiss.png",
    ":(": "sad.png"
  };
  for (var smesko in preslikovalnaTabela) {
    vhodnoBesedilo = vhodnoBesedilo.replace(smesko,
      "<img src='http://sandbox.lavbic.net/teaching/OIS/gradivo/" +
      preslikovalnaTabela[smesko] + "' />");
  }
  return vhodnoBesedilo;
}

<<<<<<< HEAD
function dodajSlike(vhodnoBesedilo, zasebno) {
  var str = vhodnoBesedilo.split(" ");
  console.log(str);
  var _sirina = 200;
  var _class = "slike";
  if(zasebno) {
      for(var i = 0; i < str.length; i++) {
      if(/^("?https?:\/\/[^\s]+)/m.test(str[i]) && /((.png"?)|(.jpg"?)|(.gif"?))$/m.test(str[i])) {
        $("#sporocila").append("<div class=" + _class + "><img src=" + str[i]  + " width=" + _sirina + "></div>");
=======
function dodajVideo(vhodnoBesedilo, zasebno) {
  var str = vhodnoBesedilo.split(" ");
  var _sirina = 200;
  var _visina = 150;
  var _class = "video";
  if(zasebno) {
      for(var i = 0; i < str.length; i++) {
      if(/^("?https):\/\/www\.youtube\.com\/watch\?v=(\w{11}"?)$/m.test(str[i])) {
        var IDvidea;
        if(/\w{11}$/m.test(str[i])) {
          IDvidea = str[i].match(/\w{11}$/m);
        }
        else {
          IDvidea = str[i].match(/(\w{11}")$/m);

          IDvidea[0] = IDvidea[0].slice(0,11);
        }
        $("#sporocila").append("<div class=" + _class + "><iframe src='https://www.youtube.com/embed/" + IDvidea[0] + "' width=" + _sirina + " height=" + _visina +" allowfullscreen></iframe></div>");
>>>>>>> youtube
      }
    }
  }
  else {
      for(var i = 0; i < str.length; i++) {
<<<<<<< HEAD
      if(/^(https?:\/\/[^\s]+)/m.test(str[i]) && /((.png)|(.jpg)|(.gif))$/m.test(str[i])) {
        $("#sporocila").append("<div class=" + _class + "><img src=" + str[i]  + " width=" + _sirina + "></div>");
      }
    }
  }
  
=======
      if(/^https:\/\/www\.youtube\.com\/watch\?v=\w{11}$/m.test(str[i])) {
        var IDvidea = str[i].match(/\w{11}$/m);
        $("#sporocila").append("<div class=" + _class + "><iframe src='https://www.youtube.com/embed/" + IDvidea + "' width=" + _sirina + " height=" + _visina +" allowfullscreen></iframe></div>");
      }
    }
  }
>>>>>>> youtube
}
