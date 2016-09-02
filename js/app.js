(function() {
    'use strict';
    $('.slider').slider({
        height: '600px',
        full_width: true
    });

    let legislators = [];

    let renderPeople = function() {
        $('#people').empty();

        for (let legislator of legislators) {
            let $col = $('<div class="col s12 m6 l6">');
            let $card = $('<div class="card hoverable">');
            let $content = $('<div class="card-content center">');
            let $name = $('<h6 class="card-title truncate">');

            $name.attr({
                'data-position': 'top',
                'data-tooltip': legislator.name
            });

            $name.tooltip({
                delay: 50,
            });
            $name.text(legislator.name);

            let $photo = $('<img class = "photo">');

            $photo.attr({
              src: legislator.photo,
              alt: `${legislator.photo} Photograph`
            });

            var $id = $('<h6>').text(`ID: ${legislator.id}`)
            var $state = $('<h6>').text(`State: ${legislator.state.toUpperCase()}`);
            var $district = $('<h6>').text(`District: ${legislator.district}`);
            var $chamber = $('<h6>').text(`Chamber: ${legislator.chamber}`);
            var $party = $('<h6>').text(`Party: ${legislator.party}`);

            $content.append($name, $photo, $id, $state, $district, $chamber, $party);
            $card.append($content);

            let $action = $('<div class="card-action center">');
            let $contact = $('<a class="waves-effect waves-light btn modal-trigger">');

            $contact.attr('href', `#${legislator.id}`);
            $contact.text('Contact');

            $action.append($contact);
            $card.append($action);

          var $modal = $(`<div id="${legislator.id}" class="modal">`);
          var $modalContent = $('<div class="modal-content">');
          var $modalHeader = $('<h4>').text(legislator.name);
          var $address = $('<p>').text(`Address: ${legislator.contact[0].address}`);
          var $phone = $('<p>').text(`Phone: ${legislator.contact[0].phone}`);
          let $email = $('<a class = "email">').text(legislator.contact[0].email);
          $email.attr('href', `mailto: ${legislator.contact[0].email}`)

          $modalContent.append($modalHeader, $address, $phone, $email);
          $modal.append($modalContent);

          $col.append($card, $modal);

          $('#people').append($col);

          $('.modal-trigger').leanModal();
        }
    }

    $('form').submit(function() {
        event.preventDefault();
        legislators = [];
        let search = $('#search').val();
        if (search.length == 0) {
            Materialize.toast('Please enter a location!', 3000);
        } else {
            $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search}&key=AIzaSyA7mN9gSK-kj97TSn3oq9l0BrztFlPCG4Y`)
                .then(function(data) {
                    if (data.Error) {
                        console.log(data.Err);
                    } else {
                        let result = data.results[0].geometry.location;
                        let lat = result.lat;
                        let lng = result.lng;
                        $.get(`https://openstates.org/api/v1//legislators/geo/?lat=${lat}&long=${lng}&apikey=7820472d4ec14d6eb316f1c4a0920ae4`)
                            .then(function(legData) {
                                if (legData.Error) {
                                    console.log(legData.Error);
                                } else {
                                    for (var i = 0; i < legData.length; i++) {
                                        let person = legData[i];
                                        legislators.push({
                                            'name': person.full_name,
                                            'id': person.id,
                                            'state': person.state,
                                            'district': person.district,
                                            'party': person.party,
                                            'photo': person.photo_url,
                                            'chamber': person.chamber,
                                            'contact': person.offices,
                                        })
                                    }
                                    renderPeople();
                                }
                            })
                    }
                })
        }
    })
})();
